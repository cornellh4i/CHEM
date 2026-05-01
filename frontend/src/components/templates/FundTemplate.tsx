"use client";
import { ReactNode, useState } from "react";
import Sidebar from "@/components/molecules/Sidebar";
import { IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface FundsTemplateProps {
  fundName: string;
  fundDescription: string;
  fundType?: string;
  summary: ReactNode;
  contributors: ReactNode;
  settings: ReactNode;
  activeTab: "summary" | "contributors" | "settings";
  onTabChange: (tab: "summary" | "contributors" | "settings") => void;
}

const FundTemplate = ({
  fundName,
  fundDescription,
  fundType,
  summary,
  contributors,
  settings,
  activeTab,
  onTabChange,
}: FundsTemplateProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  return (
    <div className="dark:bg-gray-900 dark:text-gray-300 flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        handleToggleSidebar={() => setCollapsed(!collapsed)}
        user={null}
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
          className="text-gray-500 mb-6 flex items-center gap-1 text-sm hover:text-gray-700"
          onClick={() => router.back()}
        >
          <ArrowBackIcon fontSize="small" />
          Back to All Funds
        </button>

        {/* Fund title */}
        <h1 className="mb-2 text-4xl font-bold">{fundName}</h1>

        {/* Fund description */}
        <p className="text-gray-600 mb-4 max-w-3xl text-sm leading-relaxed">
          {fundDescription}
        </p>

        {/* Badges */}
        {fundType && (
          <div className="mb-6 flex gap-2">
            <span className="border-gray-300 text-gray-600 rounded border px-3 py-1 text-xs">
              {fundType}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex space-x-8 border-b">
          {(["summary", "contributors", "settings"] as const).map((tab) => (
            <button
              key={tab}
              className={`pb-3 text-base capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "summary" && summary}
          {activeTab === "contributors" && contributors}
          {activeTab === "settings" && settings}
        </div>
      </div>

      {isMobile && (
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          style={{ position: "fixed", top: 16, left: 16, zIndex: 1000 }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </div>
  );
};

export default FundTemplate;
