import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Portrait as PortraitIcon,
} from "@mui/icons-material";
import { IconButton, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface SidebarProps {
  collapsed: boolean;
  handleToggleSidebar: () => void;
}

const SidebarComponent = ({ collapsed, handleToggleSidebar }: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activePage, setActivePage] = useState<string>("dashboard");
  const router = useRouter();
  const pathname = usePathname();

  // Synchronize activePage with the current route
  useEffect(() => {
    const page = pathname.split("/")[1] || "dashboard";
    setActivePage(page);
  }, [pathname]);

  const handleMenuClick = (route: string) => {
    const page = route.replace("/", "");
    setActivePage(page);
    router.push(route);
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
        backgroundColor: "#f0f0f0",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
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
      >
        <MenuIcon />
      </IconButton>

      {/* Main Menu */}
      <div style={{ flex: 1, width: "100%" }}>
        <Menu>
          <MenuItem
            icon={
              <DashboardIcon
                style={{
                  color:
                    activePage === "dashboard"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("/dashboard")}
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
                    activePage === "activity"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("/activity")}
            style={{
              color:
                activePage === "activity" ? selectedColor : nonSelectedColor,
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
                    activePage === "fundsMain"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("/fundsMain")}
            style={{
              color:
                activePage === "fundsMain" ? selectedColor : nonSelectedColor,
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
            onClick={() => handleMenuClick("/contributors")}
            style={{
              color:
                activePage === "contributors"
                  ? selectedColor
                  : nonSelectedColor,
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {!collapsed && "Contributors"}
          </MenuItem>
        </Menu>
      </div>

      {/* Bottom Menu */}
      <div style={{ width: "100%", marginTop: "auto", marginBottom: "24px" }}>
        <Menu>
          <MenuItem
            icon={
              <SettingsIcon
                style={{
                  color:
                    activePage === "profilepage"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("/profilepage")}
            style={{
              color:
                activePage === "profilepage" ? selectedColor : nonSelectedColor,
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {!collapsed && "Settings"}
          </MenuItem>

          <MenuItem
            icon={
              <PortraitIcon
                style={{
                  color:
                    activePage === "profilepage"
                      ? selectedColor
                      : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("/profilepage")}
            style={{
              color:
                activePage === "profilepage" ? selectedColor : nonSelectedColor,
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {!collapsed && "Diego Marques"}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default SidebarComponent;
