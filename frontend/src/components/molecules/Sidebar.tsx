import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { IconButton, useMediaQuery } from "@mui/material";

interface SidebarProps {
  collapsed: boolean;
  handleToggleSidebar: () => void;
}

const SidebarComponent = ({ collapsed, handleToggleSidebar }: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activePage, setActivePage] = useState<string>("dashboard");

  const handleMenuClick = (page: string) => {
    setActivePage(page);
    if (isMobile) handleToggleSidebar(); // Close sidebar after selection on mobile
  };

  const nonSelectedColor = "#838383";
  const selectedColor = "#000000";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: collapsed ? "80px" : isMobile ? "100vw" : "220px",
        backgroundColor: "#f0f0f0", // Gray background color
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Align items to the top
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
        transition: "width 0.3s",
      }}
    >
      {/* Menu Toggle Button */}
      <IconButton
        onClick={handleToggleSidebar}
        style={{
          alignSelf: "flex-start",
          margin: "16px",
          color: "#000000",
        }}
      ></IconButton>

      <Menu>
        {/* Menu Items */}
        <MenuItem
          icon={
            <DashboardIcon
              style={{
                color:
                  activePage === "dashboard" ? selectedColor : nonSelectedColor,
              }}
            />
          }
          onClick={() => handleMenuClick("dashboard")}
          style={{
            color:
              activePage === "dashboard" ? selectedColor : nonSelectedColor,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {!collapsed && "Dashboard"}
        </MenuItem>

        <MenuItem
          icon={
            <ActivityIcon
              style={{
                color:
                  activePage === "activity" ? selectedColor : nonSelectedColor,
              }}
            />
          }
          onClick={() => handleMenuClick("activity")}
          style={{
            color: activePage === "activity" ? selectedColor : nonSelectedColor,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {!collapsed && "Activity"}
        </MenuItem>

        <MenuItem
          icon={
            <FundsIcon
              style={{
                color:
                  activePage === "funds" ? selectedColor : nonSelectedColor,
              }}
            />
          }
          onClick={() => handleMenuClick("funds")}
          style={{
            color: activePage === "funds" ? selectedColor : nonSelectedColor,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {!collapsed && "Funds"}
        </MenuItem>

        <MenuItem
          icon={
            <ContributorsIcon
              style={{
                color:
                  activePage === "contributors"
                    ? selectedColor
                    : nonSelectedColor,
              }}
            />
          }
          onClick={() => handleMenuClick("contributors")}
          style={{
            color:
              activePage === "contributors" ? selectedColor : nonSelectedColor,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {!collapsed && "Contributors"}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SidebarComponent;
