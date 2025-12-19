import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
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
import { Loader2, ClipboardList, ChevronDown } from "lucide-react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/authApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { isLoading: updateIsLoading }] =
    useUpdateUserMutation();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const user = data?.user ?? {};
  const publicProfileUrl = `${window.location.origin}/u/${user._id}`;

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
      toast.error(res?.error?.data?.message || "Failed to update");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">
      <h1
        className="
          text-4xl font-extrabold text-center md:text-left
          bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600
          bg-clip-text text-transparent mt-5 pt-2
        "
      >
        Profile
      </h1>

      <div
        className="
          bg-white/70 dark:bg-white/10
          backdrop-blur-xl
          rounded-3xl p-6 sm:p-10
          shadow-2xl
          border border-pink-300/30 dark:border-pink-900/30
          flex flex-col lg:flex-row gap-10
        "
      >
        <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-[280px]">
          <Avatar className="h-36 w-36 rounded-2xl ring-4 ring-pink-500/40 shadow-xl">
            <AvatarImage src={user.photoUrl} />
            <AvatarFallback className="text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-gray-500">
            Joined:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>

          {user.role !== "instructor" && (
            <div className="w-full mt-4">
              <button
                onClick={() => setShowShare((p) => !p)}
                className="
                  w-full flex items-center justify-between
                  px-4 py-3 rounded-xl
                  bg-white/60 dark:bg-gray-800/60
                  border border-pink-300/40
                  hover:shadow-lg transition
                "
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="text-pink-600" />
                  <span className="font-semibold">Public Profile</span>
                </div>

                <ChevronDown
                  className={`h-5 w-5 transition-transform ${showShare ? "rotate-180" : ""
                    }`}
                />
              </button>

              {showShare && (
                <div className="mt-4 p-4 rounded-xl bg-white dark:bg-black/10 shadow-md space-y-3">
                  <div className="flex justify-center">
                    <QRCodeCanvas value={publicProfileUrl} size={120} />
                  </div>

                  <p className="text-xs text-center break-all text-pink-600">
                    {publicProfileUrl}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-8">
          <div
            className="
    pb-6 border-b space-y-2
    [&_*]:flex-row
    [&_*]:items-center
    [&_*]:whitespace-nowrap
  "
          >
            <Detail label="Name" value={user.name} />
            <Detail label="Email" value={user.email} />
            <Detail
              label="Role"
              value={user.role?.toUpperCase()}
              special
            />
          </div>


          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl">
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update name or profile photo
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
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
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  disabled={updateIsLoading}
                  onClick={handleUpdate}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                >
                  {updateIsLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Your Courses
        </h2>

        {user?.enrolledCourses?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {user.enrolledCourses.map((course, i) => (
              <Course key={i} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            You haven’t enrolled in any course yet.
          </p>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value, special }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
    <span className="text-sm font-semibold text-gray-500 w-24">
      {label}:
    </span>
    <span
      className={`text-base ${special ? "text-pink-600 font-semibold" : ""
        }`}
    >
      {value}
    </span>
  </div>
);

export default Profile;
