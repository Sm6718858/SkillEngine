import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/courseProgressApi";

import {
  CheckCircle,
  CheckCircle2,
  CirclePlay,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] =
    useCompleteCourseMutation();

  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);
  const [viewedLectures, setViewedLectures] = useState({});

  useEffect(() => {
    if (completedSuccess && markCompleteData) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess && markInCompleteData) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  if (isLoading) return <p className="p-6 text-pink-600">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load course</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  const initialLecture = currentLecture || courseDetails?.lectures?.[0];

  const isLectureCompleted = (lectureId) =>
    progress.some((p) => p.lectureId === lectureId && p.viewed);

  const handleVideoPlay = async (lectureId) => {
    if (viewedLectures[lectureId]) return;

    await updateLectureProgress({ courseId, lectureId });
    refetch();
    setViewedLectures((prev) => ({ ...prev, [lectureId]: true }));
  };

  const handleSelectLecture = (lec) => setCurrentLecture(lec);

  const handleCompleteCourse = async () => await completeCourse(courseId);
  const handleInCompleteCourse = async () =>
    await inCompleteCourse(courseId);

  const activeLecture = currentLecture || initialLecture;

  return (
    <div
      className="
        max-w-7xl mx-auto p-6 mt-10 pt-10
        bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
        dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f]
        rounded-2xl shadow-inner
      "
    >
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1
          className="
            text-3xl font-extrabold
            bg-gradient-to-r from-pink-600 to-purple-600
            bg-clip-text text-transparent
          "
        >
          {courseTitle}
        </h1>

        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
          className="
            rounded-xl px-4 py-2
            border-pink-400 dark:border-pink-700
            text-pink-600 dark:text-pink-300
            hover:bg-pink-100 dark:hover:bg-pink-900/30
          "
        >
          {completed ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Completed
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        <div
          className="
            flex-1 md:w-3/5 
            bg-white/70 dark:bg-white/10
            backdrop-blur-xl
            rounded-2xl p-4 shadow-xl
            border border-pink-300/40 dark:border-pink-700/40
          "
        >
          <video
            src={activeLecture?.videoUrl}
            controls
            onPlay={() => handleVideoPlay(activeLecture._id)}
            className="w-full rounded-xl shadow-lg"
          />

          <h3
            className="
              mt-4 text-xl font-semibold
              text-gray-800 dark:text-pink-200
            "
          >
            Lecture {courseDetails.lectures.findIndex(l => l._id === activeLecture._id) + 1} —{" "}
            {activeLecture.lectureTitle}
          </h3>
        </div>

        <div
          className="
            w-full md:w-2/5 
            bg-white/70 dark:bg-white/10 
            rounded-2xl shadow-xl p-5
            border border-pink-300/40 dark:border-pink-700/40
            backdrop-blur-xl
          "
        >
          <h2
            className="
              font-bold text-2xl mb-4
              bg-gradient-to-r from-pink-600 to-purple-600
              bg-clip-text text-transparent
            "
          >
            Lectures
          </h2>

          <div className="max-h-[65vh] overflow-y-auto space-y-3 pr-2">
            {courseDetails?.lectures?.map((lec) => (
              <Card
                key={lec._id}
                className={`
                  cursor-pointer rounded-xl transition-all
                  border border-pink-200/40 dark:border-pink-700/40
                  ${
                    lec._id === activeLecture._id
                      ? "bg-pink-100/60 dark:bg-pink-900/40 shadow-lg"
                      : "bg-white/60 dark:bg-white/5 hover:bg-pink-100/40 dark:hover:bg-pink-900/30"
                  }
                `}
                onClick={() => handleSelectLecture(lec)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {isLectureCompleted(lec._id) ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                      <CirclePlay className="text-pink-500" size={24} />
                    )}

                    <CardTitle className="text-base font-medium dark:text-pink-200">
                      {lec.lectureTitle}
                    </CardTitle>
                  </div>

                  {isLectureCompleted(lec._id) && (
                    <Badge
                      className="
                        bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-300
                        rounded-full px-3 py-1
                      "
                    >
                      Done
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseProgress;
