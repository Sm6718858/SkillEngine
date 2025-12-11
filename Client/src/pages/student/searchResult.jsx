import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <Link
      to={`/courseDetail/${course._id}`}
      className="
        group
        flex flex-col md:flex-row justify-between items-start md:items-center 
        gap-5 p-5 rounded-2xl
        bg-white/70 dark:bg-white/10 
        border border-pink-300/30 dark:border-pink-900/30
        backdrop-blur-xl shadow-md
        hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300
      "
    >
      <div className="flex flex-col md:flex-row gap-5 w-full items-start">

        <div
          className="
            w-full md:w-56 h-36 overflow-hidden rounded-xl 
            shadow-lg group-hover:scale-[1.02] transition-all duration-300
          "
        >
          <img
            src={course.courseThumbnail}
            alt="course-thumbnail"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <h1
            className="
              font-extrabold text-xl leading-tight 
              text-gray-800 dark:text-gray-100
              group-hover:text-pink-600 dark:group-hover:text-pink-400
              transition-all
            "
          >
            {course.courseTitle}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {course.subTitle}
          </p>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            Instructor:{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {course.creator?.name}
            </span>
          </p>

          <Badge
            className="
              w-fit px-3 py-1 text-xs
              bg-gradient-to-r from-pink-600 to-purple-600 
              text-white shadow-md rounded-full
            "
          >
            {course.courseLevel}
          </Badge>
        </div>
      </div>

      <div className="md:text-right w-full md:w-auto">
        <h1
          className="
            font-bold text-xl 
            text-gray-900 dark:text-gray-100
            bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent
          "
        >
          ₹{course.coursePrice || "Free"}
        </h1>
      </div>
    </Link>
  );
};

export default SearchResult;
