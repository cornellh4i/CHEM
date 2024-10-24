import React, { ReactNode } from "react";
import SidebarComponent from "@/components/molecules/Sidebar"; // Assuming this is where your Sidebar.tsx is located
import { useState } from "react";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

interface DefaultTemplateProps {
  children: ReactNode;
}

const DashboardTemplate = ({ children }: DefaultTemplateProps) => {
  // State to track whether the sidebar is collapsed or expanded
  const [collapsed, setCollapsed] = useState(false);

  // Function to toggle the sidebar's collapsed state
  const handleToggleSidebar = () => {
    // Toggle the collapsed state to its opposite value
    setCollapsed(!collapsed);
  };

  return (
    // Main container for the dashboard layout
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      {/* Display SidebarComponent, passing the current collapsed state and toggle function as props */}
      <SidebarComponent
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
      />
      {/* Main content area */}
      <div
        className={`ml-0 flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}
        style={{ margin: 0 }}
      >
        {/* Inner container for the content */}
        <div className="mx-auto max-w-screen-xl p-16 pb-6 pt-12 sm:mt-0">
          {/* Rendering any children components passed to the DashboardTemplate */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
