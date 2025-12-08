import { School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DarkMode } from "@/DarkMode";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useLoadUserQuery, useLogoutUserMutation } from "@/features/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { data, isLoading } = useLoadUserQuery();
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Logged out");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div
      className="
        dark:bg-gray-900 bg-white
        w-full h-16 fixed top-0 left-0
        flex items-center justify-between
        px-6 md:px-10 shadow-md z-50
        border-b border-gray-200 dark:border-gray-700
      "
    >
      <Link to="/">
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <School className="text-blue-600 dark:text-blue-400" size={28} />
        <h1 className="font-extrabold text-xl md:text-2xl text-gray-900 dark:text-white tracking-tight">
          SkillEngine
        </h1>
      </div>
</Link>
      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none border-none p-0 rounded-full hover:opacity-80 transition">
              <Avatar className="border border-gray-300 dark:border-gray-700 shadow-sm">
                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 shadow-xl rounded-lg">
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link to="myLearning">My Learning</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to="profile">Edit Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Log out
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {user.role === "instructor" && (
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Login
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="
                border-blue-600 text-blue-600
                hover:bg-blue-600 hover:text-white
              "
            >
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

/* ---------------- MOBILE MENU ---------------- */

const MobileNav = ({ user }) => {
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Logged out");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="
            rounded-full bg-gray-100 dark:bg-gray-800 
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-gray-600
            shadow-md hover:shadow-lg
            transition-all duration-300 active:scale-95
          "
        >
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-6 dark:bg-gray-900">
        <SheetHeader className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            SkillEngine
          </h1>
        </SheetHeader>

        <nav className="flex flex-col gap-5 text-lg">
          {user ? (
            <>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                👋 Welcome, {user.name || "User"}
              </span>

              <Link to="/myLearning" className="hover:text-blue-600 dark:hover:text-blue-400">
                My Learning
              </Link>

              <Link to="/profile" className="hover:text-blue-600 dark:hover:text-blue-400">
                Edit Profile
              </Link>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="
                  w-full border-red-500 text-red-600
                  hover:bg-red-600 hover:text-white
                "
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white w-full hover:bg-blue-700"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="
                  w-full border-blue-600 text-blue-600
                  hover:bg-blue-600 hover:text-white
                "
              >
                Signup
              </Button>
            </>
          )}

          <SheetClose asChild>
            <Button variant="ghost" className="w-full mt-4 text-gray-500 dark:text-gray-400">
              Close Menu
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
