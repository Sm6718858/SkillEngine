import { Course } from "../Models/courseModel.js";
import { Lecture } from "../Models/lectureModel.js";
import {deleteMediaFromCloudinary,deleteVideoFromCloudinary,uploadMedia} from '../Utils/cloudinary.js'

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

export const createLecture = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const {lectureTitle} = req.body;
        if(!lectureTitle || !courseId){
            return res.status(404).json({
                success:false,
                message:"Lecture Title Required"
            })
        }
        const lecture = await Lecture.create({lectureTitle,
            // course:courseId
        });
        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save({validateBeforeSave:false});

        }
        return res.status(201).json({
            success:true,
            message:"Lecture Added Successfully",
            lecture

        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error from createLecture Endpoint",
        })
    }
}

export const getCourseLecture = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course Not Found Babu"
            })
        }
        return res.status(201).json({
            success:true,
            message:"Course Lectures Got Successfuly",
            lectures:course.lectures,
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error from getCourseLecture endpoint"
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        console.log("PARAMS:", req.params);
        console.log("BODY:", req.body);

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture Not Found"
            });
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
            lecture
        });
    } catch (error) {
        console.error("EDIT LECTURE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error from updateLecture endpoint"
        });
    }
};


export const removeLecture = async (req,res) =>{
    try {
        const {courseId,lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({       
                success:false,
                message:"Lecture Not Found"
            })
        }
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }
        //removing lecture from associated course
        await Course.updateOne(
            {lectures:lectureId},
            {$pull:{lectures:lectureId}}
        )
        return res.status(200).json({
            success:true,
            message:"Lecture removed successfully"
        })
    } catch (error) {   
        return res.status(500).json({
            success:false,
            message:"Error from removeLecture endpoint"
        })
    }
}
export const getLectureById = async (req,res) =>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({   
                success:false,
                message:"Lecture Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Lecture fetched successfully",
            lecture
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error from getLectureById endpoint"
        })
    }
}