import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  CollectionsBookmark as LogoIcon,
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
  Menu as MenuIcon,
  LineWeight,
} from "@mui/icons-material";
import { IconButton, useMediaQuery } from "@mui/material";
import { calculateOverrideValues } from "next/dist/server/font-utils";

interface SidebarProps {
  collapsed: boolean;
  handleToggleSidebar: () => void;
}

const SidebarComponent = ({ collapsed, handleToggleSidebar }: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [activePage, setActivePage] = useState<string>("dashboard");

  const handleMenuClick = (page: string) => {
    setActivePage(page);
  };

  const nonSelectedColor = "#838383";
  const selectedColor = "#000000";

  return (
    <div className="relative">
      <IconButton
        onClick={handleToggleSidebar}
        style={{
          position: "absolute",
          top: 16,
          left: !isMobile ? (collapsed ? 80 : 200) : collapsed ? 12 : 200,
          zIndex: 1000,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Defines when sidebar will collapse, ensures sidebar always collapses on mobile devices. */}
      <Sidebar
        collapsed={collapsed}
        breakPoint={isMobile ? "always" : "md"}
        style={{
          width: collapsed ? "80px" : isMobile ? "100vw" : "200px",
          height: "100vh",
          transition: "width 0.3s", // Smooth transition for width
          left: isMobile && collapsed ? "-200px" : "0", // Hide offscreen when collapsed on mobile
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
              paddingLeft: "28px",
            }}
          >
            <LogoIcon
              style={{ width: "20px", height: "auto", marginRight: "16px" }}
            />
            {!collapsed && "Odyssey Fund"}
          </div>
          <MenuItem
            icon={
              <DashboardIcon
                style={{
                  width: "20px",
                  height: "auto",
                  color:
                    activePage === "dashboard"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("dashboard")}
            style={{
              color:
                activePage === "dashboard" ? selectedColor : nonSelectedColor,
            }}
          >
            Dashboard
          </MenuItem>
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
                activePage === "activity" ? selectedColor : nonSelectedColor,
            }}
          >
            Activity
          </MenuItem>
          <MenuItem
            icon={
              <FundsIcon
                style={{
                  width: "20px",
                  height: "auto",
                  color:
                    activePage === "funds" ? selectedColor : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("funds")}
            style={{
              color: activePage === "funds" ? selectedColor : nonSelectedColor,
            }}
          >
            Funds
          </MenuItem>
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
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
