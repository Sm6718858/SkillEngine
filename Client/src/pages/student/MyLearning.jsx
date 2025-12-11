import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { useLoadUserQuery } from '@/features/authApi';

const MyLearning = () => {
    const { data, isLoading } = useLoadUserQuery();
    const MyLearningCourses = data?.user?.enrolledCourses ?? [];

    return (
        <div className="
            min-h-screen 
            bg-gradient-to-br from-pink-50 via-white to-purple-50 
            dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#0a0a0a]
            py-16
        ">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-12">
                    <h1 className="
                        text-4xl sm:text-5xl font-extrabold 
                        bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600 
                        bg-clip-text text-transparent
                        drop-shadow-sm
                    ">
                        My Learning
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Continue where you left off and keep growing 
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <MyLearningSkeleton key={i} />
                        ))}
                    </div>
                ) : MyLearningCourses.length > 0 ? (

                    <div className="
                        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                        gap-7 animate-fadeSlide
                    ">
                        {MyLearningCourses.map((course, index) => (
                            <Course key={index} course={course} />
                        ))}
                    </div>

                ) : (

                    <div className="
                        flex flex-col items-center justify-center 
                        py-24 text-center animate-fadeSlide
                    ">
                        <img
                            src="/empty-learning.svg"
                            alt="No courses"
                            className="w-56 mb-6 opacity-80 drop-shadow-lg"
                        />

                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            No Courses Yet
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 mb-6 max-w-md">
                            Looks like you haven’t started learning yet. 
                            Browse top courses and begin your journey!
                        </p>

                        <a
                            href="/courses"
                            className="
                                px-6 py-2.5 rounded-xl
                                bg-gradient-to-r from-pink-600 to-purple-600 
                                text-white font-medium
                                shadow-lg hover:shadow-2xl
                                hover:scale-[1.03] active:scale-[0.97]
                                transition-all
                            "
                        >
                            Browse Courses
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;

const MyLearningSkeleton = () => {
    return (
        <div
            className="
                flex flex-col space-y-3 w-full p-3 rounded-2xl
                bg-white/50 dark:bg-white/10
                border border-pink-200/40 dark:border-pink-900/30
                backdrop-blur-xl shadow-md
            "
        >
            <Skeleton className="h-40 w-full rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse" />
            </div>
        </div>
    );
};
