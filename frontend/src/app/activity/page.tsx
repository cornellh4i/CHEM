"use client";

import DashboardTemplate from "@/components/templates/DashboardTemplate";
import DummyTable from "@/components/molecules/DummyTable";
import AddTransactionModal from "@/components/molecules/AddTransactionModal";
import React, { useState } from "react";
import SearchBar from "@/components/molecules/Searchbar";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@/components/atoms/Button"; // Adjust path if needed

const ActivitiesPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <h1 className="mb-12 text-3xl">Activity</h1>
        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={handleSearch} width="50%" />
          </div>

          <AddTransactionModal>
            <Button
              variant="primary"
              style={{
                display: "flex",
                alignItems: "center",
                height: "40px",
                padding: "0 16px",
                marginBottom: 8,
              }}
            >
              Add Transaction
              <AddIcon style={{ marginLeft: "6px" }} />
            </Button>
          </AddTransactionModal>

          <Button
            variant="primary"
            icon={<DownloadIcon />}
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              marginBottom: 8,
            }}
          >
            Import
          </Button>
        </div>
        <DummyTable />
      </div>
    </DashboardTemplate>
  );
};

export default ActivitiesPage;
