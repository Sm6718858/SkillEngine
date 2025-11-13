import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex sticky top-0">
      <div
        className="hidden lg:block w-[240px] sm:w-[280px] 
        border-r border-gray-300 dark:border-gray-700 
        p-6 mt-10 pt-12 space-y-8 sticky top-0 h-screen"
      >
        <div className="space-y-5">
          <Link to="dashboard" className="flex items-center gap-3">
            <ChartNoAxesColumn size={22} />
            <span className="text-[15px] font-medium">Dashboard</span>
          </Link>

          <Link to="course" className="flex items-center gap-3">
            <SquareLibrary size={22} />
            <span className="text-[15px] font-medium">Courses</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-8 sm:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
