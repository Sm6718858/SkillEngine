import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { useCreatorCourseQuery } from "@/features/courseApi";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCreatorCourseQuery();

  if (isLoading) return <p className="p-4 text-pink-600">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Something went wrong.</p>;

  return (
    <div
      className="
      p-6 mt-10
      bg-white/60 dark:bg-white/10 
      backdrop-blur-xl 
      rounded-2xl 
      border border-pink-300/40 dark:border-pink-700/40
      shadow-xl
      "
    >
      <Button
        onClick={() => navigate("/admin/course/create")}
        className="
          mb-4 px-5 py-2
          bg-gradient-to-r from-pink-600 to-purple-600
          hover:opacity-90 text-white font-semibold
          rounded-xl shadow-lg
        "
      >
        + Create New Course
      </Button>

      <Table>
        <TableCaption className="text-gray-600 dark:text-pink-200 mt-2">
          A list of all courses you have created.
        </TableCaption>

        <TableHeader>
          <TableRow
            className="
            bg-pink-100/60 dark:bg-pink-900/30
            border-none
            "
          >
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.courses?.map((course) => (
            <TableRow
              key={course._id}
              className="
                hover:bg-pink-100/40 dark:hover:bg-pink-900/20
                transition-all cursor-pointer rounded-lg
                border-b border-pink-200/40 dark:border-pink-700/40
              "
            >
              <TableCell className="font-bold text-gray-800 dark:text-pink-200">
                {course.coursePrice || "NA"}
              </TableCell>

              <TableCell>
                <Badge
                  className="
                    px-3 py-1 rounded-full text-xs
                    bg-pink-600 text-white 
                    dark:bg-pink-700
                  "
                >
                  {course.isPublished ? "Published" : "Unpublished"}
                </Badge>
              </TableCell>

              <TableCell className="font-medium text-gray-700 dark:text-pink-100">
                {course.courseTitle}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/course/${course._id}`)}
                  className="
                    hover:bg-pink-200/60 dark:hover:bg-pink-900/30 
                    rounded-lg transition
                  "
                >
                  <Edit className="text-pink-600 dark:text-pink-300" size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
