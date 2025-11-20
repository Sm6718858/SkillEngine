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
        }),
        editCourse:builder.mutation({
            query:({formData, courseId }) =>({
                url:`/${courseId}`,
                method:'PUT',
                body:formData
            }),
            invalidatesTags: ["Course"],
        }),
        courseById:builder.query({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:'GET',
            })
        }),
        createLecture:builder.mutation({
            query:({lectureTitle,courseId}) =>({
                url:`/${courseId}/createLecture`,
                method:'POST',
                body:{lectureTitle},
            })
        })
    })
});

export const {useCreateCourseMutation,useCreatorCourseQuery,useEditCourseMutation,useCourseByIdQuery , useCreateLectureMutation} = CourseApi;