
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
  const [activePage, setActivePage] = useState<string>("dashboard");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallMobile = useMediaQuery("(max-width: 500px)");

  // Function to handle menu item clicks and update active page
  const onMenuClick = (page: string) => {
    setActivePage(page);
    handleToggleSidebar(); // Optionally close the sidebar on mobile after selection
  };

  return (
    <Sidebar
      collapsed={collapsed || isSmallMobile}
      style={{
        width: collapsed || isSmallMobile ? "80px" : "250px", // Width adjustment for collapsed state and small mobile
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.3s ease",
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
          <LogoIcon style={{ width: "24px", height: "24px", marginRight: collapsed || isSmallMobile ? "0" : "16px" }} />
          {!collapsed && !isSmallMobile && "Odyssey Fund"}
        </div>
        <MenuItem icon={<DashboardIcon />} onClick={() => onMenuClick("dashboard")}>
          {!collapsed && !isSmallMobile && "Dashboard"}
        </MenuItem>
        <MenuItem icon={<ActivityIcon />} onClick={() => onMenuClick("activity")}>
          {!collapsed && !isSmallMobile && "Activity"}
        </MenuItem>
        <MenuItem icon={<FundsIcon />} onClick={() => onMenuClick("funds")}>
          {!collapsed && !isSmallMobile && "Funds"}
        </MenuItem>
        <MenuItem icon={<ContributorsIcon />} onClick={() => onMenuClick("contributors")}>
          {!collapsed && !isSmallMobile && "Contributors"}
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default MobileSidebar;

