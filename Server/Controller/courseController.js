import { Course } from "../Models/courseModel.js";

export const createCourse = async (req,res) =>{
    try {
        const {courseTitle,category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                success:false,
                message:"All fields required"
            });
        }
        const course = await Course.create({
            courseTitle,category,creator:req.id
        })
        return res.status(201).json({
            success:true,
            message:"course created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error from createCourse endpoint"
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