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

    if (!courseTitle || !category) {
      toast.error("Please fill all fields");
      return;
    }

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
  }, [isSuccess, error, navigate]);

  return (
    <div className="flex-1 mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-bold text-2xl sm:text-3xl tracking-tight">
          Add a new course
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Fill in the basic details below to create your new online course.
        </p>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <Label className="font-semibold">Course Title</Label>
          <Input
            type="text"
            placeholder="Enter your course name"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Category</Label>
          <Select onValueChange={selectCategory}>
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
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
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>

          <Button disabled={isLoading} onClick={addCourse} className="px-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
