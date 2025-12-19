import express from "express";
import { askLectureAI } from "../Controller/aiChatController.js";

const router = express.Router();

router.post("/lecture-chat", askLectureAI);

export default router;
