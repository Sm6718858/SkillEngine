import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { authApi } from '@/features/authApi'
import { CourseApi } from '@/features/courseApi'
import { purchaseApi } from '@/features/purchaseApi'
import { courseProgressApi } from '@/features/courseProgressApi'
import { codingApi } from '@/features/codingApi'
import { interviewApi } from '@/features/interviewApi'
import { groupStudyApi } from '@/features/groupStudyApi'

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,CourseApi.middleware,purchaseApi.middleware,courseProgressApi.middleware,codingApi.middleware,interviewApi.middleware,groupStudyApi.middleware),
})

const initializeApp = async() =>{
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}

initializeApp();