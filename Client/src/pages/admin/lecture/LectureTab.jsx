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
import { useEditLectureMutation } from "@/features/courseApi"
import { useParams } from "react-router-dom"

const LectureTab = ({ courseId, lectureId }) => {
  const [open, setOpen] = useState(false)
  const [lectureTitle, setLectureTitle] = useState("")
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
  const [isFree, setIsFree] = useState(false)
  const [mediaProgress, setMediaProgress] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [buttonDisable, setButtonDisable] = useState(true)

  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation()

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0]
    console.log(e)
    if (file) {
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
          console.log(res)
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          })
          setButtonDisable(false)
          toast.success(res.data.message)
        }
      } catch (error) {
        console.error("Video upload failed:", error)
        toast.error("Failed to upload video.")
      } finally {
        setMediaProgress(false)
      }
    }
  }

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture updated successfully")
    }
    if (error) {
      toast.error("Error while updating lecture")
    }
  }, [isSuccess, error])

  return (
    <div className="flex w-full gap-6 items-start mt-4">
      <Card className="w-full max-w-lg p-5 shadow-lg border rounded-2xl relative">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-wide">
            Edit Lecture
          </CardTitle>
          <CardDescription>
            Update lecture details and save your changes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              placeholder="Enter lecture title"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="video">Video File</Label>
            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={fileChangeHandler}
              className="w-full border rounded-lg px-3 py-2 text-sm file:cursor-pointer file:border-none file:mr-2 file:px-3 file:py-1 file:bg-primary file:text-white file:rounded-md"
            />
          </div>

          <div className="flex justify-between items-center p-3 border rounded-lg bg-muted/30">
            <Label htmlFor="publish">Publish Lecture</Label>
            <Switch id="publish" checked={isFree} onCheckedChange={setIsFree} />
          </div>

          {mediaProgress && (
            <div>
              <Progress value={uploadProgress} className="w-[60%]" />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button
              onClick={editLectureHandler}
              disabled={isLoading}
              className="flex-1 cursor-pointer"
            >
              Save Changes
            </Button>
            <Button variant="destructive" className="flex-1 cursor-pointer">
              Delete Lecture
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:flex flex-1 h-84 items-center justify-center relative overflow-hidden rounded-xl shadow-lg">
        <motion.div
          className="absolute px-6 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-xl text-lg z-20 cursor-pointer"
          onClick={() => setOpen(!open)}
          animate={{ y: ["30%", "80%", "20%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          Skill Engine ✨
        </motion.div>

        <AnimatePresence>
          {open &&
            Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.7, 1, 0],
                  scale: [1, 1.5, 0.8],
                  y: [-60 - Math.random() * 80],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 2 + Math.random() * 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="absolute rounded-full bg-pink-400/60 shadow-xl blur-[1px]"
                style={{
                  width: `${5 + Math.random() * 20}px`,
                  height: `${5 + Math.random() * 20}px`,
                  left: `${5 + Math.random() * 60}%`,
                  bottom: "20%",
                }}
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LectureTab
