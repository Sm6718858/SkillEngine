import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/authApi";
import authReducer from '../features/authSlice'
import { CourseApi } from "@/features/courseApi";
import { purchaseApi } from "@/features/purchaseApi";
import { courseProgressApi } from "@/features/courseProgressApi";

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [CourseApi.reducerPath]:CourseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,  
    auth:authReducer
})

export default rootReducer;