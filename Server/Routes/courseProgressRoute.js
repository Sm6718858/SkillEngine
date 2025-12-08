import express from "express"
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from "../Controller/courseProgressController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";

const router = express.Router()

router.get("/:courseId", isAuthenticated, getCourseProgress);
router.post("/:courseId/lecture/:lectureId/view", isAuthenticated, updateLectureProgress);
router.post("/:courseId/complete", isAuthenticated, markAsCompleted);
router.post("/:courseId/incomplete", isAuthenticated, markAsInCompleted);

export default router;