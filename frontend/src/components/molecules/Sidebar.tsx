import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Home as Home, Segment as Segment, ShowChart as Funds, People as Contributors, Menu as MenuIcon } from "@mui/icons-material";
import { IconButton, useMediaQuery } from "@mui/material";

interface SidebarProps {
    collapsed: boolean;
    handleToggleSidebar: () => void;
}

const SidebarComponent = ({ collapsed, handleToggleSidebar }: SidebarProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="relative">
            <IconButton
                onClick={handleToggleSidebar}
                style={{ position: 'absolute', top: 16, left: collapsed ? 16 : 240 }}
            >
                <MenuIcon />
            </IconButton>

            {/* Defines when sidebar will collapse, ensures sidebar always collapses on mobile devices. */}
            <Sidebar collapsed={collapsed} breakPoint={isMobile ? "always" : "md"}>
                <Menu>
                    <MenuItem icon={<Home />}>Home</MenuItem>
                    <MenuItem icon={<Segment />}>Activity</MenuItem>
                    <MenuItem icon={<Funds />}>Funds</MenuItem>
                    <MenuItem icon={<Contributors />}>Contributors</MenuItem>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default SidebarComponent;
