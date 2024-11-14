import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  CollectionsBookmark as LogoIcon,
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

interface MobileSidebarProps {
  collapsed: boolean;
  handleToggleSidebar: () => void; // Function to toggle the sidebar state
}

const MobileSidebar = ({ collapsed, handleToggleSidebar }: MobileSidebarProps) => {
  const isSmallMobile = useMediaQuery("(max-width: 500px)");

  return (
    <Sidebar
      collapsed={collapsed}
      style={{
        width: collapsed ? "0" : "80px", // Sidebar width when not collapsed
        height: "100vh",
        position: "fixed",
        left: collapsed ? "-80px" : "0", // Slide in/out effect for sidebar
        top: 0,
        backgroundColor: "#FFFFFF", // Solid background color
        transition: "left 0.3s ease",
        zIndex: 20, // Ensures sidebar is above other elements if needed
        overflow: "hidden",
      }}
    >
      <Menu>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            color: "#185F96",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <LogoIcon style={{ width: "24px", height: "24px" }} />
        </div>
        <MenuItem icon={<DashboardIcon />} onClick={handleToggleSidebar}>
          {!isSmallMobile && "Dashboard"} {/* Only show text if not very narrow */}
        </MenuItem>
        <MenuItem icon={<ActivityIcon />} onClick={handleToggleSidebar}>
          {!isSmallMobile && "Activity"}
        </MenuItem>
        <MenuItem icon={<FundsIcon />} onClick={handleToggleSidebar}>
          {!isSmallMobile && "Funds"}
        </MenuItem>
        <MenuItem icon={<ContributorsIcon />} onClick={handleToggleSidebar}>
          {!isSmallMobile && "Contributors"}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default MobileSidebar;
