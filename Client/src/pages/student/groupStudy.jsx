import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useCreateRoomMutation } from "@/features/groupStudyApi";
import { useSubmitSolutionMutation } from "@/features/codingApi";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});


const LANGUAGES = [
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "c", label: "C", monaco: "c" },
  { id: "java", label: "Java", monaco: "java" },
];

const rtcConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const GroupStudy = () => {
  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [mode, setMode] = useState("coding");

  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);

  const [tool, setTool] = useState("pen");
  const [strokes, setStrokes] = useState([]);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const [micOn, setMicOn] = useState(true);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const audioRefs = useRef({});
  const voiceStartedRef = useRef(false);

  const [createRoom] = useCreateRoomMutation();
  const [submitSolution, { isLoading: running }] =
    useSubmitSolutionMutation();

  const startVoice = async () => {
    if (voiceStartedRef.current) return;
    voiceStartedRef.current = true;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    socket.emit("voice:join", { roomCode });
  };

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const handleCreateRoom = async () => {
    const res = await createRoom().unwrap();
    setRoomCode(res.roomCode);
    socket.emit("room:join", { roomCode: res.roomCode });
    setJoined(true);
    startVoice();
  };

  const handleJoinRoom = () => {
    socket.emit("room:join", { roomCode });
    setJoined(true);
    startVoice();
  };

  useEffect(() => {
    socket.on("room:state", (room) => {
      setMode(room.mode);
      setCode(room.code || "");
      setStrokes(room.board || []);
    });

    socket.on("mode:updated", setMode);
    socket.on("code:sync", setCode);
    socket.on("board:sync", (stroke) =>
      setStrokes((prev) => [...prev, stroke])
    );
    socket.on("code:output", setOutput);

    /* -------- VOICE -------- */
    socket.on("voice:user-joined", async (peerId) => {
      if (peersRef.current[peerId]) return;

      const pc = new RTCPeerConnection(rtcConfig);
      peersRef.current[peerId] = pc;

      localStreamRef.current
        ?.getTracks()
        .forEach((t) => pc.addTrack(t, localStreamRef.current));

      pc.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("voice:ice", { to: peerId, candidate: e.candidate });
      };

      pc.ontrack = (e) => {
        if (audioRefs.current[peerId]) return;
        const audio = document.createElement("audio");
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
        audioRefs.current[peerId] = audio;
        document.body.appendChild(audio);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("voice:offer", { to: peerId, offer });
    });

    socket.on("voice:offer", async ({ from, offer }) => {
      if (peersRef.current[from]) return;

      const pc = new RTCPeerConnection(rtcConfig);
      peersRef.current[from] = pc;

      localStreamRef.current
        ?.getTracks()
        .forEach((t) => pc.addTrack(t, localStreamRef.current));

      pc.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("voice:ice", { to: from, candidate: e.candidate });
      };

      pc.ontrack = (e) => {
        if (audioRefs.current[from]) return;
        const audio = document.createElement("audio");
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
        audioRefs.current[from] = audio;
        document.body.appendChild(audio);
      };

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("voice:answer", { to: from, answer });
    });

    socket.on("voice:answer", ({ from, answer }) =>
      peersRef.current[from]?.setRemoteDescription(answer)
    );

    socket.on("voice:ice", ({ from, candidate }) =>
      peersRef.current[from]?.addIceCandidate(candidate)
    );

    return () => socket.off();
  }, []);

  useEffect(() => {
    if (mode !== "whiteboard") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((s) => {
      ctx.strokeStyle = s.tool === "eraser" ? "#ffffff" : "#000000";
      ctx.lineWidth = s.tool === "eraser" ? 20 : 2;
      ctx.beginPath();
      ctx.moveTo(s.prevX, s.prevY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });
  }, [strokes, mode]);

  const startDraw = (e) => {
    drawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.prevX = e.clientX - rect.left;
    canvasRef.current.prevY = e.clientY - rect.top;
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const stroke = {
      prevX: canvasRef.current.prevX,
      prevY: canvasRef.current.prevY,
      x,
      y,
      tool,
    };

    setStrokes((p) => [...p, stroke]);
    socket.emit("board:update", { roomCode, board: stroke });

    canvasRef.current.prevX = x;
    canvasRef.current.prevY = y;
  };

  const stopDraw = () => {
    drawing.current = false;
  };

  const handleRunCode = async () => {
    try {
      const res = await submitSolution({ code, language }).unwrap();
      socket.emit("code:run", { roomCode, output: res });
    } catch {
      socket.emit("code:run", {
        roomCode,
        output: { stderr: "Execution failed" },
      });
    }
  };

  return (
    <div className="mt-9 pt-9 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Group Study Room</h1>

      {!joined && (
        <div className="flex gap-3">
          <button onClick={handleCreateRoom} className="bg-pink-600 text-white px-4 py-2 rounded">
            Create Room
          </button>
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
            className="border px-3 py-2"
          />
          <button onClick={handleJoinRoom} className="bg-green-600 text-white px-4 py-2 rounded">
            Join
          </button>
        </div>
      )}

      {joined && (
        <>
          <div className="flex gap-3 mt-6 items-center">
            <button onClick={() => socket.emit("mode:change", { roomCode, mode: "coding" })}>
              Coding
            </button>
            <button onClick={() => socket.emit("mode:change", { roomCode, mode: "whiteboard" })}>
              Whiteboard
            </button>

            <button
              onClick={toggleMic}
              className={`px-3 py-1 rounded text-white ${
                micOn ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
            </button>
          </div>

          {mode === "coding" && (
            <>
              <Editor
                height="350px"
                language={LANGUAGES.find(l => l.id === language).monaco}
                theme="vs-dark"
                value={code}
                onChange={(v) => {
                  setCode(v);
                  socket.emit("code:update", { roomCode, code: v });
                }}
              />

              <div className="flex gap-3 mt-3">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>

                <button onClick={handleRunCode} disabled={running}>
                  {running ? "Running..." : "Run Code"}
                </button>
              </div>

              <div className="mt-4 bg-black text-green-400 p-3 min-h-[120px]">
                {output?.stdout && <pre>{output.stdout}</pre>}
                {output?.stderr && <pre className="text-red-400">{output.stderr}</pre>}
              </div>
            </>
          )}

          {mode === "whiteboard" && (
            <>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setTool("pen")}>✏️ Pen</button>
                <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
              </div>

              <canvas
                ref={canvasRef}
                width={900}
                height={400}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                className="mt-3 border bg-white"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GroupStudy;
