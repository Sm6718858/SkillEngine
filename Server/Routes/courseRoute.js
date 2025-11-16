import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
// import upload from "../Utils/multer.js";
import { createCourse, CreatorCourses, EditCourse, getCourseById } from "../Controller/courseController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/createCourse", isAuthenticated,createCourse);
router.get('/courseList',isAuthenticated,CreatorCourses);
router.put('/:courseId',isAuthenticated,upload.single("courseThumbnail"),EditCourse);
router.get('/:courseId',isAuthenticated,getCourseById);

export default router;
