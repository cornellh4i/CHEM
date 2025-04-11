"use client";

import { useState } from "react";
import * as React from "react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributorsTable from "@/components/molecules/ContributorsTable";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from "@/components/atoms/Button";
import AddContributorModal from "@/components/molecules/AddContributorModal";
import SearchBar from "@/components/molecules/Searchbar";

const FundsMainPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
  };

  const [alignment, setAlignment] = React.useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl">Funds</h1>
          <div className="flex gap-x-4">
            <Button variant="secondary">
              <SettingsIcon fontSize="small" style={{ marginRight: 6 }} />
              Settings
            </Button>
            <Button variant="secondary">
              Create new fund
              <KeyboardArrowDownIcon />
            </Button>
          </div>
        </div>

        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={handleSearch} width="50%" />
          </div>

          <Button
            variant="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 8,
            }}
          >
            Add Contributor
            <AddIcon style={{ marginLeft: "6px" }} />
          </Button>

          <Button
            variant="secondary"
            icon={<LaunchIcon />}
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 8,
            }}
          >
            Export
          </Button>

          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="left" aria-label="left aligned">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <ContributorsTable searchQuery={searchQuery} />
      </div>
    </DashboardTemplate>
  );
};

export default FundsMainPage;
