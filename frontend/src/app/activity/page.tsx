// frontend/src/app/activity/page.tsx
"use client";

import React, { useState } from "react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import AddTransactionModal from "@/components/molecules/AddTransactionModalv2";
import SearchBar from "@/components/molecules/Searchbar";
import Button from "@/components/atoms/Button";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";

const ActivitiesPage = () => {
  // Option B: keep query locally; table filters by this prop.
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <h1 className="mb-12 text-3xl">Activity</h1>

        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow max-w-xl">
            <SearchBar
              onSearch={setSearchQuery}
              width="100%"
              placeholder="Search transactions or notes…"
              emitOnType
              debounceMs={250}
            />
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
              <AddIcon style={{ marginLeft: 6 }} />
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

        <TransactionsTable tableType="transactions" searchQuery={searchQuery} />
      </div>
    </DashboardTemplate>
  );
};

export default ActivitiesPage;
