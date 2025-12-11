import mongoose from "mongoose";
const coursePurchaseSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        d:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        d:true
    },
    amount:{
        type:Number,
        d:true
    },
    status:{
        type:String,
        enum:['pending', 'completed', 'failed'],
        default:'pending'
    },
    paymentId:{
        type:String,
        d:true
    }

},{timestamps:true});
export const CoursePurchase = mongoose.model('CoursePurchase', coursePurchaseSchema);