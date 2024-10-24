import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Home as Home, Segment as Segment, ShowChart as Funds, People as Contributors, Menu as MenuIcon } from "@mui/icons-material";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
function App() {
    const [collapsed, setCollapsed] = useState(false);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Sidebar collapsed={collapsed}>
            <Menu>
                <MenuItem icon={<Home />}>Home</MenuItem>
                <MenuItem icon={< Segment />}>Activity</MenuItem>
                <MenuItem icon={< Funds />}>Funds</MenuItem>
                <MenuItem icon={< Contributors />}>Contributors</MenuItem>
            </Menu>
            <button onClick={handleToggleSidebar}>Toggle Sidebar</button>
        </Sidebar>
    );
}

export default App;
