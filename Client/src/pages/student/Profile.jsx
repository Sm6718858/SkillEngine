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
    return (
        <div className="max-w-4xl mx-auto px-4 my-12 py-8">
            <h1 className="font-extrabold text-3xl text-center md:text-left text-gray-900 dark:text-white tracking-tight">
                Profile
            </h1>

            <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mt-6 flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-200 dark:border-gray-700">

                <div className="flex flex-col items-center">
                    <Avatar className="h-28 w-28 md:h-36 md:w-36 shadow-lg ring-2 ring-purple-500/40">
                        <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
                        <AvatarFallback className="text-lg font-semibold">SM</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Joined: Jan 2024
                    </p>
                </div>

                <div className="w-full">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                            Name:
                            <span className="ml-2 font-normal text-gray-800 dark:text-gray-200">
                                Shivam Mishra
                            </span>
                        </p>

                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                            Email:
                            <span className="ml-2 font-normal text-gray-800 dark:text-gray-200">
                                sm@sm.com
                            </span>
                        </p>

                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
                            Role:
                            <span className="ml-2 font-normal text-purple-600 dark:text-purple-400 font-medium">
                                Student
                            </span>
                        </p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
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
                                    <Input type="text" placeholder="Enter your name" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>Profile Photo</Label>
                                    <Input type="file" accept="image/*" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white" >
                                    {
                                        isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...</>
                                        ) : (
                                            "Save Changes"
                                        )
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>

    );
};

export default Profile;