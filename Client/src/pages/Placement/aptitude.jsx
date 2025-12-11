import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useSaveQuizResultMutation } from "@/features/authApi";

const modules = [
  { key: "gk", name: "General Knowledge", categories: [9] },
  { key: "english", name: "English Grammar", categories: [9, 10, 20] },
  { key: "maths", name: "Mathematics", categories: [19] },
  { key: "aptitude", name: "Aptitude", categories: [9, 17, 19] },
];

const QUESTIONS_PER_MODULE = 10;
const QUESTION_TIMER = 30;

const Aptitude = () => {
  const [saveQuizResult] = useSaveQuizResultMutation();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [question, setQuestion] = useState(null);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const [correctGlobal, setCorrectGlobal] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [notAttemptedGlobal, setNotAttemptedGlobal] = useState(0);

  const [moduleScore, setModuleScore] = useState({});
  const [moduleCorrectCount, setModuleCorrectCount] = useState(0);

  const [isFinalResult, setIsFinalResult] = useState(false);
  const [timer, setTimer] = useState(QUESTION_TIMER);

  const currentModule = modules[currentModuleIndex];

  useEffect(() => {
    if (!isFinalResult) return;

    saveQuizResult({
      modules: moduleScore,
      totalCorrect: correctGlobal,
      totalQuestions: modules.length * QUESTIONS_PER_MODULE,
      notAttempted: notAttemptedGlobal,
    }).catch(() => {});
  }, [isFinalResult]);

  const loadQuestion = async () => {
    setLoading(true);
    setSelected(null);
    setFeedback("");
    setTimer(QUESTION_TIMER);

    const pickedCategory =
      currentModule.categories[
        Math.floor(Math.random() * currentModule.categories.length)
      ];

    try {
      const res = await axios.get(
        `https://opentdb.com/api.php?amount=1&category=${pickedCategory}&type=multiple`
      );

      const q = res.data.results[0];
      const options = [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      );

      setQuestion({
        question: q.question,
        correct: q.correct_answer,
        options,
      });
    } catch {}

    setLoading(false);
  };

  useEffect(() => {
    loadQuestion();
  }, [currentModuleIndex]);

  useEffect(() => {
    if (!question || selected !== null) return;

    if (timer === 0) {
      handleAnswer(null);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, question, selected]);

  const handleAnswer = (opt) => {
    setSelected(opt);

    if (opt === null) {
      setFeedback("⏳ Time Up - Not Attempted");
      setNotAttemptedGlobal((v) => v + 1);
    } else if (opt === question.correct) {
      setFeedback("Correct 🎉");
      setCorrectGlobal((v) => v + 1);
      setModuleCorrectCount((v) => v + 1);
    } else {
      setFeedback("Wrong ❌");
    }

    const newAttempt = attempted + 1;
    setAttempted(newAttempt);

    if (newAttempt % QUESTIONS_PER_MODULE === 0) {
      setModuleScore((prev) => ({
        ...prev,
        [currentModule.key]: moduleCorrectCount,
      }));

      setModuleCorrectCount(0);

      setTimeout(() => goToNextModule(), 1000);
      return;
    }

    setTimeout(() => loadQuestion(), 800);
  };

  const goToNextModule = () => {
    if (currentModuleIndex + 1 < modules.length)
      setCurrentModuleIndex((i) => i + 1);
    else setIsFinalResult(true);
  };


  if (isFinalResult) {
    const chartData = modules.map((m) => ({
      name: m.name,
      score: moduleScore[m.key] ?? 0,
    }));

    return (
      <div className="
        max-w-3xl mx-auto mt-16 p-8
        bg-white/70 dark:bg-gray-900/60
        backdrop-blur-xl shadow-2xl rounded-3xl
        border border-pink-400/30 dark:border-pink-700/40
        animate-fadeIn
      ">
        <h1 className="
          text-4xl font-extrabold text-center
          bg-gradient-to-r from-pink-600 to-purple-600 
          text-transparent bg-clip-text mb-6
        ">
          Final Performance Report
        </h1>

        <div className="
          w-full h-72 rounded-2xl p-4
          bg-white/60 dark:bg-gray-800/60
          shadow-inner mb-6
        ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#999" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="score" fill="#d946ef" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {modules.map((m) => (
          <p className="text-lg text-center my-1" key={m.key}>
            <b>{m.name}:</b> {moduleScore[m.key] ?? 0} / {QUESTIONS_PER_MODULE}
          </p>
        ))}

        <h2 className="
          text-3xl font-bold text-center mt-6
          bg-gradient-to-r from-purple-600 to-pink-600 
          text-transparent bg-clip-text
        ">
          Total Score: {correctGlobal} / {modules.length * QUESTIONS_PER_MODULE}
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Not Attempted: {notAttemptedGlobal}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="
            mt-8 w-full py-3 rounded-xl font-semibold
            bg-gradient-to-r from-pink-600 to-purple-600 
            text-white shadow-lg
            hover:opacity-90 transition
          "
        >
          Restart Test
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-5">

      <div className="
        flex justify-between mb-10 p-4 rounded-xl 
        bg-white/60 dark:bg-gray-900/50
        shadow-lg backdrop-blur-xl
        border border-pink-400/30 dark:border-pink-800/40
      ">
        {modules.map((m, i) => {
          const active = currentModuleIndex === i;
          const done = i < currentModuleIndex;

          return (
            <div key={m.key} className="w-full flex flex-col items-center">
              <div className={`
                px-3 py-1 rounded-lg text-sm font-semibold
                transition-all
                ${
                  active
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105"
                    : done
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }
              `}>
                {m.name}
              </div>

              {i < modules.length - 1 && (
                <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 my-2"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mb-5">
        <span className="font-semibold text-lg">
          ⏳ Time Left:{" "}
          <span className={timer <= 5 ? "text-red-500" : "text-pink-600"}>
            {timer}s
          </span>
        </span>
      </div>

      <div className="
        bg-white/80 dark:bg-gray-800/70 
        p-8 rounded-2xl shadow-xl backdrop-blur-xl
        border border-pink-300/30 dark:border-pink-800/40
      ">
        <h2
          className="text-xl font-bold mb-6"
          dangerouslySetInnerHTML={{ __html: question?.question }}
        />

        <div className="flex flex-col gap-3">
          {question?.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              dangerouslySetInnerHTML={{ __html: opt }}
              className={`
                p-3 rounded-xl border transition-all text-left
                ${
                  selected === opt
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent"
                    : "hover:bg-pink-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                }
              `}
            />
          ))}
        </div>

        {feedback && (
          <p className="mt-5 text-lg font-semibold text-center">
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default Aptitude;
