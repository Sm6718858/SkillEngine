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

import { useCourseByIdQuery, useEditCourseMutation, usePublishCourseMutation, useRemoveCourseMutation } from "@/features/courseApi";

const CourseTab = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [isPublished, setIsPublished] = useState(true);
  const [editCourse, { isLoading, isSuccess, data, error }] = useEditCourseMutation();
  const [removeCourse, { isLoading: isRemoving, isSuccess: isRemoved, data: removeData, error: removeError }] = useRemoveCourseMutation();
  const { data: courseData, refetch } = useCourseByIdQuery(courseId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const handleRemoveCourse = async () => {
    if (window.confirm("Are you sure you want to remove this course?")) {
      await removeCourse(courseId);
    }
  };

  useEffect(() => {
    if (isRemoved) {
      toast.success(removeData?.message || "Course removed successfully!");
      navigate("/admin/course");
    }
    if (removeError) {
      toast.error(removeError?.data?.message || "Failed to remove course");
    }
  }, [isRemoved, removeError]);

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

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCourseLevel = (value) =>
    setInput((prev) => ({ ...prev, courseLevel: value }));

  const selectCategory = (value) =>
    setInput((prev) => ({ ...prev, category: value }));

  const updateCourseHandler = async () => {
    const formData = new FormData();
    for (const key in input) {
      const value = input[key];
      formData.append(key, value);
    }
    await editCourse({ formData, courseId });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setInput((prev) => ({ ...prev, courseThumbnail: file }));

    const fileReader = new FileReader();
    fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  const [publishCourse] = usePublishCourseMutation();
  const publishStatusHandler = async (action) => {
    try {
      const res = await publishCourse({courseId,query:action});
      if(res.data.success){
        toast.success(res?.data.message || "Course publish status updated");
      }
      refetch();
      return res;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update publish status");
    }
  };

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
      toast.success(data?.message || "Course updated successfully!");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Edit Course</CardTitle>
          <CardDescription>Update the course details below.</CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              setInput(() => publishStatusHandler(courseData?.course?.isPublished ? 'false':'true'))
            }
          >
            {courseData?.course?.isPublished ? "Unpublished" : "Publish"}
          </Button>

          <Button variant="destructive" onClick={handleRemoveCourse}>
            {
              isRemoving ? (
                <>
                  <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>

                  Removing...
                </>
              ) : (
                "Remove Course"
              )
            }
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-5 mt-3">

          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack Developer"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a fullstack developer"
            />
          </div>

          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="flex flex-wrap gap-5">
            <div>
              <Label>Category</Label>
              <Select
                value={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
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
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-[150px]"
              />
            </div>
          </div>

          <div>
            <Label>Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={selectThumbnail}
              className="w-fit"
            />

            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="h-64 my-2 rounded-md"
                alt="thumbnail preview"
              />
            )}
          </div>

          <div className="space-x-3">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button onClick={updateCourseHandler} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
