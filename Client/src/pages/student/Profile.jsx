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

const Profile = () => {
    const user = 'Shivam'
    const isLoading = false;
    const enrolledCourses = [];
    return (
        <div className="max-w-5xl mx-auto px-4 my-12 py-8 space-y-10">

            <h1 className="font-extrabold text-3xl text-gray-900 dark:text-white text-center md:text-left tracking-tight">
                Profile
            </h1>

            <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-10 md:gap-12">

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 shadow-lg ring-2 ring-purple-500/50">
                        <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
                        <AvatarFallback className="text-xl font-semibold">SM</AvatarFallback>
                    </Avatar>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Joined: Jan 2024
                    </p>
                </div>

                <div className="flex-1">
                    <div className="space-y-4 border-b pb-5 border-gray-200 dark:border-gray-700">
                        <div className="flex sm:flex-row sm:items-center gap-1">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase w-20">Name:</span>
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">Shivam Mishra</span>
                        </div>

                        <div className="flex sm:flex-row sm:items-center gap-1">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase w-20">Email:</span>
                            <span className="text-base text-gray-800 dark:text-gray-200">sm@sm.com</span>
                        </div>

                        <div className="flex sm:flex-row sm:items-center gap-1">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase w-20">Role:</span>
                            <span className="text-base font-medium text-purple-600 dark:text-purple-400">Student</span>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                                Edit Profile
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>Update your personal details & avatar.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Name</Label>
                                    <Input type="text" placeholder="Enter your name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Photo</Label>
                                    <Input type="file" accept="image/*" className="col-span-3" />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                    {isLoading ? (
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
                <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-4">
                    Courses You're Enrolled In
                </h2>

                {enrolledCourses.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400 font-medium text-lg py-10">
                        You haven't enrolled in any course yet 📚 <br />
                        <Button size="sm" className="mt-5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                            Explore Courses →
                        </Button>
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                        {enrolledCourses.map((course, i) => (
                            <Course key={i} {...course} />
                        ))}
                    </div>
                )}
            </div>
        </div>


    );
};

export default Profile;