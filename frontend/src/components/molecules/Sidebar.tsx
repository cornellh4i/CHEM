import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"; // Import Sidebar and Menu components from react-pro-sidebar
import {
  CollectionsBookmark as LogoIcon,
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Portrait as PortraitIcon,
} from "@mui/icons-material"; // Import Material-UI icons
import { IconButton, useMediaQuery } from "@mui/material"; // Import IconButton and useMediaQuery from Material-UI
import Link from "next/link";

interface SidebarProps {
  collapsed: boolean; // Indicates if the sidebar is collapsed
  handleToggleSidebar: () => void; // Function to toggle the sidebar state
}

const SidebarComponent = ({ collapsed, handleToggleSidebar }: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)"); // Check if the screen size is mobile

  const [activePage, setActivePage] = useState<string>("dashboard"); // State to track the active page

  // Function to set the active page when a menu item is clicked
  const handleMenuClick = (page: string) => {
    setActivePage(page);
  };

  // Color definitions for selected and non-selected menu items
  const nonSelectedColor = "#838383";
  const selectedColor = "#000000";

  return (
    <div className="relative">
      {" "}
      {/* Sidebar toggle button */}
      <IconButton
        onClick={handleToggleSidebar} // Toggle sidebar on button click
        style={{
          position: "absolute", // Position the button absolutely within the container
          top: 16, // Distance from the top
          left: !isMobile ? (collapsed ? 80 : 200) : collapsed ? 12 : 200, // Dynamic left position based on collapsed state and screen size
          zIndex: 1000, // Ensure button is above other elements
        }}
      >
        <MenuIcon />
      </IconButton>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        breakPoint={isMobile ? "always" : "md"} // Always collapsed on mobile, collapsed on medium screens
        style={{
          width: collapsed ? "80px" : isMobile ? "100vw" : "200px", // 8z0px when collapsed, 200px on desktop, full width on mobile
          height: "100vh", // Full height
          transition: "width 0.3s", // Smooth width transition
          left: isMobile && collapsed ? "-200px" : "0", // Offscreen when collapsed on mobile
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <Menu>
              {/* Sidebar header with logo */}
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  color: "#185F96",
                  fontWeight: "bold",
                  padding: "10px 20px",
                  paddingLeft: "28px",
                }}
              >
                <LogoIcon
                  style={{ width: "20px", height: "auto", marginRight: "16px" }}
                />{" "}
                {/* Logo icon */}
                {!collapsed && "Odyssey Fund"}{" "}
                {/* Display web name if not collapsed */}
              </div>
              {/* Button to go to dashboard page */}
                <MenuItem
                component="a"
                href="/dashboard"
                  icon={
                    <DashboardIcon
                      style={{
                        width: "20px",
                        height: "auto",
                        color:
                          activePage === "dashboard"
                            ? selectedColor
                            : nonSelectedColor, // Color based on active state
                      }}
                    />
                  }
                  onClick={() => handleMenuClick("dashboard")} // Click handler to set active page
                  style={{
                    color:
                      activePage === "dashboard"
                        ? selectedColor
                        : nonSelectedColor,
                  }}
                >
                  Dashboard
                </MenuItem>
              {/* Button to go to activity page */}
              <MenuItem
                icon={
                  <ActivityIcon
                    style={{
                      width: "20px",
                      height: "auto",
                      color:
                        activePage === "activity"
                          ? selectedColor
                          : nonSelectedColor,
                    }}
                  />
                }
                onClick={() => handleMenuClick("activity")}
                style={{
                  color:
                    activePage === "activity"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              >
                Activity
              </MenuItem>
              {/* Button to go to funds page */}
              <MenuItem
                icon={
                  <FundsIcon
                    style={{
                      width: "20px",
                      height: "auto",
                      color:
                        activePage === "funds"
                          ? selectedColor
                          : nonSelectedColor,
                    }}
                  />
                }
                onClick={() => handleMenuClick("funds")}
                style={{
                  color:
                    activePage === "funds" ? selectedColor : nonSelectedColor,
                }}
              >
                Funds
              </MenuItem>
              {/* Button to go to contributor page */}
              <MenuItem
                icon={
                  <ContributorsIcon
                    style={{
                      width: "20px",
                      height: "auto",
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
                    activePage === "contributors"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              >
                Contributors
              </MenuItem>
            </Menu>
          </div>
          <div className="mb-[24px]">
            <Menu>
              <MenuItem
                component="a"
                href="/profilepage"
                icon={
                  <SettingsIcon
                    style={{
                      width: "20px",
                      height: "auto",
                      color:
                        activePage === "profilepage"
                          ? selectedColor
                          : nonSelectedColor,
                    }}
                  />
                }
                onClick={() => handleMenuClick("profilepage")}
                style={{
                  color:
                    activePage === "profilepage"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                component="a"
                href="/profilepage"
                icon={
                  <PortraitIcon
                    style={{
                      width: "20px",
                      height: "auto",
                      color:
                        activePage === "profilepage"
                          ? selectedColor
                          : nonSelectedColor,
                    }}
                  />
                }
                onClick={() => handleMenuClick("profilepage")}
                style={{
                  maxHeight: "75%",
                  color:
                    activePage === "profilepage"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              >
                Diego Marques
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
