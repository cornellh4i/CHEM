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
        className={"flex-1 transition-all duration-300"}
        style={{
          textAlign: "left",
          maxWidth: "100%",
          padding: "2rem",
          marginLeft: collapsed ? "128px" : "268px",
        }}
      >
        {children}
      </div>

      {
        <IconButton
          onClick={handleToggleSidebar}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          <MenuIcon />
        </IconButton>
      }
    </div>
  );
};

export default DashboardTemplate;
