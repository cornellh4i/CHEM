import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"; // Import Sidebar and Menu components from react-pro-sidebar
import {
  CollectionsBookmark as LogoIcon,
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"; // Import Material-UI icons
import { IconButton, useMediaQuery } from "@mui/material"; // Import IconButton and useMediaQuery from Material-UI
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // Import usePathname for route detection

interface SidebarProps {
  collapsed: boolean; // Indicates if the sidebar is collapsed
  handleToggleSidebar: () => void; // Function to toggle the sidebar state
}

const SidebarComponent = ({ collapsed, handleToggleSidebar }: SidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)"); // Check if the screen size is mobile

  const [activePage, setActivePage] = useState<string>("dashboard"); // State to track the active page

  const router = useRouter();
  const pathname = usePathname();

  // Function to set the active page when a menu item is clicked
  const handleMenuClick = (page: string) => {
    setActivePage(page); // Update the active page state
    router.push(page); // Navigate to the selected page
  };

  // Synchronize activePage with the current route
  useEffect(() => {
    const page = pathname.split("/")[1] || "dashboard"; // Extract the active page from the path
    setActivePage(page);
  }, [pathname]);

  // Color definitions for selected and non-selected menu items
  const nonSelectedColor = "#838383";
  const selectedColor = "#000000";

  return (
    <div className="relative">
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
          width: collapsed ? "80px" : isMobile ? "100vw" : "200px", // 80px when collapsed, 200px on desktop, full width on mobile
          height: "100vh", // Full height
          transition: "width 0.3s", // Smooth width transition
          left: isMobile && collapsed ? "-200px" : "0", // Offscreen when collapsed on mobile
        }}
      >
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
            onClick={() => handleMenuClick("/dashboard")} // Click handler to set active page
            style={{
              color:
                activePage === "dashboard" ? selectedColor : nonSelectedColor,
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
            onClick={() => handleMenuClick("/activity")}
            style={{
              color:
                activePage === "activity" ? selectedColor : nonSelectedColor,
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
                    activePage === "funds" ? selectedColor : nonSelectedColor,
                }}
              />
            }
            onClick={() => handleMenuClick("/funds")}
            style={{
              color: activePage === "funds" ? selectedColor : nonSelectedColor,
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
            onClick={() => handleMenuClick("/contributors")}
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
