/*
 * Copyright (c) 2025 Shivam Mishra
 * Licensed under GPL-3.0
 */

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askLectureAI = async (req, res) => {
  try {
    // console.log("Lecture AI HIT");

    const { question, lectureTitle, courseTitle, chatHistory } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const history = Array.isArray(chatHistory) ? chatHistory : [];

    const codeKeywords = [
      "code",
      "program",
      "syntax",
      "example",
      "operators",
      "implementation",
      "write",
      "snippet",
    ];

    const isCodeQuestion = codeKeywords.some((kw) =>
      question.toLowerCase().includes(kw)
    );

    const prompt = isCodeQuestion
      ? `
You are a STRICT lecture-only programming teacher.

RULES:
- Answer ONLY if related to this lecture
- If not related, reply EXACTLY:
  "This topic is not covered in this lecture."
- Give VERY SHORT explanation (1–3 lines max)
- Then give CLEAN code
- NO long theory
- NO unnecessary comments
- Code must be simple and readable

Lecture Topic:
Course: ${courseTitle || "N/A"}
Lecture: ${lectureTitle || "N/A"}

Student Question:
${question}

Format:
1–3 line explanation
Then code block
`
      : `
You are a STRICT lecture-only teacher AI.

ABSOLUTE RULES:
- Answer ONLY if related to this lecture
- If not related, reply EXACTLY:
  "This topic is not covered in this lecture."
- Answer in ONLY 2 or 3 SHORT lines
- Each line must be ONE simple sentence
- NO paragraphs
- NO extra theory

Lecture Topic:
Course: ${courseTitle || "N/A"}
Lecture: ${lectureTitle || "N/A"}

Student Question:
${question}

REMEMBER:
2–3 lines ONLY.
`;

    // console.log("Using model: gemini-2.5-flash");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    let reply =
      result?.response?.text?.() ||
      "This topic is not covered in this lecture.";

    if (!isCodeQuestion) {
      reply = reply
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 3)
        .join("\n");
    }
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      message: "AI failed to respond",
      error: error.message,
    });
  }
};
