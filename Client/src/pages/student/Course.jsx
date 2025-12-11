import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  if (!course?._id) return null;

  return (
    <Link to={`/courseDetail/${course._id}`}>
      <Card
        className="
        overflow-hidden rounded-2xl border
        bg-white/80 dark:bg-[#1a0b16]/70 
        border-pink-200/50 dark:border-pink-700/30
        backdrop-blur-xl shadow-lg 
        hover:shadow-pink-300/40 dark:hover:shadow-pink-900/40
        transition-all hover:-translate-y-2 duration-300
      "
      >
        <img
          src={course?.courseThumbnail}
          alt="course"
          className="
            w-full h-44 object-cover
            rounded-t-2xl 
          "
        />

        <CardContent className="px-5 py-4 space-y-3 bg-transparent">
          <h1
            className="
              font-bold text-lg truncate 
              text-gray-900 dark:text-pink-100
              hover:text-pink-600 dark:hover:text-pink-300
              transition
            "
          >
            {course?.courseTitle}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-pink-300 dark:border-pink-700">
                <AvatarImage
                  src={course?.creator?.photoUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <h1 className="font-medium text-sm text-gray-700 dark:text-pink-200">
                {course?.creator?.name}
              </h1>
            </div>

            <Badge
              className="
              bg-gradient-to-r from-pink-600 to-purple-600 
              dark:from-pink-500 dark:to-purple-500
              text-white shadow-md px-3 py-1 rounded-full text-xs
            "
            >
              {course?.courseLevel}
            </Badge>
          </div>

          <div
            className="
              text-xl font-extrabold 
              text-pink-700 dark:text-pink-300
            "
          >
            {course?.coursePrice ? `₹${course.coursePrice}` : "Free"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
