import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

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

const CourseProgress = () => {
  const { courseId } = useParams();
  const [openAI, setOpenAI] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [viewedLectures, setViewedLectures] = useState({});

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: completeData, isSuccess: completed }] =
    useCompleteCourseMutation();
  const [inCompleteCourse, { data: inCompleteData, isSuccess: inCompleted }] =
    useInCompleteCourseMutation();

  useEffect(() => {
    document.body.style.overflow = openAI ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [openAI]);

  useEffect(() => {
    if (completed && completeData) {
      toast.success(completeData.message);
      refetch();
    }
    if (inCompleted && inCompleteData) {
      toast.success(inCompleteData.message);
      refetch();
    }
  }, [completed, inCompleted]);

  if (isLoading)
    return <p className="p-6 text-center text-pink-600">Loading...</p>;
  if (isError)
    return <p className="p-6 text-center text-red-500">Failed to load</p>;

  const { courseDetails, progress, completed: isCourseDone } = data.data;
  const activeLecture =
    currentLecture || courseDetails.lectures?.[0];

  const isLectureCompleted = (id) =>
    progress.some((p) => p.lectureId === id && p.viewed);

  const handleVideoPlay = async (id) => {
    if (viewedLectures[id]) return;
    await updateLectureProgress({ courseId, lectureId: id });
    setViewedLectures((p) => ({ ...p, [id]: true }));
    refetch();
  };

  return (
    <div
      className="
        max-w-7xl mx-auto p-5 mt-6
        bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
        dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f]
        rounded-2xl
      "
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 mt-8">
        <h1 className="
          text-3xl font-extrabold
          bg-gradient-to-r from-pink-600 to-purple-600
          bg-clip-text text-transparent
        ">
          {courseDetails.courseTitle}
        </h1>

        <Button
          onClick={() =>
            isCourseDone
              ? inCompleteCourse(courseId)
              : completeCourse(courseId)
          }
          className="
            rounded-xl px-5
            border border-pink-400
            text-pink-600
            hover:bg-pink-100
            cursor-pointer
          "
          variant="outline"
        >
          {isCourseDone ? "Completed ✅" : "Mark as completed"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        <div className="
          flex-1 lg:w-3/5
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          rounded-3xl p-5 shadow-2xl
          border border-pink-300/30
        ">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <video
              src={activeLecture.videoUrl}
              controls
              onPlay={() => handleVideoPlay(activeLecture._id)}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-between">
            <h3 className="text-lg sm:text-xl font-semibold dark:text-pink-200">
              {activeLecture.lectureTitle}
            </h3>

            <Button
              onClick={() => setOpenAI(true)}
              className="
                w-full sm:w-auto
                bg-gradient-to-r from-pink-500 to-purple-600
                text-white rounded-xl
                py-3 sm:py-2
              "
            >
              Ask with AI
            </Button>
          </div>
        </div>

        {!openAI && (
          <div className="
            w-full lg:w-2/5
            bg-white/80 dark:bg-white/10
            backdrop-blur-xl
            rounded-3xl shadow-2xl p-5
            border border-pink-300/30
          ">
            <h2 className="
              text-2xl font-bold mb-4
              bg-gradient-to-r from-pink-600 to-purple-600
              bg-clip-text text-transparent
            ">
              Course Lectures
            </h2>

            <div className="max-h-[65vh] overflow-y-auto space-y-2 pr-2 hide-scrollbar">
              {courseDetails.lectures.map((lec) => {
                const active = lec._id === activeLecture._id;
                return (
                  <Card
                    key={lec._id}
                    onClick={() => setCurrentLecture(lec)}
                    className={`
                      cursor-pointer rounded-2xl transition rounded-2xl
                      ${active
                        ? "bg-pink-400 shadow-xl scale-96"
                        : "hover:bg-purple-400"}
                    `}
                  >
                    <CardContent className="p-4 flex justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {isLectureCompleted(lec._id) ? (
                          <CheckCircle2 className="text-green-500" />
                        ) : (
                          <CirclePlay className="text-pink-500" />
                        )}
                        <CardTitle className="text-sm line-clamp-2">
                          {lec.lectureTitle}
                        </CardTitle>
                      </div>

                      {isLectureCompleted(lec._id) && (
                        <Badge className="bg-green-200 text-green-700">
                          Done
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <LectureAIChat
        open={openAI}
        onClose={() => setOpenAI(false)}
        lecture={activeLecture}
        courseTitle={courseDetails.courseTitle}
      />
    </div>
  );
};

export default CourseProgress;
