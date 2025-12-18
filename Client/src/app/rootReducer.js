import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/authApi";
import authReducer from '../features/authSlice'
import { CourseApi } from "@/features/courseApi";
import { purchaseApi } from "@/features/purchaseApi";
import { courseProgressApi } from "@/features/courseProgressApi";
import { codingApi } from "@/features/codingApi";
import { interviewApi } from "@/features/interviewApi";
import { groupStudyApi } from "@/features/groupStudyApi";

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [CourseApi.reducerPath]:CourseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,  
    [codingApi.reducerPath]:codingApi.reducer,
    [interviewApi.reducerPath]:interviewApi.reducer,
    [groupStudyApi.reducerPath]:groupStudyApi.reducer,
    auth:authReducer
})

export default rootReducer;