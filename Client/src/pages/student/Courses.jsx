import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCoursesQuery } from "@/features/courseApi";

const Courses = () => {
  const { data, isLoading } = useGetPublishedCoursesQuery();

  return (
    <div className="
      min-h-screen w-full flex justify-center
      bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
      dark:from-[#1a0b16] dark:via-[#200a1c] dark:to-[#120914]
      transition-colors
    ">
      <div className="max-w-7xl w-full px-4 py-16">

        <div className="text-center mb-12">
          <h1 className="
            text-4xl md:text-5xl font-extrabold tracking-tight
            bg-gradient-to-r from-pink-600 to-purple-600
            dark:from-pink-300 dark:to-purple-300
            bg-clip-text text-transparent
          ">
            Our Courses
          </h1>
          <p className="text-gray-600 dark:text-pink-200 mt-2 text-lg">
            Learn and grow with our industry-ready courses.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                gap-8"
          >
            {data?.courses?.map((course, index) => (
              <Course key={index} course={course} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;


/* 🌸 Pink Skeleton Loader */
const CourseSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 w-full p-3 rounded-xl 
      bg-white/40 dark:bg-white/5 
      border border-pink-200/40 dark:border-pink-700/30
      backdrop-blur-xl shadow-sm"
    >
      <Skeleton className="h-40 w-full rounded-xl bg-pink-200/40 dark:bg-pink-900/30 animate-pulse" />
      <Skeleton className="h-4 w-3/4 bg-pink-200/40 dark:bg-pink-900/30 animate-pulse" />
      <Skeleton className="h-4 w-1/2 bg-pink-200/40 dark:bg-pink-900/30 animate-pulse" />
    </div>
  );
};
