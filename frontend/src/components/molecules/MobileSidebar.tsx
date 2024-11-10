import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  CollectionsBookmark as LogoIcon,
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material"; 

interface MobileSidebarProps {
  collapsed: boolean;
  handleToggleSidebar: () => void; // Function to toggle the sidebar state
}

const MobileSidebar = ({ collapsed, handleToggleSidebar }: MobileSidebarProps) => (
  const [activePage, setActivePage] = useState<string>("dashboard");
  <Sidebar
    collapsed={collapsed}
    style={{
      width: collapsed ? "0" : "100vw",
      height: "100vh",
      position: "fixed",
      left: collapsed ? "-100vw" : "0",
      top: 0,
      transition: "left 0.3s ease",
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
        icon={<DashboardIcon />}
        onClick={() => onMenuClick("dashboard")}
      >
        Dashboard
      </MenuItem>
      <MenuItem icon={<ActivityIcon />} onClick={() => onMenuClick("activity")}>
        Activity
      </MenuItem>
      <MenuItem icon={<FundsIcon />} onClick={() => onMenuClick("funds")}>
        Funds
      </MenuItem>
      <MenuItem
        icon={<ContributorsIcon />}
        onClick={() => onMenuClick("contributors")}
      >
        Contributors
      </MenuItem>
    </Menu>
  </Sidebar>
);

export default MobileSidebar;
