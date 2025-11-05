import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/authApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { isLoading: updateIsLoading }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await updateUser(formData);

      if (res?.data?.success) {
        toast.success("Profile updated successfully!");
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error updating profile");
    }
  };

  const user = data?.user ?? {};

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 my-12 py-8 space-y-10">
      <h1 className="font-extrabold text-3xl text-gray-900 dark:text-white text-center md:text-left tracking-tight">
        Profile
      </h1>

      <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-10 md:gap-12">
        {/* Avatar */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 shadow-lg ring-2 ring-purple-500/50">
            <AvatarImage
              src={user.photoUrl || "https://github.com/shadcn.png"}
              alt="profile"
            />
            <AvatarFallback className="text-xl font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="space-y-4 border-b pb-5 border-gray-200 dark:border-gray-700">
            <div className="flex sm:flex-row sm:items-center gap-1">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase w-20">
                Name:
              </span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </span>
            </div>

            <div className="flex sm:flex-row sm:items-center gap-1">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase w-20">
                Email:
              </span>
              <span className="text-base text-gray-800 dark:text-gray-200">
                {user.email}
              </span>
            </div>

            <div className="flex sm:flex-row sm:items-center gap-1">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase w-20">
                Role:
              </span>
              <span className="text-base font-medium text-purple-600 dark:text-purple-400">
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Edit Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal details & avatar.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  disabled={updateIsLoading}
                  onClick={handleUpdate}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {updateIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Courses */}
      <div>
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-4">
          Courses You're Enrolled In
        </h2>

        {user?.enrolledCourses?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {user.enrolledCourses.map((course) => (
              <Course key={course._id} {...course} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 font-medium text-lg py-10">
            You haven't enrolled in any course yet 📚 <br />
            <Button className="mt-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              Explore Courses →
            </Button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
