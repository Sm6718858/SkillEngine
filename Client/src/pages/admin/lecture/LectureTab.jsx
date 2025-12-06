import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import React, { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { toast } from "sonner"
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation
} from "@/features/courseApi"
import { useNavigate } from "react-router-dom"

const LectureTab = ({ courseId, lectureId }) => {
  const [lectureTitle, setLectureTitle] = useState("")
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
  const [isFree, setIsFree] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [mediaProgress, setMediaProgress] = useState(false)

  const navigate = useNavigate()

  const { data: lectureData } = useGetLectureByIdQuery({
    courseId,
    lectureId,
  })

  const lecture = lectureData?.lecture

  const [editLecture, { isLoading, isSuccess, error }] = useEditLectureMutation()
  const [removeLecture, { isSuccess: removeSuccess, error: removeError }] =
    useRemoveLectureMutation()

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle)
      setIsFree(lecture.isPreviewFree)
      setUploadVideoInfo(lecture.videoInfo) 
    }
  }, [lecture])

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setMediaProgress(true)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/upload-video`,
        formData,
        {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total))
          },
        }
      )

      if (res.data.success) {
        setUploadVideoInfo({
          videoUrl: res.data.data.url,
          publicId: res.data.data.public_id,
        })
        toast.success("Video uploaded successfully!")
      }
    } catch (err) {
      toast.error("Video upload failed")
    } finally {
      setMediaProgress(false)
    }
  }

  const editLectureHandler = async () => {
    await editLecture({
      courseId,
      lectureId,
      lectureTitle,
      isPreviewFree: isFree,
      videoInfo: uploadVideoInfo,
    })
  }

  const removeLectureHandler = async () => {
    await removeLecture({ courseId, lectureId })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture updated successfully")
      navigate(`/admin/course/${courseId}/lecture`)
    }
    if (error) toast.error("Error updating lecture")
  }, [isSuccess, error])

  // Delete success
  useEffect(() => {
    if (removeSuccess) {
      toast.success("Lecture deleted successfully")
      navigate(`/admin/course/${courseId}/lecture`)
    }
    if (removeError) toast.error("Error deleting lecture")
  }, [removeSuccess, removeError])

  return (
    <div className="flex w-full gap-6 items-start mt-4">
      <Card className="w-full max-w-lg p-5 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Update and save your lecture.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label>Title</Label>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <Label>Video File</Label>
            <input
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              className="w-full border rounded-lg px-3 py-2 file:bg-primary file:text-white"
            />
          </div>

          <div className="flex justify-between items-center p-3 border rounded-lg">
            <Label>This video is FREE</Label>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>

          {mediaProgress && (
            <div>
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={editLectureHandler} disabled={isLoading} className="flex-1">
              Save Changes
            </Button>
            <Button
              variant="destructive"
              onClick={removeLectureHandler}
              className="flex-1"
            >
              Delete Lecture
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LectureTab
