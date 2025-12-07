import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
// import upload from "../Utils/multer.js";
import { createCourse, createLecture, CreatorCourses, EditCourse, editLecture, getCourseById, getCourseLecture, getLectureById, removeCourse, removeLecture, togglePublishCourse } from "../Controller/courseController.js";
import upload from "../Utils/multer.js";

const router = express.Router();

router.post("/createCourse", isAuthenticated,createCourse);
router.get('/courseList',isAuthenticated,CreatorCourses);
router.put('/:courseId',isAuthenticated,upload.single("courseThumbnail"),EditCourse);
router.get('/:courseId',isAuthenticated,getCourseById);
router.patch('/:courseId',isAuthenticated,togglePublishCourse);
router.post('/:courseId/createLecture',isAuthenticated,createLecture);
router.get('/:courseId/getLectures',getCourseLecture);
router.put('/:courseId/lecture/:lectureId', isAuthenticated, editLecture);
router.delete('/:courseId/lecture/:lectureId',isAuthenticated,removeLecture);
router.get('/:courseId/lecture/:lectureId',isAuthenticated,getLectureById)
router.delete('/:courseId',isAuthenticated,removeCourse)


export default router;
