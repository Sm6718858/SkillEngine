import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/authApi";
import authReducer from '../features/authSlice'

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    auth:authReducer
})

export default rootReducer;