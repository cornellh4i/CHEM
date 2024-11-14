import React, { ReactNode } from "react";
import Sidebar from "@/components/molecules/Sidebar";
import { useState } from "react";
import { IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface DefaultTemplateProps {
  children: ReactNode;
}

const DashboardTemplate = ({ children }: DefaultTemplateProps) => {
  // State to control sidebar collapse
  const [collapsed, setCollapsed] = useState(false);
  // Check if screen size is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Toggle sidebar collapse
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      <Sidebar
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
      />

      {/* Main content area with dynamic margin based on sidebar state */}
      <div
        className={`transition-all duration-300 ${isMobile
          ? "ml-0"                // No margin for mobile
          : collapsed
            ? "ml-20"             // Smaller margin for collapsed sidebar
            : "ml-64"             // Full margin for expanded sidebar
          } flex-1`}
      >
        <div className="mx-auto max-w-screen-xl p-4 sm:p-8 lg:p-16 pb-6 pt-12 sm:mt-0">
          {children}
        </div>
      </div>

      {isMobile && (
        <IconButton
          onClick={handleToggleSidebar}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
        </IconButton>
      )}
    </div>
  );
};

export default DashboardTemplate;
