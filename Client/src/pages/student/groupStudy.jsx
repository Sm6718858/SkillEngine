import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useCreateRoomMutation } from "@/features/groupStudyApi";
import { useSubmitSolutionMutation } from "@/features/codingApi";
import { useSelector } from "react-redux";
import { useLoadUserQuery } from "@/features/authApi";


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

    const [users, setUsers] = useState([]);
    const [toast, setToast] = useState(null);

    useLoadUserQuery();

    const { user } = useSelector((state) => state.auth);
    const USER_NAME = user?.name || user?.username || "Anonymous";


    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    //   Whiteboard
    const [tool, setTool] = useState("pen");
    const [strokes, setStrokes] = useState([]);
    const canvasRef = useRef(null);
    const drawing = useRef(false);

    //   Voice
    const [micOn, setMicOn] = useState(true);
    const localStreamRef = useRef(null);
    const peersRef = useRef({});
    const audioRefs = useRef({});
    const voiceStartedRef = useRef(false);


    const [createRoom] = useCreateRoomMutation();
    const [submitSolution, { isLoading: running }] =
        useSubmitSolutionMutation();

    // const USER_NAME = useRef(
    //     `User-${Math.random().toString(36).slice(2, 6)}`
    // ).current;

    // VOICE
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

    //   ROOM
    const handleCreateRoom = async () => {
        const res = await createRoom().unwrap();
        setRoomCode(res.roomCode);

        socket.emit("room:join", {
            roomCode: res.roomCode,
            userName: USER_NAME,
        });

        setJoined(true);
        startVoice();
    };

    const handleJoinRoom = () => {
        socket.emit("room:join", {
            roomCode,
            userName: USER_NAME,
        });

        setJoined(true);
        startVoice();
    };

    useEffect(() => {
        socket.on("room:state", (room) => {
            setMode(room.mode);
            setCode(room.code || "");
            setStrokes(room.board || []);
            setUsers(room.users || []);
        });

        socket.on("room:users", setUsers);

        socket.on("room:user-joined", (name) =>
            showToast(`${name} joined`)
        );

        socket.on("room:user-left", (name) =>
            showToast(`${name} left`)
        );

        socket.on("room:activity", showToast);

        socket.on("mode:updated", setMode);
        socket.on("code:sync", setCode);
        socket.on("code:output", setOutput);

        socket.on("board:sync", (stroke) =>
            setStrokes((prev) => [...prev, stroke])
        );

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
                const audio = document.createElement("audio");
                audio.srcObject = e.streams[0];
                audio.autoplay = true;
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

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
    };


    //    WHITEBOARD DRAW 
    useEffect(() => {
        if (mode !== "whiteboard") return;

        setupCanvas();

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        strokes.forEach((s) => {
            ctx.strokeStyle = s.tool === "eraser" ? "#fff" : "#000";
            ctx.lineWidth = s.tool === "eraser" ? 10 : 2;
            ctx.beginPath();
            ctx.moveTo(s.prevX, s.prevY);
            ctx.lineTo(s.x, s.y);
            ctx.stroke();
        });
    }, [strokes, mode]);


    const startDraw = (e) => {
        drawing.current = true;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        canvas.prevX = (e.clientX - rect.left);
        canvas.prevY = (e.clientY - rect.top);
    };


    const draw = (e) => {
        if (!drawing.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);

        const stroke = {
            prevX: canvas.prevX,
            prevY: canvas.prevY,
            x,
            y,
            tool,
        };

        setStrokes((p) => [...p, stroke]);
        socket.emit("board:update", { roomCode, board: stroke ,userName: USER_NAME});

        canvas.prevX = x;
        canvas.prevY = y;
    };


    const stopDraw = () => (drawing.current = false);

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
        <div className="mt-9 pt-9 max-w-6xl mx-auto relative px-4">
            {toast && (
                <div className="fixed top-5 right-5 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-xl z-50">
                    {toast}
                </div>
            )}

            <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
                Group Study Room
            </h1>

            {!joined && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleCreateRoom}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg"
                    >
                        Create Room
                    </button>

                    <input
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="Room Code"
                        className="border px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />

                    <button
                        onClick={handleJoinRoom}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg"
                    >
                        Join
                    </button>
                </div>
            )}

            {joined && (
                <>
                    <div className="flex flex-col md:flex-row justify-between mt-6 gap-2">
                        <p className="font-semibold">
                            Room Code:{" "}
                            <span className="text-pink-600">{roomCode}</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-yellow-500 break-words">
                            Users: {users.map((u) => u.name).join(", ")}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6 items-center">
                        <button
                            onClick={() =>
                                socket.emit("mode:change", { roomCode, mode: "coding" })
                            }
                            className={`px-4 py-2 rounded-xl cursor-pointer font-semibold ${mode === "coding"
                                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                                : "dark:bg-gray-600"
                                }`}
                        >
                            Coding
                        </button>

                        <button
                            onClick={() =>
                                socket.emit("mode:change", { roomCode, mode: "whiteboard" })
                            }
                            className={`px-4 py-2 rounded-xl cursor-pointer font-semibold ${mode === "whiteboard"
                                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                                : "dark:bg-gray-600"
                                }`}
                        >
                            Whiteboard
                        </button>

                        <button
                            onClick={toggleMic}
                            className={`px-4 py-2 rounded-xl cursor-pointer text-white ${micOn ? "bg-green-600" : "bg-red-600"
                                }`}
                        >
                            {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
                        </button>
                    </div>
                    <br />
                    {mode === "coding" && (
                        <>
                            <Editor
                                height="45vh"
                                language={LANGUAGES.find(
                                    (l) => l.id === language
                                ).monaco}
                                theme="vs-dark"
                                value={code}
                                onChange={(v) => {
                                    setCode(v);
                                    socket.emit("code:update", { roomCode, code: v , userName: USER_NAME});
                                }}
                            />

                            <div className="flex flex-wrap gap-3 mt-4">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="px-4 py-2 rounded-xl border dark:bg-purple-800 dark:text-white"
                                >
                                    {LANGUAGES.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.label}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleRunCode}
                                    disabled={running}
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white cursor-pointer"
                                >
                                    {running ? "Running..." : "Run Code"}
                                </button>
                            </div>

                            <div className="mt-4 bg-black rounded-xl text-green-400 p-4 min-h-[120px]">
                                {output?.stdout && <pre>{output.stdout}</pre>}
                                {output?.stderr && (
                                    <pre className="text-red-400">{output.stderr}</pre>
                                )}
                            </div>
                        </>
                    )}

                    {mode === "whiteboard" && (
                        <>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setTool("pen")}
                                    className={`
      px-4 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer
      ${tool === "pen"
                                            ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-gray-600"
                                        }
    `}
                                >
                                    ✏️ Pen
                                </button>

                                <button
                                    onClick={() => setTool("eraser")}
                                    className={`
      px-4 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer
      ${tool === "eraser"
                                            ? "bg-gradient-to-r from-pink-600 to-purple-800 text-white shadow-lg scale-105"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                        }
    `}
                                >
                                    🧽 Eraser
                                </button>
                            </div>


                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDraw}
                                onMouseMove={draw}
                                onMouseUp={stopDraw}
                                onMouseLeave={stopDraw}
                                className="mt-4 border rounded-xl bg-white w-full h-[400px]"
                            />

                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default GroupStudy;
