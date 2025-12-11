import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", icon: ChartNoAxesColumn, path: "dashboard" },
    { name: "Courses", icon: SquareLibrary, path: "course" },
  ];

  return (
    <div className="flex w-full">

      <div
        className="
        hidden lg:block h-screen w-[240px] sm:w-[260px]
        sticky top-0 p-6 pt-20
        bg-white/40 dark:bg-white/10 
        backdrop-blur-2xl
        border-r border-pink-300/40 dark:border-pink-700/40
        shadow-xl
        "
      >
        <div className="space-y-5">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.includes(item.path);

            return (
              <Link
                key={index}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-[15px] font-medium transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-800 dark:text-pink-200 hover:bg-pink-200/40 dark:hover:bg-pink-900/30"
                  }
                `}
              >
                <Icon
                  size={22}
                  className={`${isActive ? "text-white" : "text-pink-600 dark:text-pink-300"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
