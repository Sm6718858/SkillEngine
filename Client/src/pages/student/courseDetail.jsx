import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center mt-20 text-xl font-semibold text-pink-600">
        Loading Course...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex justify-center mt-20 text-xl text-red-500">
        Failed to load course details
      </div>
    );

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="space-y-10 pt-20 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-[#1a0b16] dark:via-[#1c0d18] dark:to-[#160813] min-h-screen">

      {/* TOP HEADER SECTION */}
      <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-pink-700 dark:from-pink-700 dark:via-purple-700 dark:to-pink-800 text-white py-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-3">

          <h1 className="font-extrabold text-3xl md:text-4xl leading-tight drop-shadow-lg">
            {course?.courseTitle}
          </h1>

          <p className="text-pink-100 text-base md:text-lg">{course?.subTitle}</p>

          <p className="opacity-90">
            Created By{" "}
            <span className="text-yellow-200 underline italic font-medium">
              {course?.creator?.name}
            </span>
          </p>

          <div className="flex items-center gap-2 text-sm opacity-90">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt?.split("T")[0]}</p>
          </div>

          <p className="opacity-90">
            Students enrolled: <span className="font-semibold">{course?.enrolledStudents?.length}</span>
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10 pb-20">

        {/* LEFT SECTION: DESCRIPTION + CONTENT */}
        <div className="w-full lg:w-2/3 space-y-6">

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-pink-200">Description</h2>
            <p
              className="text-gray-700 dark:text-pink-200/80 mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: course?.courseDescription || "Course description goes here.",
              }}
            />
          </div>

          {/* COURSE CONTENT LIST */}
          <Card className="border border-pink-300/40 dark:border-pink-700/40 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-pink-700 dark:text-pink-300">
                Course Content
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-pink-300/70">
                {course?.lectures?.length} Lectures
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {course?.lectures?.map((lecture, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-white/10 border border-pink-200/50 dark:border-pink-700/30 shadow-sm"
                >
                  <span>
                    {purchased ? (
                      <PlayCircle className="text-pink-600 dark:text-pink-300" size={18} />
                    ) : (
                      <Lock className="text-gray-500 dark:text-pink-500/70" size={18} />
                    )}
                  </span>
                  <p className="text-sm text-gray-800 dark:text-pink-200">
                    {lecture.lectureTitle}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3">
          <Card className="border border-pink-300/40 dark:border-pink-700/40 bg-white/60 dark:bg-white/10 backdrop-blur-xl shadow-xl rounded-2xl">
            <CardContent className="p-5 space-y-3">

              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={"https://www.example.com/video.mp4"}
                  controls
                />
              </div>

              <h1 className="font-bold text-xl text-gray-900 dark:text-pink-200">
                Preview Lecture
              </h1>

              <Separator className="my-3 bg-pink-300 dark:bg-pink-700" />

              <h1 className="text-xl md:text-2xl font-bold text-pink-700 dark:text-pink-300">
                {course.coursePrice ? `₹${course.coursePrice}` : "Free"}
              </h1>
            </CardContent>

            <CardFooter className="flex justify-center p-5">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="
                    w-full py-5 text-white font-semibold 
                    bg-gradient-to-r from-pink-300 to-purple-300 
                    dark:from-pink-300 dark:to-purple-500
                    rounded-xl shadow-lg hover:opacity-90 transition
                  "
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default CourseDetail;
