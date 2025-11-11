import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
// import upload from "../Utils/multer.js";
import { createCourse, CreatorCourses } from "../Controller/courseController.js";

const router = express.Router();

router.post("/createCourse", isAuthenticated,createCourse);
router.get('/courseList',isAuthenticated,CreatorCourses);

export default router;
