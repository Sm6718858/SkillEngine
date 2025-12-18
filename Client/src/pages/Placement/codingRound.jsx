import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  useGetProblemsQuery,
  useImproveCodeWithAIMutation,
  useSubmitSolutionMutation,
} from "@/features/codingApi";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python 3" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "java", label: "Java" },
];

const DEFAULT_CODES = {
  javascript: `console.log("Hello World");`,
  python: `print("Hello World")`,
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello World";
    return 0;
}`,
  c: `#include <stdio.h>
int main() {
    printf("Hello World");
    return 0;
}`,
  java: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
};

export default function CodingRound() {
  const [selected, setSelected] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(DEFAULT_CODES.javascript);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [showProblems, setShowProblems] = useState(false);

  const [showAIOverlay, setShowAIOverlay] = useState(false);
  const [aiCode, setAiCode] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const { data } = useGetProblemsQuery();
  const [submitSolution, { isLoading: running }] =
    useSubmitSolutionMutation();
  const [improveCodeWithAI] = useImproveCodeWithAIMutation();

  const problems = data?.problems || [];

  useEffect(() => {
    if (!selected && problems.length) setSelected(problems[0]);
  }, [problems, selected]);

  useEffect(() => {
    setCode(DEFAULT_CODES[language]);
  }, [language]);

  const handleImproveWithAI = async () => {
    setShowAIOverlay(true);
    setAiLoading(true);
    try {
      const res = await improveCodeWithAI({ code, language }).unwrap();
      setAiCode(res.improvedCode || code);
    } catch {
      setAiCode(code);
    } finally {
      setAiLoading(false);
    }
  };

  const runCode = async () => {
    try {
      const res = await submitSolution({ language, code, stdin }).unwrap();
      setOutput(res.stderr || res.stdout || "Program executed successfully");
    } catch {
      setOutput("Execution failed");
    }
  };

  return (
    <div className="min-h-screen mt-9 pt-9 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/40 via-purple-200/30 to-indigo-200/40 dark:from-gray-950 dark:via-gray-900 dark:to-black">

      <header className="sticky top-0 z-30 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border-b border-white/30 dark:border-gray-700/40">
        <div className="max-w-7xl mx-auto px-4 py-1">

          <div className="md:hidden flex flex-col items-center gap-3">
            <button
              onClick={() => setShowProblems(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm"
            >
              Problems
            </button>

            <h1 className="text-center font-extrabold text-sm leading-snug bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
              Improve Your Coding Skills — Write Code from Scratch
            </h1>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <h1 className="font-extrabold text-lg lg:text-xl bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
              Improve Your Coding Skills — Write Code from Scratch
            </h1>
          </div>

        </div>
      </header>


      {showProblems && (
        <div className="fixed inset-0 z-50 md:hidden hide-scrollbar">
          <div
            onClick={() => setShowProblems(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="absolute left-0 top-0 h-full w-[85%] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl hide-scrollbar">
            <div className="flex justify-between items-center p-4 border-b hide-scrollbar">
              <h2 className="font-bold text-pink-600">
                Problems ({problems.length})
              </h2>
              <button onClick={() => setShowProblems(false)}>✕</button>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto">
              {problems.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelected(p);
                    setShowProblems(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer ${selected?.id === p.id
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                      : "hover:bg-pink-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <p className="font-semibold text-sm">{p.title}</p>
                  <p className="text-xs opacity-70">{p.difficulty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-[300px_1fr] gap-6 hide:scrollbar">

        <aside className="hidden md:flex flex-col rounded-3xl h-[620px] bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/30 dark:border-gray-700/40 shadow-xl hide:scrollbar">
          <h2 className="font-bold text-center py-4 text-pink-600">
            Problems ({problems.length})
          </h2>
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 hide-scrollbar">
            {problems.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className={`p-3 rounded-xl cursor-pointer ${selected?.id === p.id
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                    : "hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`}
              >
                <p className="font-semibold text-sm">{p.title}</p>
                <p className="text-xs opacity-70">{p.difficulty}</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          {selected && (
            <div className="p-5 rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40">
              <h2 className="font-bold text-pink-600 mb-2">
                {selected.title}
              </h2>
              <p className="text-sm opacity-80 leading-relaxed">
                {selected.description}
              </p>
            </div>
          )}

          {selected?.testcases?.length > 0 && (
            <div className="p-5 rounded-3xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40">
              <h3 className="font-bold text-purple-600 mb-3">
                Examples
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
                {selected.testcases.map((tc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-black/90 text-green-400 font-mono text-sm hide:scrollbar"
                  >
                    <div className="text-pink-400 mb-1 font-semibold">
                      Example {i + 1}
                    </div>
                    <div>
                      Input: {JSON.stringify(tc.input)}
                    </div>
                    <div>
                      Output: {JSON.stringify(tc.output)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/30 dark:border-gray-700/40">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-900/60">
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>

            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-900/60">
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </select>

            <button onClick={runCode} disabled={running} className="ml-auto px-6 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white">
              {running ? "Running…" : "Run ▶"}
            </button>

            <button onClick={handleImproveWithAI} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer">
              Improve Code with AI
            </button>
          </div>

          <div className="h-[420px] rounded-3xl overflow-hidden bg-black/80 shadow-2xl">
            <Editor language={language} theme={theme} value={code} onChange={(v) => setCode(v || "")} />
          </div>

          <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} placeholder="Input (stdin)" className="w-full h-24 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl" />

          <pre className="p-5 rounded-3xl bg-black/90 text-green-400 font-mono">
            {output || "Output will appear here…"}
          </pre>
        </main>
      </div>

      {showAIOverlay && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-xl flex items-center justify-center">
          <div className="w-[95%] md:w-[80%] h-[85%] bg-white/50 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-pink-600">AI Improved Code</h2>
              <button className="cursor-pointer" onClick={() => setShowAIOverlay(false)}>✕</button>
            </div>
            <div className="flex-1">
              {aiLoading ? (
                <div className="flex items-center justify-center h-full text-pink-500 animate-pulse">
                  Improving code…
                </div>
              ) : (
                <Editor language={language} theme={theme} value={aiCode} options={{ readOnly: true }} />
              )}
            </div>
            <div className="flex gap-3 p-4 border-t">
              <button onClick={() => { setCode(aiCode); setShowAIOverlay(false); }} className="flex-1 bg-green-600 text-white rounded-xl py-2 cursor-pointer">
                Replace Code
              </button>
              <button onClick={() => setShowAIOverlay(false)} className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl py-2 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
