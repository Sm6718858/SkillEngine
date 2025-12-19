import LectureAIChat from "@/components/LectureAIChat";
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
  const [openAI, setOpenAI] = useState(false);

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

      <div className="flex flex-col lg:flex-row gap-6">

  <div
    className="
      flex-1 lg:w-3/5
      bg-white/80 dark:bg-white/10
      backdrop-blur-xl
      rounded-3xl p-5 shadow-2xl
      border border-pink-300/30 dark:border-pink-700/40
      flex flex-col
    "
  >
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
      <video
        src={activeLecture?.videoUrl}
        controls
        onPlay={() => handleVideoPlay(activeLecture._id)}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-pink-200 leading-snug">
        Lecture{" "}
        {courseDetails.lectures.findIndex(
          (l) => l._id === activeLecture._id
        ) + 1}
        <span className="text-pink-500 mx-1">•</span>
        {activeLecture.lectureTitle}
      </h3>


        <Button onClick={() => setOpenAI(true)} className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md hover:scale-105 transition">
  Ask with AI ✨
</Button>

<LectureAIChat
  open={openAI}
  onClose={() => setOpenAI(false)}
  lecture={activeLecture}
  courseTitle={courseDetails.title}
/>



    </div>
  </div>

  <div
    className="
      w-full lg:w-2/5
      bg-white/80 dark:bg-white/10
      backdrop-blur-xl
      rounded-3xl shadow-2xl p-5
      border border-pink-300/30 dark:border-pink-700/40
      flex flex-col
    "
  >
    <h2
      className="
        text-2xl font-bold mb-4
        bg-gradient-to-r from-pink-600 to-purple-600
        bg-clip-text text-transparent
      "
    >
      Course Lectures
    </h2>

    <div className="flex-1 max-h-[65vh] overflow-y-auto space-y-3 pr-2">
      {courseDetails?.lectures?.map((lec) => {
        const isActive = lec._id === activeLecture._id;

        return (
          <Card
            key={lec._id}
            onClick={() => handleSelectLecture(lec)}
            className={`
              cursor-pointer rounded-2xl transition-all
              border border-pink-200/40 dark:border-pink-700/40
              ${
                isActive
                  ? "bg-pink-100/70 dark:bg-pink-900/40 shadow-xl scale-[1.02]"
                  : "bg-white/60 dark:bg-white/5 hover:bg-pink-100/40 dark:hover:bg-pink-900/30"
              }
            `}
          >
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {isLectureCompleted(lec._id) ? (
                  <CheckCircle2 className="text-green-500 shrink-0" size={22} />
                ) : (
                  <CirclePlay className="text-pink-500 shrink-0" size={22} />
                )}

                <CardTitle className="text-sm sm:text-base font-medium dark:text-pink-200 line-clamp-2">
                  {lec.lectureTitle}
                </CardTitle>
              </div>

              {isLectureCompleted(lec._id) && (
                <Badge className="rounded-full bg-green-200 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-3 py-1 text-xs">
                  Done
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>

</div>

    </div>
  );
};

export default CourseProgress;
