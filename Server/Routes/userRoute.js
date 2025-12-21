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
import { User } from "../Models/userModel.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.get("/logout",isAuthenticated, Logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile/update",isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.post("/interview-attempt", isAuthenticated, async (req, res) => {
  try {
    // console.log("REQ ID:", req.id);

    if (!req.id) {
      return res.status(401).json({ success: false, message: "No user id" });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.interviewAttempts = (user.interviewAttempts || 0) + 1;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Interview Attempt Error:", err);
    res.status(500).json({ success: false });
  }
});

router.post("/quiz/save-result", isAuthenticated, saveQuizResult);


export default router;
