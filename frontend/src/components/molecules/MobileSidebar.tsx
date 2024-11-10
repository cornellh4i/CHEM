import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  CollectionsBookmark as LogoIcon,
  Home as DashboardIcon,
  AccountBalance as FundsIcon,
  People as ContributorsIcon,
  BarChart as ActivityIcon,
} from "@mui/icons-material";

interface MobileSidebarProps {
  collapsed: boolean;
  activePage: string;
  onMenuClick: (page: string) => void;
}

const MobileSidebar = ({
  collapsed,
  activePage,
  onMenuClick,
}: MobileSidebarProps) => (
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
