import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/authApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { isLoading: updateIsLoading }] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const user = data?.user ?? {};

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    const res = await updateUser(formData);

    if (res?.data?.success) {
      toast.success("Profile updated!");
      refetch();
    } else {
      toast.error(res?.error?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 space-y-14 animate-fadeSlide">

      <h1
        className="
        text-4xl font-extrabold text-center md:text-left
        bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600
        bg-clip-text text-transparent
      "
      >
        Profile
      </h1>

      <div
        className="
        bg-white/70 dark:bg-white/10 
        backdrop-blur-xl 
        rounded-3xl p-10 shadow-2xl border border-pink-300/30 dark:border-pink-900/30
        flex flex-col md:flex-row gap-12 transition-all duration-300
      "
      >
        <div className="flex flex-col items-center md:items-start gap-3">

          <div className="relative group">
            <Avatar
              className="
              h-36 w-36 md:h-44 md:w-44 rounded-2xl
              ring-4 ring-pink-500/40 shadow-xl
              transition-all group-hover:scale-105 group-hover:ring-pink-500/60
            "
            >
              <AvatarImage
                src={user.photoUrl || "https://github.com/shadcn.png"}
                alt={user.name}
              />
              <AvatarFallback className="text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div
              className="
              absolute inset-0 rounded-2xl bg-pink-500/20 blur-2xl opacity-0 
              group-hover:opacity-80 transition-all duration-500
            "
            />
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <div className="flex-1 space-y-8">

          <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <Detail label="Name" value={user.name} />
            <Detail label="Email" value={user.email} />
            <Detail label="Role" value={user.role?.toUpperCase()} special />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="
                bg-gradient-to-r from-pink-600 to-purple-600 
                text-white px-6 py-2 rounded-xl
                hover:shadow-lg hover:scale-[1.03] transition-all
              "
              >
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent
              className="
              max-w-md bg-white dark:bg-black
              border border-pink-300 dark:border-pink-800
              shadow-2xl rounded-2xl animate-fadeSlide
            "
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold">
                  Edit Profile
                </DialogTitle>
                <DialogDescription>
                  Update your name or change your avatar.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 py-4">

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Photo</Label>
                  <Input
                    className="col-span-3"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

              </div>

              <DialogFooter>
                <Button
                  disabled={updateIsLoading}
                  onClick={handleUpdate}
                  className="
                  w-full bg-gradient-to-r from-pink-600 to-purple-600 
                  text-white hover:scale-[1.02] transition-all rounded-xl
                "
                >
                  {updateIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
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

      <div>
        <h2
          className="
          text-3xl font-bold mb-6
          bg-gradient-to-r from-pink-600 to-purple-600 
          bg-clip-text text-transparent
        "
        >
          Your Courses
        </h2>

        {user?.enrolledCourses?.length ? (
          <div
            className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
            gap-7 animate-fadeIn
          "
          >
            {user.enrolledCourses.map((course, i) => (
              <Course key={i} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 animate-fadeIn">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              You haven’t enrolled in any course yet.
            </p>

            <Button
              className="
              mt-5 bg-gradient-to-r from-pink-600 to-purple-600 
              text-white px-6 py-2 rounded-xl
              hover:scale-[1.03] hover:shadow-lg
            "
            >
              Explore Courses →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value, special }) => (
  <div className="flex sm:flex-row sm:items-center gap-1">
    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase w-24">
      {label}:
    </span>
    <span
      className={`
        text-base font-medium
        ${special ? "text-pink-600 dark:text-pink-400 font-semibold" : "text-gray-900 dark:text-gray-100"}
      `}
    >
      {value}
    </span>
  </div>
);

export default Profile;
