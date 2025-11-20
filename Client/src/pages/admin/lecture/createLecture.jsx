import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateLectureMutation, useGetCourseLectureQuery } from "@/features/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { isLoading, error, data }] = useCreateLectureMutation();
  const {
    data: getLectureData,
    error: getLectureError,
    isLoading: getLectureLoading,
  } = useGetCourseLectureQuery(courseId);


  const handleCreateLecture = () => {
    createLecture({ courseId, lectureTitle });
  };

  useEffect(() => {
    if (data) {
      toast.success('Lecture Created' || data.message);
      setLectureTitle("");
    }
    if (error) {
      toast.error(error);
    }
  }, [error, data])


  useEffect(() => {
    if (getLectureData) {
      console.log(getLectureData);
    }
    if (getLectureError) {
      console.log(getLectureError);
    }
  }, [getLectureData, getLectureError])


  return (
    <div className="flex-1 mx-10 mt-3 pt-7">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            placeholder="Your Title Name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>

          <Button disabled={isLoading} onClick={handleCreateLecture}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <h1 className="font-bold">Related Lectures</h1>

        {getLectureLoading && <p>Loading...</p>}

        {getLectureLoading && <p>Loading...</p>}

        {getLectureData?.lectures?.length === 0 && <p>No Lectures Found</p>}

        {getLectureData?.lectures?.map((e) => (
          <ul key={e._id}>
            <li className="mt-2">{e.lectureTitle}</li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default CreateLecture;
