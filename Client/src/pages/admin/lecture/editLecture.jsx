import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();

  return (
    <div
      className="
        min-h-screen pt-13 px-4
        bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
        dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f]
        transition-colors
      "
    >
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button
              size="icon"
              variant="outline"
              className="
                rounded-full border-pink-400 text-pink-600
                dark:border-pink-700 dark:text-pink-300
                hover:bg-pink-100 dark:hover:bg-pink-900/30
                transition
              "
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>

          <h1
            className="
              text-2xl md:text-3xl font-extrabold
              bg-gradient-to-r from-pink-600 to-purple-600
              dark:from-pink-400 dark:to-purple-400
              bg-clip-text text-transparent
              tracking-tight
            "
          >
            Update Your Lecture
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <LectureTab courseId={courseId} lectureId={lectureId} />
      </div>
    </div>
  );
};

export default EditLecture;
