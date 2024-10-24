import React, { useState, ReactNode } from "react";
import DefaultTemplate from "@/components/templates/DefaultTemplate";


interface DashboardTemplateProps {
    children: ReactNode;
}
const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

}



