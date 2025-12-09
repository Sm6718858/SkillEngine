import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const Course = ({course}) => {
    if (!course?._id) return null;
    return (
        <Link to={`/courseDetail/${course._id}`}>
        <Card
            className="
            overflow-hidden rounded-xl
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-md hover:shadow-2xl
            transition-all duration-300
            hover:-translate-y-1
        "
        >
            <div className="relative">
                <img
                    src={course?.courseThumbnail}
                    alt="course"
                    className="w-full h-40 object-cover rounded-t-lg"
                />
            </div>

            <CardContent className="px-5 py-4 space-y-3">
                <h1 className="font-bold text-lg truncate hover:underline text-gray-900 dark:text-white">
                    {course?.courseTitle}
                </h1>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={course?.creator?.photoUrl || "https://github.com/shadcn.png"} alt={course?.creator?.name || "Creator"} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <h1 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                            {course?.creator?.name}
                        </h1>
                    </div>

                    <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                        {course?.courseLevel}
                    </Badge>
                </div>

                <div className="text-lg font-bold text-gray-900 dark:text-gray-200">
                    {course?.coursePrice ? `₹${course.coursePrice}` : 'Free'}
                </div>
            </CardContent>
        </Card>
        
        </Link>
    );
};

export default Course;
