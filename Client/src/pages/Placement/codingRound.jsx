import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

const scrollbarStyles = `
.hide-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; }
.hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
`;

const PROBLEM_API =
  "https://raw.githubusercontent.com/CoderShivam2005/skillengine-problems/refs/heads/main/leet_problems_150.json";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", piston: "javascript", version: "18.15.0" },
  { id: "python", label: "Python 3", piston: "python", version: "3.10.0" },
  { id: "cpp", label: "C++", piston: "cpp", version: "10.2.0" },
  { id: "c", label: "C", piston: "c", version: "10.2.0" },
  { id: "java", label: "Java", piston: "java", version: "15.0.2" },
];

export default function CodingRound() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [lang, setLang] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");

  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = scrollbarStyles;
    document.head.appendChild(styleTag);
  }, []);

  useEffect(() => {
    axios.get(PROBLEM_API).then((res) => {
      setProblems(res.data || []);
      setSelected(res.data?.[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const starter = selected.signature?.[lang] ?? "// No starter code available";
    setCode(starter);
  }, [selected, lang]);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");

    const conf = LANGUAGES.find((l) => l.id === lang);

    try {
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: conf.piston,
        version: conf.version,
        files: [{ content: code }],
        stdin,
      });
      const run = res.data.run;
      setOutput((run.output || "") + (run.stderr || ""));
    } catch {
      setOutput("Error executing code");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-7 pt-4">

      <button
        className="md:hidden mb-4 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Hide Problems" : "Show Problems"}
      </button>

      <div className="flex gap-6">

        <div
          className={`
          hide-scrollbar
          ${sidebarOpen ? "block" : "hidden"} 
          md:block
          w-full md:w-72 h-[80vh] overflow-y-auto
          p-4 rounded-2xl mt-4
          bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl
          border border-pink-400/30 shadow-xl
          transition-all duration-300
        `}
        >
          <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">Problem List</h2>

          {problems.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelected(p);
                setSidebarOpen(false);
              }}
              className={`
                cursor-pointer p-3 mb-2 rounded-xl border
                transition-all hover:scale-[1.02]
                ${
                  selected?.id === p.id
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow"
                    : "bg-white/70 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-pink-100"
                }
              `}
            >
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs opacity-75">{p.difficulty}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-6">

          {selected && (
            <div className="p-6 rounded-2xl shadow-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-pink-300/30">
              <h2 className="text-2xl font-bold">{selected.title}</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {selected.description}
              </p>
              {selected.tags && (
                <p className="mt-2 opacity-75 text-sm">Tags: {selected.tags.join(", ")}</p>
              )}
            </div>
          )}

          <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 shadow-lg border border-pink-300/30 flex flex-col md:flex-row gap-4 items-center">

            <div>
              <label className="font-medium">Language:</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="ml-2 px-3 py-2 rounded-lg border dark:bg-gray-900"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="ml-2 px-3 py-2 rounded-lg border dark:bg-gray-900"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <button
              onClick={runCode}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl shadow ml-auto"
            >
              {loading ? "Running..." : "Run ▶"}
            </button>
          </div>

          <div
            className="rounded-2xl overflow-hidden shadow-xl border border-pink-400/30"
            style={{ height: "380px" }}
          >
            <Editor
              language={lang}
              theme={theme}
              value={code}
              onChange={(v) => setCode(v)}
              options={{ fontSize: 15, minimap: { enabled: false }, automaticLayout: true }}
            />
          </div>

          <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border shadow">
            <label className="font-medium">Custom Input (stdin):</label>
            <textarea
              rows={3}
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full mt-2 p-3 rounded-lg border dark:bg-gray-900"
            />
          </div>

          <div className="p-6 bg-black text-green-400 rounded-2xl shadow-inner border border-purple-600/40 whitespace-pre-wrap">
            <h3 className="text-lg font-bold text-white mb-2">Output:</h3>
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}
