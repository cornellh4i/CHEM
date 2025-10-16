// frontend/src/app/fundsMain/page.tsx
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
  const buttonColor = "#838383";
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "list" | "grid" | null
  ) => {
    if (newView !== null) setViewMode(newView);
  };

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl">All Funds</h1>
          <div className="flex gap-x-4">
            <Button
              variant="borderless"
              style={{
                display: "flex",
                alignItems: "center",
                height: "40px",
                padding: "0 16px",
                marginBottom: 0,
                color: buttonColor,
              }}
            >
              <SettingsIcon fontSize="small" style={{ marginRight: 6 }} />
              Settings
            </Button>
            <Button
              variant="secondary"
              style={{
                display: "flex",
                alignItems: "center",
                height: "40px",
                padding: "0 16px",
                marginBottom: 0,
                color: "#418EC8",
              }}
            >
              Create new fund
              <KeyboardArrowDownIcon />
            </Button>
          </div>
        </div>

        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow max-w-xl">
            <SearchBar
              onSearch={setSearchQuery}          // Option B: local state drives table filter
              width="100%"
              placeholder="Search for a fund..."
              emitOnType
              debounceMs={250}
            />
          </div>

          <Button
            variant="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 0,
              color: buttonColor,
            }}
          >
            <FilterAltIcon style={{ marginRight: "6px" }} />
            Filter tags
          </Button>

          <Button
            variant="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 0,
              color: buttonColor,
            }}
          >
            <SwapVertIcon />
            Sort
            <KeyboardArrowDownIcon />
          </Button>

          <ToggleButtonGroup
            size="small"
            color="primary"
            value={viewMode}
            exclusive
            onChange={handleChange}
            aria-label="View Mode"
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
          // ContributorsTable already supports filtering by contributor + fund
          <ContributorsTable searchQuery={searchQuery} />
        ) : (
          <ContributionsGraph />
        )}
      </div>
    </DashboardTemplate>
  );
};

export default FundsMainPage;
