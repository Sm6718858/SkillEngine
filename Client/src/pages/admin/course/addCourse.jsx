import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const [createCourse, { isLoading, isSuccess, error }] =
    useCreateCourseMutation();

  const selectCategory = (value) => {
    setCategory(value);
  };

  const addCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle || !category) return toast.error("Please fill all fields");
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Created Successfully");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error?.data?.message || "Error creating course");
    }
  }, [isSuccess, error]);

  return (
    <div
      className="
      flex-1 mx-auto max-w-3xl px-6 py-12
      bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50
      dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f]
      rounded-2xl shadow-inner
    "
    >
      <div className="mb-8 space-y-2">
        <h1
          className="
          text-3xl font-extrabold tracking-tight
          bg-gradient-to-r from-pink-600 to-purple-600 
          dark:from-pink-300 dark:to-purple-300 
          bg-clip-text text-transparent
        "
        >
          Add a New Course
        </h1>

        <p className="text-sm text-gray-600 dark:text-pink-200/70 max-w-xl">
          Fill in the information below to create your online course.
        </p>
      </div>

      <div
        className="
        rounded-2xl border
        bg-white/70 dark:bg-white/10 
        backdrop-blur-xl
        shadow-xl p-6 space-y-6
        border-pink-300/40 dark:border-pink-700/40
      "
      >
        <div className="space-y-2">
          <Label className="font-semibold text-gray-800 dark:text-pink-200">
            Course Title
          </Label>
          <Input
            type="text"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="
              h-11 bg-white/80 dark:bg-pink-900/20
              border border-pink-300/40 dark:border-pink-700/40
              focus-visible:ring-pink-500
              rounded-xl
            "
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-gray-800 dark:text-pink-200">
            Category
          </Label>

          <Select onValueChange={selectCategory}>
            <SelectTrigger
              className="
              w-full h-11 rounded-xl
              bg-white/80 dark:bg-pink-900/20 
              border border-pink-300/40 dark:border-pink-700/40
              focus:ring-pink-500
            "
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent
              className="
              bg-white/90 dark:bg-[#1a0b16]
              border border-pink-300/40 dark:border-pink-700/40
              rounded-xl shadow-lg
            "
            >
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>

                {[
                  "Next JS",
                  "Data Science",
                  "Frontend Development",
                  "Fullstack Development",
                  "MERN Stack Development",
                  "JavaScript",
                  "Python",
                  "Docker",
                  "MongoDB",
                  "HTML",
                ].map((c) => (
                  <SelectItem
                    key={c}
                    value={c}
                    className="
                    cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/30
                    rounded-lg transition
                  "
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-pink-200/40 dark:border-pink-700/30">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/course")}
            className="
              rounded-xl border-pink-400 text-pink-600
              dark:border-pink-700 dark:text-pink-300
              hover:bg-pink-100 dark:hover:bg-pink-900/30
          "
          >
            Back
          </Button>

          <Button
            disabled={isLoading}
            onClick={addCourse}
            className="
              px-6 py-2 rounded-xl text-white font-semibold
              bg-gradient-to-r from-pink-600 to-purple-600
              dark:from-pink-500 dark:to-purple-500
              shadow-lg hover:opacity-90 transition
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourse;
