import mongoose from "mongoose";

export const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
},{timestamps:true});

export const Lecture = new mongoose.model("Lecture",lectureSchema);