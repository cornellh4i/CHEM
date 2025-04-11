"use client";

import { useState } from "react";
import * as React from "react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributorsTable from "@/components/molecules/ContributorsTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/Searchbar";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";

const FundsMainPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
  };

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "list" | "grid" | null
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl">All Funds</h1>
          <div className="flex gap-x-4">
            <Button variant="borderless">
              <SettingsIcon fontSize="small" style={{ marginRight: 6 }} />
              Settings
            </Button>
            <Button variant="tertiary">
              Create new fund
              <KeyboardArrowDownIcon />
            </Button>
          </div>
        </div>

        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={handleSearch} width="100%" />
          </div>

          <Button
            variant="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 0,
            }}
          >
            <FilterAltIcon style={{ marginRight: "6px" }} />
            Filter Tags
          </Button>

          <Button
            variant="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 0,
            }}
          >
            <SwapVertIcon />
            Sort
            <KeyboardArrowDownIcon />
          </Button>

          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {viewMode === "list" ? (
          <ContributorsTable searchQuery={searchQuery} />
        ) : (
          <ContributionsGraph />
        )}
      </div>
    </DashboardTemplate>
  );
};

export default FundsMainPage;
