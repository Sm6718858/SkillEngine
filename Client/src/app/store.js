import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { authApi } from '@/features/authApi'
import { CourseApi } from '@/features/courseApi'
import { purchaseApi } from '@/features/purchaseApi'
import { courseProgressApi } from '@/features/courseProgressApi'

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,CourseApi.middleware,purchaseApi.middleware,courseProgressApi.middleware),
})

const initializeApp = async() =>{
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}

initializeApp();