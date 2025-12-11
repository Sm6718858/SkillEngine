import express from "express";
import {
  getUserProfile,
  login,
  Logout,
  signUp,
  updateProfile,
} from "../Controller/userController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { saveQuizResult } from "../Controller/userController.js";
import upload from "../Utils/multer.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.get("/logout",isAuthenticated, Logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile/update",isAuthenticated, upload.single("profilePhoto"), updateProfile);


router.post("/quiz/save-result", isAuthenticated, saveQuizResult);


export default router;
