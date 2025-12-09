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
   <div className="
    max-w-5xl mx-auto px-4 my-12 py-10 space-y-10
    animate-fadeSlide
">

  <h1 className="
      font-extrabold text-4xl 
      text-gray-900 dark:text-white 
      tracking-tight text-center md:text-left
    ">
    Profile
  </h1>

  <div className="
      bg-white dark:bg-gray-900 
      shadow-xl rounded-3xl p-8 
      border border-gray-200 dark:border-gray-700 
      flex flex-col md:flex-row gap-10 
      backdrop-blur-xl 
      transition-all duration-300 hover:shadow-2xl
    "
  >
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
      
      <div className="
          relative group
        "
      >
        <Avatar className="
            h-32 w-32 md:h-40 md:w-40
            shadow-lg ring-4 ring-purple-500/40 
            transition-all duration-300 
            group-hover:scale-105 group-hover:ring-purple-500/60
          ">
          <AvatarImage
            src={user.photoUrl || 'https://github.com/shadcn.png'}
            alt="profile"
          />
          <AvatarFallback className="text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="
            absolute -inset-2 rounded-full 
            bg-purple-500/20 blur-2xl opacity-0 
            group-hover:opacity-70 
            transition-all duration-500
          ">
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Joined:{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>

    <div className="flex-1 space-y-6">

      <div className="
          space-y-4 pb-5 
          border-b border-gray-200 dark:border-gray-700
        "
      >
        <div className="flex sm:flex-row sm:items-center gap-1">
          <span className="
              text-sm font-semibold 
              text-gray-600 dark:text-gray-300 uppercase w-24
            ">
            Name:
          </span>
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
            {user.name}
          </span>
        </div>

        <div className="flex sm:flex-row sm:items-center gap-1">
          <span className="
              text-sm font-semibold 
              text-gray-600 dark:text-gray-300 uppercase w-24
            ">
            Email:
          </span>
          <span className="text-base text-gray-800 dark:text-gray-200">
            {user.email}
          </span>
        </div>

        <div className="flex sm:flex-row sm:items-center gap-1">
          <span className="
              text-sm font-semibold 
              text-gray-600 dark:text-gray-300 uppercase w-24
            ">
            Role:
          </span>
          <span className="
              text-base font-semibold 
              text-purple-600 dark:text-purple-400
            ">
            {user.role?.toUpperCase()}
          </span>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="
              mt-3 bg-purple-600 hover:bg-purple-700 
              text-white rounded-lg px-6 py-2 
              transition-all duration-300
              hover:shadow-lg hover:scale-[1.03]
            ">
            Edit Profile
          </Button>
        </DialogTrigger>

        {/* Edit Dialog */}
        <DialogContent className="
            max-w-md animate-fadeSlide 
            border border-gray-200 dark:border-gray-800
            shadow-xl
          "
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal details & avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 focusGlow"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="col-span-3 focusGlow"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={updateIsLoading}
              onClick={handleUpdate}
              className="
                  w-full bg-purple-600 hover:bg-purple-700 
                  text-white rounded-lg 
                  transition-all duration-300
                  hover:shadow-lg hover:scale-[1.03]
                "
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

  <div>
    <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200 mb-4">
      Courses You're Enrolled In
    </h2>

    {user?.enrolledCourses?.length ? (
  <div className="
      grid grid-cols-1 sm:grid-cols-2 
      md:grid-cols-3 lg:grid-cols-4 
      gap-6 mt-6 animate-fadeIn
    "
  >
    {user.enrolledCourses.map((course, index) => (
      <Course key={index} course={course} />
    ))}
  </div>
) : (
  <p className="
      text-center text-gray-600 dark:text-gray-400 
      font-medium text-lg py-10 animate-fadeIn
    "
  >
    You haven't enrolled in any course yet 📚 <br />
    <Button className="
        mt-5 bg-purple-600 hover:bg-purple-700 
        text-white rounded-lg px-6 py-2 
        hover:shadow-lg hover:scale-[1.03]
      "
    >
      Explore Courses →
    </Button>
  </p>
)}

  </div>
</div>

  );
};

export default Profile;
