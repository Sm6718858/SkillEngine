import express from "express";
import { User } from "../../Models/userModel.js";

const router = express.Router();

/* ---------- PUBLIC PROFILE ---------- */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name photoUrl role email enrolledCourses createdAt quizResults ")
      .populate({
        path: "enrolledCourses",
        select: "courseTitle courseThumbnail courseLevel category",
      })
      .lean();

    // console.log("PUBLIC USER:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Public profile error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


export default router;
