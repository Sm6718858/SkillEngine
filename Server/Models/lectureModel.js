import mongoose from "mongoose";

export const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        d: true,
    },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
},{timestamps:true});

export const Lecture = new mongoose.model("Lecture",lectureSchema);