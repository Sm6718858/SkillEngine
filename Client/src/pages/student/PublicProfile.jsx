import React from "react";
import { useParams } from "react-router-dom";
import { Loader2, BookOpen, ClipboardList, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetPublicProfileQuery } from "@/features/authApi";
import { useState } from "react";


const PublicProfile = () => {
  const { userId } = useParams();
  const { data, isLoading } = useGetPublicProfileQuery(userId);

  const [showQuiz, setShowQuiz] = useState(false);


  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
      </div>
    );
  }

  const user = data?.user;

  if (!user) {
    return (
      <p className="text-center mt-20 text-lg font-semibold">
        User not found
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-black rounded-3xl shadow-xl p-6 sm:p-10">

        <div className="flex flex-col items-center text-center gap-4">
          <Avatar className="h-28 w-28 ring-4 ring-pink-500/40">
            <AvatarImage src={user.photoUrl} />
            <AvatarFallback>
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-3xl font-extrabold">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>

          <span className="px-4 py-1 text-sm rounded-full bg-pink-100 text-pink-600">
            {user.role?.toUpperCase()}
          </span>

          <p className="text-gray-500 text-sm">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-14">
  <button
    onClick={() => setShowQuiz((p) => !p)}
    className="
      w-full flex items-center justify-between
      text-left
      bg-pink-50 dark:bg-pink-900/20
      px-5 py-4 rounded-2xl
      border border-pink-200 dark:border-pink-800
      hover:shadow-md transition
    "
  >
    <div className="flex items-center gap-3">
      <ClipboardList className="text-pink-600" />
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Quiz Progress
      </h2>
      <span className="text-sm text-gray-500">
        ({user.quizResults?.length || 0} attempts)
      </span>
    </div>

    <ChevronDown
      className={`h-5 w-5 text-pink-600 transition-transform duration-300 ${
        showQuiz ? "rotate-180" : ""
      }`}
    />
  </button>

  {showQuiz && (
    <div className="mt-6 space-y-4 animate-fadeIn">
      {user.quizResults?.length ? (
        user.quizResults.map((q, index) => (
          <div
            key={q._id}
            className="
              rounded-2xl border
              bg-white dark:bg-black
              p-5 shadow-sm
              hover:shadow-md transition
            "
          >
            <p className="text-sm text-gray-500 mb-3">
              Attempt #{index + 1} •{" "}
              {new Date(q.date).toLocaleString()}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-4">
                <p className="text-xs text-gray-500">Correct</p>
                <p className="text-2xl font-bold text-green-600">
                  {q.totalCorrect ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-pink-50 dark:bg-pink-900/20 p-4">
                <p className="text-xs text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold text-pink-600">
                  {q.totalQuestions ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-4">
                <p className="text-xs text-gray-500">Not Attempted</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {q.notAttempted ?? 0}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-6">
          No quiz attempts yet
        </p>
      )}
    </div>
  )}
</div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="text-pink-600" />
            Enrolled Courses
          </h2>

          {user.enrolledCourses?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {user.enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className="rounded-2xl border shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {course.courseTitle}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Level: {course.courseLevel}
                    </p>

                    <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-600">
                      {course.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No courses enrolled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
