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
        const course = Course.create({
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