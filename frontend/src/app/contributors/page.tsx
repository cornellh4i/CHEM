// frontend/src/app/contributors/page.tsx
"use client";

import { useState } from "react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributorsTable from "@/components/molecules/ContributorsTable";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import Button from "@/components/atoms/Button";
import AddContributorModal from "@/components/molecules/AddContributorModal";
import SearchBar from "@/components/molecules/Searchbar";

const ContributorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <h1 className="mb-12 text-3xl">Contributors</h1>

        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow max-w-xl">
            <SearchBar
              onSearch={setSearchQuery}
              width="100%"
              placeholder="Search contributors…"
              emitOnType
              debounceMs={250}
              // NOTE: No endpoint/onResults in Option B. Remove unless you really need server search.
            />
          </div>

          <AddContributorModal>
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
              Add Contributor
              <AddIcon style={{ marginLeft: 6 }} />
            </Button>
          </AddContributorModal>

          <Button
            variant="primary"
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
        </div>

        {/* ONE table, fed by the same searchQuery */}
        <ContributorsTable searchQuery={searchQuery} />
      </div>
    </DashboardTemplate>
  );
};

export default ContributorsPage;
