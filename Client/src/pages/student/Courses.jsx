import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import Course from './Course';

const Courses = () => {
    const isLoading = false;

    return (
        <div className="bg-gray-50 min-h-screen w-full flex justify-center">
            <div className="max-w-7xl w-full px-4 py-10">

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                        Our Courses
                    </h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <CourseSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length:12}).map((_, index) => (
                            <Course key={index} />
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
}

export default Courses;


const CourseSkeleton = () => {
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
