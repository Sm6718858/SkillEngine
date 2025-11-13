import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CourseTab = () => {
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: null,
  });

  const [previewThumbnail,setPreviewThumbnail] = useState("");

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCourseLevel = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  const selectCategory = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) setInput((prev) => ({ ...prev, courseThumbnail: file }));
    const fileReader = new FileReader();
    fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Course Saved:", input);
      setIsLoading(false);
      navigate("/admin/course");
    }, 1500);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Add or update course details below. Click save when you’re done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPublished((prev) => !prev)}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="destructive">Remove Course</Button>
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
              placeholder="Ex. Become a Fullstack developer from zero to hero"
            />
          </div>

          <div>
            <Label>Description</Label>
             <RichTextEditor input={input} setInput={setInput} />

          </div>

          <div className="flex flex-wrap gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a category" />
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
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
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
                  <SelectValue placeholder="Select a level" />
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
                placeholder="e.g. 199"
                className="w-[150px]"
              />
            </div>
          </div>

          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {
              previewThumbnail && (
                <img src={previewThumbnail} className="e-64 my-2" alt="courseThumbnail"/>
              )
            }
          </div>

          <div className="space-x-3">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
