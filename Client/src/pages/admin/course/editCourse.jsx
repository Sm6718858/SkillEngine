import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./courseTab";

const EditCourse = () => {
  return (
    <div
      className="
        flex-1 mt-10 px-5 sm:px-10 
        bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
        dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f]
        rounded-2xl shadow-inner pb-10
      "
    >
      <div className="flex items-center justify-between mb-8 pt-5">
        <h1
          className="
            text-2xl sm:text-3xl font-extrabold tracking-tight
            bg-gradient-to-r from-pink-600 to-purple-600
            dark:from-pink-300 dark:to-purple-300
            bg-clip-text text-transparent
          "
        >
          Add Detailed Information About Your Course
        </h1>

        <Link to="lecture">
          <Button
            variant="link"
            className="
              text-pink-600 dark:text-pink-300 font-semibold
              hover:text-purple-600 dark:hover:text-pink-400
              transition-all
            "
          >
            Go to Lectures Page →
          </Button>
        </Link>
      </div>

      <div
        className="
          bg-white/70 dark:bg-white/10 backdrop-blur-xl
          rounded-2xl border border-pink-300/40 dark:border-pink-700/40
          shadow-xl p-6 sm:p-8
        "
      >
        <CourseTab />
      </div>
    </div>
  );
};

export default EditCourse;
