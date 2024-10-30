"use client";

import DashboardTemplate from "@/components/templates/DashboardTemplate";
import DummyTable from "@/components/molecules/DummyTable";
import React, { useState } from "react";
import SearchBar from "@/components/molecules/Searchbar";
import { Button } from "@/components";
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
          <Button variant="primary">Add Transaction</Button>
          <Button variant="primary">Import</Button>
        </div>
        <DummyTable />
      </div>
    </DashboardTemplate>
  );
};

export default ActivitiesPage;
