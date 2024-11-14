
import React, { ReactNode } from "react";
import Sidebar from "@/components/molecules/Sidebar";
import { useState } from "react";
import { IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MobileSidebar from "../molecules/MobileSidebar";

interface DefaultTemplateProps {
  children: ReactNode;
}

const DashboardTemplate = ({ children }: DefaultTemplateProps) => {
  //State to control sidebar collapse
  const [collapsed, setCollapsed] = useState(false);
  //Check to see if screen is mobile size
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activePage, setActivePage] = useState("dashboard");

  //Toggle sidebar collapse
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      {isMobile ? (
        <MobileSidebar
          collapsed={collapsed}
          handleToggleSidebar={handleToggleSidebar}
        />
      ) : (
        <Sidebar
          collapsed={collapsed}
          handleToggleSidebar={handleToggleSidebar}
        />
      )}
      <div
        className={`transition-all duration-300 ${isMobile
          ? "ml-0"
          : collapsed
            ? "ml-20"
            : "ml-64"
          } flex-1`}
      >
        <div className="mx-auto max-w-screen-xl p-4 sm:p-8 lg:p-16 pb-6 pt-12 sm:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;

