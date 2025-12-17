import express from "express";
import { askGroq } from "../Utils/groq.js"

const router = express.Router();

router.post("/voice-interview", async (req, res) => {
  try {
    const { domain, tone, history = [], answer } = req.body;

    const conversation = history
      .map(
        (m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`
      )
      .join("\n");

    const reply = await askGroq({
      domain,
      tone,
      conversation,
      answer,
    });

    res.json({ success: true, reply });
  } catch (err) {
    console.error(err);
    res.json({
      success: true,
      reply: "Please continue. Can you explain that more clearly?",
    });
  }
});

export default router;
