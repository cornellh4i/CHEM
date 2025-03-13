"use client";

import DashboardTemplate from "@/components/templates/DashboardTemplate";
import TransactionsTable from "@/components/molecules/TransactionsTable";
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
          <Button variant="primary" icon={<AddIcon />}>
            Add Transaction
          </Button>
          <Button variant="primary" icon={<DownloadIcon />}>
            Import
          </Button>
        </div>
        <TransactionsTable tableType="transactions" />
      </div>
    </DashboardTemplate>
  );
};

export default ActivitiesPage;
