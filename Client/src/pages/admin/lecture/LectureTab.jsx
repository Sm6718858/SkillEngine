import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/courseApi";
import { useNavigate } from "react-router-dom";

const LectureTab = ({ courseId, lectureId }) => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaProgress, setMediaProgress] = useState(false);

  const navigate = useNavigate();

  const { data: lectureData } = useGetLectureByIdQuery({
    courseId,
    lectureId,
  });

  const lecture = lectureData?.lecture;

  const [editLecture, { isLoading, isSuccess, error }] =
    useEditLectureMutation();
  const [removeLecture, { isSuccess: removeSuccess, error: removeError }] =
    useRemoveLectureMutation();

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMediaProgress(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/upload-video`,
        formData,
        {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        }
      );

      if (res.data.success) {
        setUploadVideoInfo({
          videoUrl: res.data.data.url,
          publicId: res.data.data.public_id,
        });
        toast.success("Video uploaded successfully!");
      }
    } catch (err) {
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      courseId,
      lectureId,
      lectureTitle,
      isPreviewFree: isFree,
      videoInfo: uploadVideoInfo,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture({ courseId, lectureId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture updated successfully");
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (error) toast.error("Error updating lecture");
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success("Lecture deleted successfully");
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (removeError) toast.error("Error deleting lecture");
  }, [removeSuccess, removeError]);

  return (
    <div className="flex w-full justify-center mt-10 px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-2xl
          bg-white/60 dark:bg-white/10
          backdrop-blur-xl border
          border-pink-300/50 dark:border-pink-700/40
          shadow-xl rounded-2xl
          p-6 md:p-8
        "
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-pink-700 dark:text-pink-300">
            Edit Lecture
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-pink-200/70">
            Update your lecture details and manage video content.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">

          <div className="space-y-2">
            <Label className="text-gray-800 dark:text-pink-200">Lecture Title</Label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="
                w-full px-4 py-2 rounded-xl
                bg-white/80 dark:bg-pink-900/20 
                border border-pink-300/50 dark:border-pink-700/40
                focus-visible:ring-2 focus-visible:ring-pink-500
                transition
              "
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-800 dark:text-pink-200">Upload Video</Label>
            <input
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              className="
                w-full px-4 py-2 rounded-xl
                bg-white/80 dark:bg-pink-900/20
                border border-pink-300/50 dark:border-pink-700/40
                file:bg-pink-600 file:text-white file:px-4 file:py-2
                file:rounded-lg file:border-none
                focus-visible:ring-2 focus-visible:ring-pink-500
              "
            />
          </div>

          <div
            className="
              flex justify-between items-center py-3 px-4 rounded-xl
              bg-white/80 dark:bg-pink-900/20
              border border-pink-300/50 dark:border-pink-700/40
            "
          >
            <Label className="text-gray-800 dark:text-pink-200">
              This video is FREE preview
            </Label>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>

          {mediaProgress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Progress value={uploadProgress} />
              <p className="text-sm text-gray-700 dark:text-pink-200">
                {uploadProgress}% uploaded
              </p>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              onClick={editLectureHandler}
              disabled={isLoading}
              className="
                flex-1 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-pink-600 to-purple-600
                dark:from-pink-500 dark:to-purple-500
                shadow-lg hover:opacity-90 transition
              "
            >
              Save Changes
            </Button>

            <Button
              variant="destructive"
              onClick={removeLectureHandler}
              className="
                flex-1 py-3 rounded-xl font-semibold
              "
            >
              Delete Lecture
            </Button>
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
};

export default LectureTab;
