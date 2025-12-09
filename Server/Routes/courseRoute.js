import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
// import upload from "../Utils/multer.js";
import { createCourse, createLecture, CreatorCourses, EditCourse, editLecture, getCourseById, getCourseLecture, getLectureById, getPublishedCourses, removeCourse, removeLecture, searchCourse, togglePublishCourse } from "../Controller/courseController.js";
import upload from "../Utils/multer.js";

const router = express.Router();

router.post("/createCourse", isAuthenticated, createCourse);
router.get("/search",searchCourse)
router.get("/courseList", isAuthenticated, CreatorCourses);
router.get("/publishedCourses", getPublishedCourses);

router.post("/:courseId/createLecture", isAuthenticated, createLecture);
router.get("/:courseId/getLectures", getCourseLecture);

router.put("/:courseId/lecture/:lectureId", isAuthenticated, editLecture);
router.delete("/:courseId/lecture/:lectureId", isAuthenticated, removeLecture);
router.get("/:courseId/lecture/:lectureId", isAuthenticated, getLectureById);

router.put("/:courseId", isAuthenticated, upload.single("courseThumbnail"), EditCourse);
router.patch("/:courseId", isAuthenticated, togglePublishCourse);

router.get("/:courseId", isAuthenticated, getCourseById);
router.delete("/:courseId", isAuthenticated, removeCourse);



export default router;
