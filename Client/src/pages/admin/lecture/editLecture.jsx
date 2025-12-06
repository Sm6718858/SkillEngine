import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const { courseId, lectureId } = useParams(); 
  console.log("Course ID:", courseId);
  console.log("Lecture ID:", lectureId);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 mt-5 pt-5">
        <div className="flex items-center gap-2">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button size="icon" variant="outline" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Update Your Lecture</h1>
        </div>
      </div>

      <LectureTab courseId={courseId} lectureId={lectureId} />  
    </div>
  );
};

export default EditLecture;
