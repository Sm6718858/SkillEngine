import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const USER_API = `${import.meta.env.VITE_API_BASE_URL}/api/course/`;

export const CourseApi = createApi({
    reducerPath:"CourseApi",
    baseQuery:fetchBaseQuery({baseUrl:USER_API,credentials:'include'}),
    tagTypes: ["Course"],
    endpoints: (builder) =>({
        createCourse:builder.mutation({
            query:({courseTitle,category}) =>({
                url:'createCourse',
                method:'POST',
                body:{courseTitle,category},
            }),
            invalidatesTags: ["Course"],
        }),
        creatorCourse:builder.query({
            query:() =>({
                url:'courseList',
                method:'GET',
            }),
            providesTags: ["Course"],
        })
    })
});

export const {useCreateCourseMutation,useCreatorCourseQuery} = CourseApi;