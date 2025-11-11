import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const USER_API = `${import.meta.env.VITE_API_BASE_URL}/api/course/`;

export const CourseApi = createApi({
    reducerPath:"CourseApi",
    baseQuery:fetchBaseQuery({baseUrl:USER_API,credentials:'include'}),
    endpoints: (builder) =>({
        createCourse:builder.mutation({
            query:({courseTitle,category}) =>({
                url:'createCourse',
                method:'POST',
                body:{courseTitle,category},
            }),
        })
    })
});

export const {useCreateCourseMutation} = CourseApi;