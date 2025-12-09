import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { useLoadUserQuery } from '@/features/authApi';

const MyLearning = () => {
    const { data, isLoading } = useLoadUserQuery();
    const MyLearningCourses = data?.user?.enrolledCourses ?? [];

    return (
        <div className="min-h-screen bg-gray-50 my-8 py-2.5 dark:bg-black dark:text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">

                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        My Learning
                    </h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <MyLearningSkeleton key={i} />
                        ))}
                    </div>
                ) : MyLearningCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {MyLearningCourses.map((course, index) => (
                            <Course key={index} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        <img
                            src="/empty-learning.svg"
                            alt="No courses"
                            className="w-60 mb-4 opacity-80"
                        />
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            No courses found
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Looks like you haven't enrolled in any course yet.
                        </p>
                        <a href="/courses" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            Browse Courses
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyLearning;

const MyLearningSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3 w-full">
            <Skeleton className="h-40 w-full rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 animate-pulse" />
            </div>
        </div>
    );
};
