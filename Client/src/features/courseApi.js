import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const USER_API = `${import.meta.env.VITE_API_BASE_URL}/api/course/`;

export const CourseApi = createApi({
    reducerPath:"CourseApi",
    baseQuery:fetchBaseQuery({baseUrl:USER_API,credentials:'include'}),
    tagTypes: ["Course","Lecture"],
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
        removeCourse:builder.mutation({
            query:(courseId) =>({
                url:`/${courseId}`,
                method:'DELETE',
            }),
            invalidatesTags:["Course"]  
        }),
        createLecture:builder.mutation({
            query:({lectureTitle,courseId}) =>({
                url:`/${courseId}/createLecture`,
                method:'POST',
                body:{lectureTitle},
            }),
            invalidatesTags:["Lecture"]
        }),
        getCourseLecture:builder.query({
            query:(courseId) =>({
                url:`/${courseId}/getLectures`,
                method:'GET',
            }),
            providesTags:["Lecture"]
        }),
        editLecture:builder.mutation({
            query:({courseId,lectureId,lectureTitle,videoInfo,isPreviewFree}) =>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:'PUT',
                body:{lectureTitle,videoInfo,isPreviewFree},
            }),
            invalidatesTags:["Lecture"]
        }),
        removeLecture:builder.mutation({
            query:({courseId,lectureId}) =>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:'DELETE',
            }),
            invalidatesTags:["Lecture"]
        }),
        getLectureById:builder.query({
            query:({courseId,lectureId}) =>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:'GET',
            }),
            providesTags:["Lecture"]
        })
    })
});
export const {useCreateCourseMutation,useCreatorCourseQuery,useEditCourseMutation,useCourseByIdQuery , useCreateLectureMutation,useGetCourseLectureQuery,useEditLectureMutation,useRemoveLectureMutation,useGetLectureByIdQuery,useRemoveCourseMutation } = CourseApi;