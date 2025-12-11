import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;

  const navigate = useNavigate();

  const [createLecture, { isLoading, error, data }] = useCreateLectureMutation();

  const {
    data: getLectureData,
    error: getLectureError,
    isLoading: getLectureLoading,
  } = useGetCourseLectureQuery(courseId);

  const handleCreateLecture = () => {
    createLecture({ courseId, lectureTitle });
  };

  useEffect(() => {
    if (data) {
      toast.success("Lecture Created");
      setLectureTitle("");
    }
    if (error) {
      toast.error("Error creating lecture");
    }
  }, [data, error]);

  return (
    <div
      className="
      flex-1 mx-5 sm:mx-10 mt-8
      bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
      dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f]
      p-6 rounded-2xl shadow-inner
      "
    >
      <div className="mb-6">
        <h1
          className="
          text-2xl font-extrabold tracking-tight
          bg-gradient-to-r from-pink-600 to-purple-600 
          dark:from-pink-300 dark:to-purple-300
          bg-clip-text text-transparent
        "
        >
          Add a New Lecture
        </h1>

        <p className="mt-1 text-gray-600 dark:text-pink-200/70">
          Add a title to create a new lecture for your course.
        </p>
      </div>

      <div
        className="
        p-6 rounded-2xl mb-8
        bg-white/70 dark:bg-white/10
        backdrop-blur-xl
        border border-pink-300/40 dark:border-pink-700/40
        shadow-xl
        space-y-5
      "
      >
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-pink-200">Lecture Title</Label>
          <Input
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            placeholder="Enter your lecture title"
            className="
              bg-white/80 dark:bg-pink-900/20
              border border-pink-300/50 dark:border-pink-700/40
              rounded-xl px-4 py-2
              focus-visible:ring-2 focus-visible:ring-pink-500
              transition
            "
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="
              border-pink-400 text-pink-600
              dark:border-pink-700 dark:text-pink-300
              hover:bg-pink-100/50 dark:hover:bg-pink-900/20
              transition rounded-xl
            "
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to Course
          </Button>

          <Button
            disabled={isLoading}
            onClick={handleCreateLecture}
            className="
              bg-gradient-to-r from-pink-600 to-purple-600
              dark:from-pink-500 dark:to-purple-500
              text-white rounded-xl px-6 py-2
              shadow-lg hover:opacity-90 transition
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </div>

      <div>
        <h1
          className="
            text-xl font-bold mb-3
            text-gray-800 dark:text-pink-200
          "
        >
          Existing Lectures
        </h1>

        {getLectureLoading && (
          <p className="text-gray-500 dark:text-pink-300">Loading...</p>
        )}

        {getLectureData?.lectures?.length === 0 && (
          <p className="text-gray-500 dark:text-pink-300">
            No lectures found.
          </p>
        )}

        <div className="space-y-3 mt-3">
          {getLectureData?.lectures?.map((lec, index) => (
            <Lecture
              key={lec._id}
              courseId={courseId}
              lectureId={lec._id}
              title={`Lecture ${index + 1} — ${lec.lectureTitle}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
