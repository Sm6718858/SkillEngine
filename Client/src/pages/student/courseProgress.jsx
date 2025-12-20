import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { X } from "lucide-react";
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
  CheckCircle2,
  CirclePlay,
  StickyNote,
  Trash2,
} from "lucide-react";

const CourseProgress = () => {
  const { courseId } = useParams();

  const [openAI, setOpenAI] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [viewedLectures, setViewedLectures] = useState({});
  const [noteText, setNoteText] = useState("");

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: completeData, isSuccess: completed }] =
    useCompleteCourseMutation();
  const [inCompleteCourse, { data: inCompleteData, isSuccess: inCompleted }] =
    useInCompleteCourseMutation();

  useEffect(() => {
    document.body.style.overflow =
      openAI || openNotes ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [openAI, openNotes]);

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

  const noteKey =
    activeLecture &&
    `notes_${courseId}_${activeLecture._id}`;

  useEffect(() => {
    if (!activeLecture) return;
    const saved = localStorage.getItem(noteKey);
    setNoteText(saved || "");
  }, [activeLecture]);

  const saveNotes = (value) => {
    setNoteText(value);
    localStorage.setItem(noteKey, value);
  };

  const deleteNotes = () => {
    localStorage.removeItem(noteKey);
    setNoteText("");
    toast.success("Notes deleted");
  };

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
          variant="outline"
          className="rounded-xl border-pink-400 text-pink-600"
        >
          {isCourseDone ? "Completed ✅" : "Mark as completed"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="
          flex-1 bg-white/80 dark:bg-white/10
          backdrop-blur-xl rounded-3xl p-5 shadow-2xl
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

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setOpenAI(true);
                  setOpenNotes(false);
                }}
                className="
                  bg-gradient-to-r from-pink-500 to-purple-600
                  text-white rounded-xl
                "
              >
                Ask with AI
              </Button>

              <Button
                onClick={() => {
                  setOpenNotes(true);
                  setOpenAI(false);
                }}
                variant="outline"
                className="rounded-xl cursor-pointer  bg-gradient-to-r from-purple-700 to-pink-400
                  text-white rounded-xl"
              >
                <StickyNote className="h-4 w-4 mr-2" />
                Quick Notes
              </Button>
            </div>
          </div>
        </div>

        {!openAI && !openNotes && (
          <div className="
            w-full lg:w-2/5 bg-white/80 dark:bg-white/10
            backdrop-blur-xl rounded-3xl shadow-2xl p-5
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
                      cursor-pointer rounded-2xl transition
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

      {openNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setOpenNotes(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="
            relative w-[95%] sm:w-[520px] h-[80vh]
            bg-white/80 dark:bg-white/10
            backdrop-blur-xl
            rounded-3xl shadow-2xl
            border border-pink-300/30
            p-5
          ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="
                text-xl font-bold
                bg-gradient-to-r from-pink-600 to-purple-600
                bg-clip-text text-transparent
              ">
                Quick Notes
              </h2>

              <div className="flex gap-3 items-center">
                <Trash2
                  onClick={deleteNotes}
                  className="cursor-pointer text-red-500"
                />
                <X
              className="cursor-pointer text-white/70 hover:text-white"
              onClick={()=> setOpenNotes(false)}
            />
              </div>
            </div>

            <textarea
              value={noteText}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder="Write notes while watching lecture..."
              className="
                w-full h-[calc(100%-60px)]
                rounded-xl p-3
                bg-white/60 dark:bg-black/30
                border border-pink-300/30
                resize-none focus:outline-none
                hide-scrollbar
              "
            />
          </div>
        </div>
      )}

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
