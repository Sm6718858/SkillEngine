import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@/components/RichTextEditor";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  useCourseByIdQuery,
  useEditCourseMutation,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/features/courseApi";

const CourseTab = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [editCourse, { isLoading, isSuccess, data, error }] =
    useEditCourseMutation();
  const [removeCourse, { isLoading: removing, isSuccess: deleted, data: removedData, error: removeErr }] =
    useRemoveCourseMutation();
  const [publishCourse] = usePublishCourseMutation();

  const { data: courseData, refetch } = useCourseByIdQuery(courseId, {
    refetchOnFocus: true,
  });

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: null,
    isPublished: false,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  useEffect(() => {
    if (courseData?.course) {
      const c = courseData.course;
      setInput({
        courseTitle: c.courseTitle || "",
        subTitle: c.subTitle || "",
        description: c.description || "",
        category: c.category || "",
        courseLevel: c.courseLevel || "",
        coursePrice: c.coursePrice || "",
        isPublished: c.isPublished || false,
        courseThumbnail: null,
      });
      setPreviewThumbnail(c.thumbnail);
    }
  }, [courseData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated!");
      navigate("/admin/course");
    }
    if (error) toast.error(error?.data?.message);
  }, [isSuccess, error]);

  useEffect(() => {
    if (deleted) {
      toast.success(removedData?.message || "Course removed");
      navigate("/admin/course");
    }
    if (removeErr) toast.error(removeErr?.data?.message);
  }, [deleted, removeErr]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectCategory = (value) =>
    setInput((prev) => ({ ...prev, category: value }));

  const selectLevel = (value) =>
    setInput((prev) => ({ ...prev, courseLevel: value }));

  const updateCourseHandler = async () => {
    const formData = new FormData();
    for (const key in input) formData.append(key, input[key]);
    await editCourse({ courseId, formData });
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setInput((prev) => ({ ...prev, courseThumbnail: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const publishHandler = async () => {
    const current = courseData?.course?.isPublished;
    const res = await publishCourse({ courseId, query: current ? "false" : "true" });

    if (res?.data?.success) {
      toast.success(res.data.message);
      refetch();
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to remove this course?")) {
      await removeCourse(courseId);
    }
  };

  return (
    <Card
      className="
        bg-white/70 dark:bg-white/10 
        backdrop-blur-xl
        border border-pink-300/40 dark:border-pink-700/40
        rounded-2xl shadow-xl
      "
    >
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle
            className="
            text-2xl font-bold
            bg-gradient-to-r from-pink-600 to-purple-600 
            bg-clip-text text-transparent
          "
          >
            Edit Course
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-pink-200/70">
            Modify your course details below.
          </CardDescription>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={courseData?.course?.lectures?.length === 0}
            onClick={publishHandler}
            className="
              border-pink-400 dark:border-pink-600
              text-pink-600 dark:text-pink-300
              hover:bg-pink-100 dark:hover:bg-pink-900/30
              rounded-xl
            "
          >
            {courseData?.course?.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button
            variant="destructive"
            onClick={deleteHandler}
            className="rounded-xl"
          >
            {removing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 mt-3">
        <div>
          <Label className="font-semibold text-gray-800 dark:text-pink-200">
            Title
          </Label>
          <Input
            name="courseTitle"
            value={input.courseTitle}
            onChange={handleChange}
            className="
              border-pink-300/40 dark:border-pink-700/40 
              bg-white/80 dark:bg-pink-900/20
              rounded-xl
            "
            placeholder="Ex. Fullstack Developer"
          />
        </div>

        <div>
          <Label className="font-semibold text-gray-800 dark:text-pink-200">
            Subtitle
          </Label>
          <Input
            name="subTitle"
            value={input.subTitle}
            onChange={handleChange}
            className="
              border-pink-300/40 dark:border-pink-700/40
              bg-white/80 dark:bg-pink-900/20
              rounded-xl
            "
            placeholder="Ex. Become a fullstack developer"
          />
        </div>

        <div>
          <Label className="font-semibold text-gray-800 dark:text-pink-200">
            Description
          </Label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <Label className="font-semibold text-gray-800 dark:text-pink-200">
              Category
            </Label>
            <Select value={input.category} onValueChange={selectCategory}>
              <SelectTrigger
                className="
                  w-[200px] rounded-xl
                  bg-white/70 dark:bg-pink-900/20
                  border-pink-300/40 dark:border-pink-700/40
                "
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectGroup>
                  <SelectItem value="Next JS">Next JS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Frontend Development">
                    Frontend Development
                  </SelectItem>
                  <SelectItem value="Fullstack Development">
                    Fullstack Development
                  </SelectItem>
                  <SelectItem value="MERN Stack Development">
                    MERN Stack Development
                  </SelectItem>
                  <SelectItem value="Javascript">Javascript</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-semibold text-gray-800 dark:text-pink-200">
              Course Level
            </Label>
            <Select value={input.courseLevel} onValueChange={selectLevel}>
              <SelectTrigger
                className="
                w-[200px] rounded-xl
                bg-white/70 dark:bg-pink-900/20
                border-pink-300/40 dark:border-pink-700/40
              "
              >
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectGroup>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Advance">Advance</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-semibold text-gray-800 dark:text-pink-200">
              Price (INR)
            </Label>
            <Input
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={handleChange}
              className="
                w-[150px] rounded-xl
                bg-white/80 dark:bg-pink-900/20
                border-pink-300/40 dark:border-pink-700/40
              "
              placeholder="199"
            />
          </div>
        </div>

        <div>
          <Label className="font-semibold text-gray-800 dark:text-pink-200">
            Thumbnail
          </Label>

          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnail}
            className="w-fit cursor-pointer border-pink-300/40 dark:border-pink-700/40 rounded-xl"
          />

          {previewThumbnail && (
            <img
              src={previewThumbnail}
              className="
                h-64 mt-3 rounded-xl shadow-lg
                border border-pink-300/40 dark:border-pink-700/40
              "
              alt="thumbnail preview"
            />
          )}
        </div>

        <div className="space-x-3 pt-3">
          <Button
            onClick={() => navigate("/admin/course")}
            variant="outline"
            className="
              rounded-xl 
              border-pink-400 dark:border-pink-600
              text-pink-600 dark:text-pink-300
              hover:bg-pink-100 dark:hover:bg-pink-900/30
            "
          >
            Cancel
          </Button>

          <Button
            onClick={updateCourseHandler}
            disabled={isLoading}
            className="
              rounded-xl 
              bg-gradient-to-r from-pink-600 to-purple-600
              text-white font-semibold
              shadow-lg hover:opacity-90
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
