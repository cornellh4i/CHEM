"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "@/components/molecules/Sidebar";
import auth from "@/utils/firebase-client";
import { onAuthStateChanged } from "firebase/auth";
import { IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface DefaultTemplateProps {
  children: ReactNode;
}
const apiBase =
process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type CurrentUser = {
  firstName: string;
  lastName: string;
  organization?: {
    name: string;
  };
};

const DashboardTemplate = ({ children }: DefaultTemplateProps) => {
  // State to control sidebar collapse
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  // Check if screen size is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Toggle sidebar collapse
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setCurrentUser(null);
          return;
        }
        const token = await user.getIdToken();
        const res = await fetch(`${apiBase}/auth/login`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Failed to fetch user in template", res.status);
          return;
        }
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Error loading user in template", err);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      <Sidebar
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
        user={currentUser}
      />

      {/* Main content area with dynamic margin based on sidebar state */}
      <div
        className={"flex-1 transition-all duration-300"}
        style={{
          textAlign: "left",
          maxWidth: "100%",
          padding: "2rem",
          marginLeft: collapsed ? "128px" : "268px",
        }}
      >
        {children}
      </div>

      {
        <IconButton
          onClick={handleToggleSidebar}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          <MenuIcon />
        </IconButton>
      }
    </div>
  );
};

export default DashboardTemplate;
