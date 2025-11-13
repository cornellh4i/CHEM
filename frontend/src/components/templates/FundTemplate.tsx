"use client";
import React, { ReactNode, useState } from "react";
import Sidebar from "@/components/molecules/Sidebar";
import { IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface FundsTemplateProps {
  fundName: string;
  fundDescription: string;
  summary: ReactNode;
  transactions: ReactNode;
  contributors: ReactNode;
  activeTab: "summary" | "transactions" | "contributors";
  onTabChange: (tab: "summary" | "transactions" | "contributors") => void;
}

const FundTemplate = ({
  fundName,
  fundDescription,
  summary,
  transactions,
  contributors,
  activeTab,
  onTabChange,
}: FundsTemplateProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="dark:bg-gray-900 dark:text-gray-300 flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
        user={null} // no user context here; sidebar will show "Profile"
      />

      <div
        className="flex-1 transition-all duration-300"
        style={{
          textAlign: "left",
          maxWidth: "100%",
          padding: "2rem",
          marginLeft: collapsed ? "128px" : "268px",
        }}
      >
        {/* Back button */}
        <button
          className="text-blue-600 mb-4 text-sm"
          onClick={() => router.back()}
        >
          <ArrowBackIcon
            className="relative top-[-1px] mr-1"
            fontSize="small"
          />
          Back to All Funds
        </button>

        {/* Fund title and description */}
        <h1 className="mb-1 text-3xl font-semibold">{fundName}</h1>
        <p className="text-gray-600 mb-6 max-w-3xl">{fundDescription}
        </p>

        {/* Tabs */}
        <div className="mb-6 flex space-x-6 border-b">
          {["summary", "transactions", "contributors"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 capitalize ${
              activeTab === tab
                  ? "border-blue-600 border-b-2 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() =>
                onTabChange(tab as "summary" | "transactions" | "contributors")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "summary" && summary}
          {activeTab === "transactions" && transactions}
          {activeTab === "contributors" && contributors}
        </div>
      </div>

      {isMobile && (
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
      )}
    </div>
  );
};

export default FundTemplate;
