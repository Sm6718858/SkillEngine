import React from "react";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ title, courseId, lectureId }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex items-center justify-between
        px-4 py-3 rounded-xl my-2
        bg-white/70 dark:bg-white/10
        backdrop-blur-xl
        border border-pink-200/50 dark:border-pink-700/40
        shadow-sm hover:shadow-pink-300/40 dark:hover:shadow-pink-900/40
        transition-all duration-300
        hover:-translate-y-[2px]
      "
    >
      <h1 className="font-semibold text-gray-800 dark:text-pink-200 tracking-wide">
        {title}
      </h1>

      <Edit
        onClick={() =>
          navigate(`/admin/course/${courseId}/lecture/${lectureId}`)
        }
        size={22}
        className="
          cursor-pointer 
          text-pink-600 dark:text-pink-300
          hover:text-purple-600 dark:hover:text-pink-400
          transition
        "
      />
    </div>
  );
};

export default Lecture;
