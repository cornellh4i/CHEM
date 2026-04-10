"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import SearchBar from "@/components/molecules/Searchbar";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@/components/atoms/Button";
import { useRouter, useSearchParams } from "next/navigation";

function ActivitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [searchParams]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <h1 className="mb-12 text-3xl">Activity</h1>
        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={setSearchQuery} width="50%" />
          </div>

          {/* Add Transaction dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="primary"
              style={{ display: "flex", alignItems: "center", height: "40px", padding: "0 16px", marginBottom: 8 }}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <AddIcon style={{ marginRight: "6px" }} />
              Add Transaction
            </Button>

            {dropdownOpen && (
              <div className="bg-white absolute right-0 top-full mt-1 z-50 min-w-[160px] overflow-hidden rounded-lg border border-gray-200 shadow-lg">
                <button
                  className="hover:bg-gray-50 w-full px-4 py-3 text-left text-sm"
                  onClick={() => { setDropdownOpen(false); router.push("/activity/add-multiple"); }}
                >
                  Add Manually
                </button>
                <button
                  className="hover:bg-gray-50 w-full px-4 py-3 text-left text-sm"
                  onClick={() => { setDropdownOpen(false); router.push("/activity/add-csv"); }}
                >
                  Import by CSV
                </button>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            icon={<DownloadIcon />}
            style={{ display: "flex", alignItems: "center", height: "40px", padding: "0 16px", marginBottom: 8 }}
          >
            Export
          </Button>
        </div>
        <TransactionsTable
          tableType="transactions"
          searchQuery={searchQuery}
          key={refreshKey}
        />
      </div>
    </DashboardTemplate>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense>
      <ActivitiesContent />
    </Suspense>
  );
}
