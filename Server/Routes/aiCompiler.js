import express from "express";
import { improveCodeWithAI } from '../Utils/geminiImprove.js'

const router = express.Router();

router.post("/improve", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false });
    }

    const improvedCode = await improveCodeWithAI({ code, language });

    res.json({
      success: true,
      improvedCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
