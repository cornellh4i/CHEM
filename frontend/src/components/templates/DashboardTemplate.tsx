import React, { useState, ReactNode } from "react";
import DefaultTemplate from "@/components/templates/DefaultTemplate";

import { Home as Dashboard, Segment as Activity, ShowChart as Funds, People as Contributors } from "@mui/icons-material";
import { Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

interface DashboardTemplateProps {
    children: ReactNode;
}
const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

}



