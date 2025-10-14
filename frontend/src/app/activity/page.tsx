"use client";

import DashboardTemplate from "@/components/templates/DashboardTemplate";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import AddTransactionModal from "@/components/molecules/AddTransactionModalv2";
import React, { useState } from "react";
import SearchBar from "@/components/molecules/Searchbar";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@/components/atoms/Button";

const ActivitiesPage = () => {
  // State to store search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to trigger table refresh
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query); // Update search query state
  };

  const handleTransactionAdded = () => {
    // Trigger table refresh by updating key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <h1 className="mb-12 text-3xl">Activity</h1>
        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={handleSearch} width="50%" />
          </div>

          <AddTransactionModal onTransactionAdded={handleTransactionAdded}>
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
        <TransactionsTable
          tableType="transactions"
          searchQuery={searchQuery} // Pass search query to TransactionsTable
          key={refreshKey} // Force re-render when refreshKey changes
        />
      </div>
    </DashboardTemplate>
  );
};

export default ActivitiesPage;
