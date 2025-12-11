import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','instructor'],
        default:'student',
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course',
        }
    ],
    photoUrl:{
        type:String,
        default:'',
    },

    quizResults: [
        {
            date: { type: Date, default: Date.now },

            modules: {
                gk: { type: Number, default: 0 },
                english: { type: Number, default: 0 },
                maths: { type: Number, default: 0 },
                aptitude: { type: Number, default: 0 }
            },

            totalCorrect: Number,
            totalQuestions: Number,
            notAttempted: Number
        }
    ]

},
{
    timestamps:true,    
});

export const User = mongoose.model('User',userSchema);