import { School, Video, Calculator, Code2, Menu, BookOpen, User, LogOut, LayoutDashboard } from "lucide-react";
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

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader
} from "@/components/ui/sheet";

import { Link, useNavigate } from "react-router-dom";
import { useLoadUserQuery, useLogoutUserMutation } from "@/features/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";



const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  useLoadUserQuery();

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
      w-full h-16 fixed top-0 left-0 z-50
      flex items-center justify-between
      px-6 md:px-10
      bg-white/60 dark:bg-[#1d0b16]/60
      border-b border-pink-200/40 dark:border-pink-600/30
      backdrop-blur-xl shadow-lg transition
    "
    >

      <Link to="/">
        <div className="flex items-center gap-4 cursor-pointer select-none">
          <School className="text-pink-600 dark:text-pink-400 drop-shadow-md" size={30} />
          <h1 className="font-extrabold text-xl md:text-2xl tracking-tight text-gray-900 dark:text-pink-200">
            SkillEngine
          </h1>
        </div>
      </Link>


      <div className="hidden md:flex items-center gap-8">

        <div
          className="
          flex items-center gap-6 px-5 py-2 rounded-2xl
          bg-white/40 dark:bg-white/10
          border border-pink-200/50 dark:border-pink-600/20
          backdrop-blur-xl shadow-sm
        "
        >

          <NavIcon to="/interview" label="Interview">
            <Video size={22} className="text-pink-600 dark:text-pink-400" />
          </NavIcon>

          <Divider />

          <NavIcon to="/aptitude" label="Aptitude Test">
            <Calculator size={22} className="text-pink-600 dark:text-pink-400" />
          </NavIcon>

          <Divider />

          <NavIcon to="/codingRound" label="Coding Round">
            <Code2 size={22} className="text-pink-600 dark:text-pink-400" />
          </NavIcon>

        </div>

        {user ? <UserMenu user={user} handleLogout={handleLogout} /> : <AuthButtons navigate={navigate} />}

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



const NavIcon = ({ to, label, children }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className="
            p-2 rounded-xl
            hover:bg-pink-100/60 dark:hover:bg-pink-500/20
            transition-all flex items-center justify-center
        "
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Divider = () => (
  <div className="w-[1.5px] h-8 bg-pink-300 dark:bg-pink-700 rounded-full" />
);

const AuthButtons = ({ navigate }) => (
  <div className="flex gap-3">
    <Button
      onClick={() => navigate("/login")}
      className="bg-pink-600 text-white hover:bg-pink-700 shadow-md"
    >
      Login
    </Button>

    <Button
      onClick={() => navigate("/login")}
      variant="outline"
      className="border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white"
    >
      Signup
    </Button>
  </div>
);

const UserMenu = ({ user, handleLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="outline-none border-none p-0 rounded-full hover:opacity-80 transition">
      <Avatar className="border border-pink-300 dark:border-pink-600 shadow-md">
        <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      className="
        w-56 rounded-xl shadow-2xl
        bg-white/80 dark:bg-[#2a1021]/80
        backdrop-blur-xl border border-pink-300/40 dark:border-pink-500/30
    "
    >
      <DropdownMenuLabel className="font-semibold text-pink-600 dark:text-pink-300">
        My Account
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem><Link to="/myLearning">My Learning</Link></DropdownMenuItem>
      <DropdownMenuItem><Link to="/profile">Edit Profile</Link></DropdownMenuItem>

      {user.role === "instructor" && (
        <DropdownMenuItem><Link to="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
      )}

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);



const MobileNav = ({ user }) => {
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged out");
      navigate("/login");
    }
  }, [isSuccess]);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="
            rounded-full bg-white text-black
            dark:bg-[#25101c] dark:text-pink-200
            shadow-md border border-pink-200 dark:border-pink-700
            hover:scale-105 hover:bg-pink-50 transition-all
        "
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>


      <SheetContent
        side="right"
        className="
          p-6 backdrop-blur-xl
          bg-white/70 dark:bg-[#1b0b16]/80
          border-l border-pink-300/40 dark:border-pink-700/40
          animate-in slide-in-from-right duration-300
      "
      >
        <SheetHeader className="text-center mb-6 mt-6">
          <h1 className="text-3xl font-extrabold text-pink-600 dark:text-pink-300">
            SkillEngine
          </h1>
        </SheetHeader>


        <div
          className="
            flex items-center justify-center gap-6 p-3 
            bg-white/10 dark:bg-white/10 
            rounded-2xl backdrop-blur-md border 
            border-pink-200/40 dark:border-pink-700/30
          "
        >

          <NavIcon to="/interview" label="Interview">
            <Video size={22} className="text-pink-600 dark:text-pink-400" />
          </NavIcon>

          <Divider />

          <NavIcon to="/aptitude" label="Aptitude">
            <Calculator size={22} className="text-pink-600 dark:text-pink-400" />
          </NavIcon>

          <Divider />

          <NavIcon to="/codingRound" label="Coding">
            <Code2 size={22} className="text-pink-600 dark:text-pink-400" />
          </NavIcon>

        </div>


        <nav className="flex flex-col gap-4 text-lg font-medium mt-8">

          {user ? (
            <>
              <MobileLink to="/myLearning" icon={<BookOpen size={20} />}>My Learning</MobileLink>
              <MobileLink to="/profile" icon={<User size={20} />}>Edit Profile</MobileLink>

              {user.role === "instructor" && (
                <MobileLink to="/admin/dashboard" icon={<LayoutDashboard size={20} />}>
                  Dashboard
                </MobileLink>
              )}

              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2 mt-3"
              >
                <LogOut size={18} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                className="bg-pink-600 text-white w-full text-base hover:bg-pink-700"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white text-base"
              >
                Signup
              </Button>
            </>
          )}

          <SheetClose asChild>
            <Button
              variant="ghost"
              className="w-full mt-4 text-gray-600 dark:text-pink-300 hover:text-gray-900"
            >
              Close Menu
            </Button>
          </SheetClose>

        </nav>
      </SheetContent>
    </Sheet>
  );
};


const MobileLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="
      flex items-center gap-3 p-3 rounded-xl 
      hover:bg-pink-100 dark:hover:bg-pink-900/30 
      transition-all text-gray-800 dark:text-pink-200
    "
  >
    {icon} {children}
  </Link>
);
