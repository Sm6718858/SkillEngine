import { School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DarkMode } from "@/DarkMode";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetFooter } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import MyLearning from "@/pages/student/MyLearning";
import { useLogoutUserMutation } from "@/features/authApi";
import { toast } from "sonner";

const Navbar = () => {
  const user = 'null';
  const [logoutUser, { isSuccess, isdata }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success('User Logged out');
      navigate('/login');
    }
  }, [isSuccess])

  return (
    <div className="dark:bg-gray-700 bg-white w-full h-16 fixed top-0 left-0 flex items-center justify-between px-6 md:px-10 shadow-md z-50">

      <div className="flex items-center gap-2">
        <School className="text-2xl" />
        <h1 className="font-extrabold text-xl md:text-2xl text-gray-900 dark:text-white">
          SkillEngine
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none border-none p-0 rounded-full hover:opacity-80">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Link to='myLearning'>My Learning</Link></DropdownMenuItem>
              <DropdownMenuItem><Link to='profile'>Edit Profile</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-3">
            <Button className="bg-blue-600 text-white">Login</Button>
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
              Signup
            </Button>
          </div>
        )}

        <DarkMode />
      </div>

      <div className="md:hidden flex items-center gap-3">
        <DarkMode />
        <MobileNav user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNav = ({ user }) => {
  const role = "none";
  const [logoutUser, { isSuccess, isdata }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success('User Logged out');
      navigate('/login');
    }
  }, [isSuccess])


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="
            rounded-full bg-gray-100 dark:bg-gray-800 
            text-gray-900 dark:text-white
            shadow-md border border-gray-300 dark:border-gray-700
            hover:bg-white dark:hover:bg-gray-700 
            hover:shadow-lg transition-all duration-300 active:scale-95
          "
        >
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-6">

        <SheetHeader className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">SkillEngine</h1>
        </SheetHeader>

        <nav className="flex flex-col gap-5 text-lg">

          {user ? (
            <>
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                👋 Welcome, {user.name || "User"}
              </span>

              <span className="hover:text-blue-600 cursor-pointer">
                <Link to="/myLearning">My Learning</Link>
              </span>

              <span className="hover:text-blue-600 cursor-pointer">
                <Link to="/profile">Edit Profile</Link>
              </span>

              <Button onClick={handleLogout} variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-600 hover:text-white">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button className="bg-blue-600 text-white w-full">
                Login
              </Button>

              <Button
                variant="outline"
                className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                Signup
              </Button>
            </>
          )}

          {role === "instructor" && (
            <SheetClose asChild>
              <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 mt-2">
                Instructor Dashboard
              </Button>
            </SheetClose>
          )}

          <SheetClose asChild>
            <Button variant="ghost" className="w-full mt-4 text-gray-500 hover:text-red-600">
              Close Menu
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

