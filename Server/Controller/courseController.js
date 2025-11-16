import { Course } from "../Models/courseModel.js";
import {deleteMediaFromCloudinary,uploadMedia} from '../Utils/cloudinary.js'

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }
        const course = await Course.create({
            courseTitle, category, creator: req.id
        })
        return res.status(201).json({
            success: true,
            message: "course created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error from createCourse endpoint"
        })
    }
}

export const CreatorCourses = async (req, res) => {
    try {
        const userId = req.id;

        const courseList = await Course.find({ creator: userId });

        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            courses: courseList,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error from CreatorCourses endpoint",
        });
    }
};

export const EditCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); 
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }


        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error from EditCourses endpoint",
        });
    }
}

export const getCourseById = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).jsong({
                success:false,
                message:"Course not exist"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Course successfully found",
            course
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error from GetCourseById endpoint",
        });
    }
}