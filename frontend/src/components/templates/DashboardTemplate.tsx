import React, { ReactNode } from "react";
import SidebarComponent from "@/components/molecules/Sidebar"; // Assuming this is where your Sidebar.tsx is located
import { useState } from "react";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

interface DefaultTemplateProps {
  children: ReactNode;
}

const DashboardTemplate = ({ children }: DefaultTemplateProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      <SidebarComponent
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
      />
      <div
        className={`ml-0 flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}
        style={{ margin: 0 }}
      >
        <div className="mx-auto max-w-screen-xl p-16 pb-6 pt-12 sm:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
