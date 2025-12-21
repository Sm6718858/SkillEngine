import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useAskVoiceInterviewMutation } from "@/features/interviewApi";
import { useSaveInterviewAttemptMutation } from "@/features/authApi";

const INTERVIEW_TYPES = [
  "Frontend (React)",
  "Backend (Node / Java)",
  "DSA",
  "System Design",
  "HR / Behavioral",
];

const VoiceInterview = () => {
  const recognitionRef = useRef(null);
  const conversationRef = useRef([]);
  const videoRef = useRef(null);

  const [conversation, setConversation] = useState([]);
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);

  const [domain, setDomain] = useState(INTERVIEW_TYPES[0]);
  const [tone, setTone] = useState("friendly");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [askInterview, { isLoading }] = useAskVoiceInterviewMutation();
  const [saveInterviewAttempt] = useSaveInterviewAttemptMutation();

  useEffect(() => {
    if (!started) return;
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {});
  }, [started]);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      setSelectedVoice(v.find((x) => x.lang.startsWith("en")) || v[0]);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, autoListen = false) => {
    if (!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = selectedVoice;
    u.rate = tone === "strict" ? 0.9 : 1;
    u.pitch = tone === "strict" ? 0.9 : 1;
    u.onend = () => autoListen && startListening();
    speechSynthesis.speak(u);
  };

  const startListening = () => {
    if (!recognitionRef.current || listening) return;
    recognitionRef.current.start();
    setListening(true);
  };
  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = async (e) => {
      const userText = e.results[0][0].transcript;
      if (!userText.trim()) return;

      const userMsg = { role: "user", text: userText };
      setConversation((p) => [...p, userMsg]);

      const historyForAI = [...conversationRef.current];

      const res = await askInterview({
        domain,
        tone,
        history: historyForAI,
        answer: userText,
      }).unwrap();

      const aiMsg = { role: "ai", text: res.reply };
      conversationRef.current = [...historyForAI, userMsg, aiMsg];
      setConversation(conversationRef.current);
      speak(res.reply, true);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [askInterview, domain, tone, selectedVoice]);

  const startInterview = () => {
    saveInterviewAttempt();
    const firstQ =
      tone === "strict"
        ? `This is a ${domain} interview. Introduce yourself briefly.`
        : `Welcome 😊 This is your ${domain} interview. Tell me about yourself.`;

    conversationRef.current = [{ role: "ai", text: firstQ }];
    setConversation(conversationRef.current);
    setStarted(true);
    speak(firstQ, true);
  };

  const endInterview = () => {
    stopListening();
    speechSynthesis.cancel();
    setStarted(false);
    setConversation([]);
    conversationRef.current = [];
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-white mt-7 pt-7">

      <div className="
        max-w-6xl mx-auto mb-5 p-4
        bg-white/70 dark:bg-gray-900/60
        backdrop-blur-xl rounded-2xl
        border border-pink-400/30
        flex flex-wrap gap-3 justify-center
      ">
        <select className="px-3 py-2 rounded-lg bg-pink-100 dark:bg-gray-800"
          value={domain} onChange={(e) => setDomain(e.target.value)}>
          {INTERVIEW_TYPES.map((d) => <option key={d}>{d}</option>)}
        </select>

        <select className="px-3 py-2 rounded-lg bg-pink-100 dark:bg-gray-800"
          value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="friendly">😊 Friendly</option>
          <option value="strict">🔥 Strict</option>
        </select>

        <select className="px-3 py-2 rounded-lg bg-pink-100 dark:bg-gray-800"
          value={selectedVoice?.name}
          onChange={(e) =>
            setSelectedVoice(voices.find((v) => v.name === e.target.value))
          }>
          {voices.map((v) => <option key={v.name}>{v.name}</option>)}
        </select>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-pink-400/30">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgb08z67ti5_v10zthOXxgLjpzvrGff2AGlg&s"
            className="w-full h-full object-cover"
            alt="AI Interviewer"
          />
          <span className="absolute bottom-3 left-3 px-3 py-1 text-sm rounded-lg bg-black/60 text-white">
            AI Interviewer
          </span>
        </div>

        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-pink-400/30">
          <video ref={videoRef} autoPlay muted playsInline
            className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 px-3 py-1 text-sm rounded-lg bg-black/60 text-white">
            You
          </span>
          {listening && (
            <span className="absolute top-3 right-3 text-green-400 text-sm">
              🎤 Speaking
            </span>
          )}
        </div>
      </div>

      <div className="
        max-w-6xl mx-auto mt-6 p-4
        bg-white/70 dark:bg-gray-900/60
        backdrop-blur-xl rounded-2xl
        border border-pink-400/30
        max-h-52 overflow-y-auto
      ">
        {conversation.map((m, i) => (
          <p key={i} className="text-sm my-1">
            <b className="text-pink-600">{m.role === "ai" ? "AI" : "You"}:</b>{" "}
            {m.text}
          </p>
        ))}
        {isLoading && <p className="opacity-50 text-center">AI is thinking…</p>}
      </div>

      <div className="flex justify-center gap-6 mt-6">
        {!started ? (
          <button
            onClick={startInterview}
            className="px-8 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg">
            Start Interview
          </button>
        ) : (
          <>
            <button
              onClick={listening ? stopListening : startListening}
              className={`p-4 rounded-full text-white ${
                listening ? "bg-red-600" : "bg-green-600"
              }`}>
              {listening ? <MicOff /> : <Mic />}
            </button>
            <button
              onClick={endInterview}
              className="p-4 rounded-full bg-red-700 text-white">
              <PhoneOff />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;
