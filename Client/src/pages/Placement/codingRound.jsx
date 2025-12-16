import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  useGetProblemsQuery,
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

  const { data } = useGetProblemsQuery();
  const [submitSolution, { isLoading: running }] =
    useSubmitSolutionMutation();

  const problems = data?.problems || [];

  useEffect(() => {
    if (!selected && problems.length) setSelected(problems[0]);
  }, [problems, selected]);

  useEffect(() => {
    setCode(DEFAULT_CODES[language]);
  }, [language]);

  const runCode = async () => {
    try {
      const res = await submitSolution({ language, code, stdin }).unwrap();
      setOutput(res.stderr || res.stdout || "Program executed successfully");
    } catch {
      setOutput("Execution failed ❌");
    }
  };

  const renderTestcases = () => {
    if (!selected?.testcases?.length)
      return <p className="italic text-gray-500">No Example</p>;

    return selected.testcases.map((tc, i) => (
      <div
        key={i}
        className="mb-3 p-4 rounded-2xl bg-black/90 text-green-400 text-sm font-mono"
      >
        <p className="text-pink-400 mb-2 font-semibold">
          Example {i + 1}
        </p>

        <div className="space-y-1 overflow-x-auto">
          <div className="whitespace-nowrap">
            <span className="text-gray-400">Input:</span>{" "}
            {JSON.stringify(tc.input)}
          </div>

          <div className="whitespace-nowrap">
            <span className="text-gray-400">Output:</span>{" "}
            {JSON.stringify(tc.output)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 mt-9 pt-9">

      <header className="sticky top-0 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">

          {/* ---------------- Mobile ---------------- */}
          <div className="md:hidden flex flex-col gap-3">
            <button
              onClick={() => setShowProblems(true)}
              className="
    self-center
    px-4 py-2
    rounded-xl
    bg-gradient-to-r from-pink-600 to-purple-600
    text-white text-sm font-medium
    shadow-md
    cursor-pointer
  "
            >
              Problems
            </button>


            <h1
              className="
          text-center
          font-extrabold
          text-sm
          leading-snug
          bg-gradient-to-r from-pink-600 to-purple-600
          text-transparent bg-clip-text
        "
            >
              Improve Your Coding Skills — Write Code from Scratch
            </h1>
          </div>

          {/* ---------------- Desktop ---------------- */}
          <div className="hidden md:flex items-center justify-center">
            <h1
              className="
          font-extrabold
          text-lg lg:text-xl
          text-center
          bg-gradient-to-r from-pink-600 to-purple-600
          text-transparent bg-clip-text
        "
            >
              Improve Your Coding Skills — Write Code from Scratch
            </h1>
          </div>

        </div>
      </header>


      {/* ---------------- MOBILE PROBLEMS DRAWER ---------------- */}
      {showProblems && (
        <div className="fixed inset-0 z-50 md:hidden ">
          <div
            onClick={() => setShowProblems(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="absolute left-0 top-0 h-full w-[85%] bg-white dark:bg-gray-900 shadow-2xl animate-slideIn flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg text-pink-600">
                Problems ({problems.length})
              </h2>
              <button
                onClick={() => setShowProblems(false)}
                className="text-sm font-semibold text-gray-500 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 hide-scrollbar">
              {problems.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelected(p);
                    setShowProblems(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition ${selected?.id === p.id
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

      <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-[300px_1fr] gap-6">

        {/* ---------------- Desktop Sidebar ---------------- */}
        <aside className="hidden md:flex flex-col rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-pink-300/30 h-[600px]">
          <h2 className="font-bold text-center py-4 text-pink-600">
            Problems ({problems.length})
          </h2>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 hide-scrollbar">
            {problems.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className={`p-3 rounded-xl cursor-pointer transition ${selected?.id === p.id
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                  : "hover:bg-pink-100 dark:hover:bg-gray-800"
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
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border">
              <h2 className="text-2xl font-bold">{selected.title}</h2>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                {selected.description}
              </p>

              <div className="mt-5">
                <h3 className="font-semibold mb-3 text-pink-600">
                  Examples
                </h3>
                {renderTestcases()}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 border">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg border
    bg-white text-gray-900
    dark:bg-gray-900 dark:text-white
    dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="
    px-3 py-2 rounded-lg border
    bg-white text-gray-900
    dark:bg-gray-900 dark:text-white
    dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-pink-500
  "
            >
              <option
                value="vs-dark"
                className="bg-gray-900 text-white"
              >
                Dark
              </option>

              <option
                value="light"
                className="bg-white text-gray-900"
              >
                Light
              </option>
            </select>


            <button
              onClick={runCode}
              disabled={running}
              className="ml-auto px-6 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white"
            >
              {running ? "Running…" : "Run ▶"}
            </button>
          </div>

          {/* Editor */}
          <div className="h-[420px] rounded-3xl overflow-hidden border">
            <Editor
              language={language}
              theme={theme}
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </div>

          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Input (stdin)"
            className="w-full h-24 p-4 rounded-2xl border"
          />

          <pre className="p-5 rounded-3xl bg-black text-green-400 font-mono">
            {output || "Output will appear here…"}
          </pre>
        </main>
      </div>
    </div>
  );
}
