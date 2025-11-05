import { User } from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/Token.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../Utils/cloudinary.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.log("Error in signUp:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error in SignUp" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        generateToken(res, user);

    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error in Login" });
    }
}

export const Logout = (req, res) => {
    try {
        return res.cookie("token", "", { expires: new Date(0) }).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in Logout:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error in Logout" });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in getProfile:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error in GetProfile" });
    }
}


export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let photoUrl = user.photoUrl;

    if (req.file && req.file.path) {

      if (user.photoUrl) {
        try {
          const publicId = user.photoUrl.split("/").pop().split(".")[0];
          await deleteMediaFromCloudinary(publicId);
        } catch (err) {
          console.warn("⚠️ Failed to delete old image:", err.message);
        }
      }

      try {
        const cloudResponse = await uploadMedia(req.file.path);
        console.log("Cloudinary upload response:", cloudResponse);
        if (!cloudResponse?.secure_url) {
          throw new Error("No secure_url returned from Cloudinary");
        }
        photoUrl = cloudResponse.secure_url;
      } catch (err) {
        return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
      }
    }

    const updatedData = {
      name: name || user.name,
      photoUrl,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");


    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in UpdateProfile",
    });
  }
};

