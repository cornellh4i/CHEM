"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributorsTable from "@/components/molecules/ContributorsTable";
import AddContributorModal from "@/components/molecules/AddContributorModal";
import SearchBar from "@/components/molecules/Searchbar";
import Button from "@/components/atoms/Button";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LaunchIcon from "@mui/icons-material/Launch";

export type ContributorSortBy = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "amount-desc" | "amount-asc";

const buttonColor = "#838383";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && buttonRef.current) setRect(buttonRef.current.getBoundingClientRect());
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return { open, setOpen, toggle, rect, buttonRef };
}

const ContributorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [sortBy, setSortBy] = useState<ContributorSortBy>("date-desc");

  const sortDropdown = useDropdown();

  return (
    <DashboardTemplate>
      <div className="flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Contributors</h1>
        </div>

        <div className="mb-6 flex items-center gap-x-3">
          <div className="flex-grow">
            <SearchBar onSearch={setSearchQuery} width="100%" />
          </div>

          {/* Sort button */}
          <div ref={sortDropdown.buttonRef}>
            <Button
              variant="secondary"
              onClick={sortDropdown.toggle}
              style={{ display: "flex", alignItems: "center", height: "40px", padding: "0 16px", marginBottom: 0, color: buttonColor }}
            >
              <SwapVertIcon />
              Sort
              <KeyboardArrowDownIcon />
            </Button>
          </div>

          <AddContributorModal onAdded={() => setRefreshToken((v) => v + 1)}>
            <button
              className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: "#3E6DA6", color: "white" }}
            >
              Add Contributor +
            </button>
          </AddContributorModal>

          <button className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Export <LaunchIcon fontSize="small" />
          </button>
        </div>

        <ContributorsTable searchQuery={searchQuery} refreshToken={refreshToken} sortBy={sortBy} />
      </div>

      {/* Sort portal */}
      {sortDropdown.open && sortDropdown.rect && createPortal(
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: sortDropdown.rect.bottom + 8,
            left: sortDropdown.rect.right - 180,
            zIndex: 9999,
            backgroundColor: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}
          className="min-w-[180px] rounded-lg p-4"
        >
          <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Sort by</p>
          {(
            [
              ["date-desc", "Date: newest first"],
              ["date-asc", "Date: oldest first"],
              ["name-asc", "Name A → Z"],
              ["name-desc", "Name Z → A"],
              ["amount-desc", "Amount: high to low"],
              ["amount-asc", "Amount: low to high"],
            ] as [ContributorSortBy, string][]
          ).map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
              <input
                type="radio"
                name="contributorSort"
                checked={sortBy === value}
                onChange={() => { setSortBy(value); sortDropdown.setOpen(false); }}
              />
              {label}
            </label>
          ))}
        </div>,
        document.body
      )}
    </DashboardTemplate>
  );
};

export default ContributorsPage;
