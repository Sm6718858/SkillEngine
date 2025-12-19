import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Trash2 } from "lucide-react";
import { useAskLectureAIMutation } from "@/features/aiChatApi";

const LectureAIChat = ({ open, onClose, lecture, courseTitle }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const [askAI, { isLoading }] = useAskLectureAIMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!open) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await askAI({
        question: input,
        lectureTitle: lecture?.lectureTitle,
        courseTitle,
        chatHistory: messages,
      }).unwrap();

      setMessages((prev) => [
        ...prev,
        { role: "model", text: res.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "This topic is not covered in this lecture." },
      ]);
    }
  };

  const clearChat = () => setMessages([]);

  const isCode = (text) =>
    text.includes("```") ||
    text.includes(";") ||
    text.includes("{") ||
    text.includes("print") ||
    text.includes("console");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-3">
      <div
        className="
          relative w-full max-w-2xl h-[85vh]
          rounded-3xl overflow-hidden
          bg-white/20 dark:bg-zinc-900/40
          backdrop-blur-2xl
          border border-white/20
          shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          flex flex-col
          animate-in fade-in zoom-in duration-300
        "
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pink-500" size={18} />
            <h3 className="font-semibold text-white text-sm sm:text-base truncate max-w-[220px] sm:max-w-none">
              Ask AI • {lecture?.lectureTitle}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <Trash2
                size={18}
                className="cursor-pointer text-white/60 hover:text-white"
                onClick={clearChat}
                title="Clear chat"
              />
            )}
            <X
              className="cursor-pointer text-white/70 hover:text-white"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center text-white/60 mt-10 text-sm">
              Ask doubts related to this lecture only 👇
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`
                max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${
                  m.role === "user"
                    ? "ml-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                    : isCode(m.text)
                    ? "bg-black/70 text-green-300 font-mono backdrop-blur-xl"
                    : "bg-white/20 dark:bg-zinc-800/50 text-white backdrop-blur-xl"
                }
              `}
            >
              <pre className="whitespace-pre-wrap break-words font-inherit">
                {m.text}
              </pre>
            </div>
          ))}

          {isLoading && (
            <div className="text-white/60 text-sm animate-pulse">
              AI is thinking…
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div
            className="
              flex items-center gap-2
              bg-white/20 dark:bg-zinc-800/50
              backdrop-blur-xl
              rounded-2xl px-4 py-2
              focus-within:ring-2 focus-within:ring-pink-500/60
            "
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask from this lecture…"
              className="
                flex-1 bg-transparent outline-none
                text-white placeholder-white/50 text-sm
              "
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="
                p-2 rounded-xl
                bg-gradient-to-r from-pink-500 to-purple-600
                text-white shadow-lg
                hover:scale-105 transition
                disabled:opacity-50
              "
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureAIChat;
