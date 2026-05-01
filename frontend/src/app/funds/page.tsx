"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import FundsListTable from "@/components/molecules/FundsListTable";
import FundsCardTable from "@/components/molecules/FundsCardTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/Searchbar";
import AddFundModal from "@/components/molecules/AddFundModal";

export type FundSortBy = "name-asc" | "name-desc" | "amount-asc" | "amount-desc" | "newest" | "oldest";
export type FundFilterType = "all" | "Endowment" | "Donation";
export type FundFilterRestriction = "all" | "Restricted" | "Unrestricted";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && buttonRef.current) {
      setRect(buttonRef.current.getBoundingClientRect());
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return { open, setOpen, toggle, rect, buttonRef };
}

const FundsPage = () => {
  const buttonColor = "#838383";
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [filterType, setFilterType] = useState<FundFilterType>("all");
  const [filterRestriction, setFilterRestriction] = useState<FundFilterRestriction>("all");
  const [sortBy, setSortBy] = useState<FundSortBy>("newest");

  const filterDropdown = useDropdown();
  const sortDropdown = useDropdown();

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "list" | "grid" | null
  ) => {
    if (newView !== null) setViewMode(newView);
  };

  const filterActive = filterType !== "all" || filterRestriction !== "all";

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Funds</h1>
          <div className="flex gap-x-4">
<AddFundModal>
              <Button
                variant="secondary"
                style={{ display: "flex", alignItems: "center", height: "40px", padding: "0 16px", marginBottom: 0, color: "#418EC8" }}
              >
                Create new fund
                <KeyboardArrowDownIcon />
              </Button>
            </AddFundModal>
          </div>
        </div>

        <div className="mb-12 flex items-center justify-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={setSearchQuery} width="100%" placeholder="Search for a fund..." />
          </div>

          {/* Filter button */}
          <div ref={filterDropdown.buttonRef}>
            <Button
              variant="secondary"
              onClick={filterDropdown.toggle}
              style={{
                display: "flex", alignItems: "center", height: "40px", padding: "0 16px", marginBottom: 0,
                color: filterActive ? "#3E6DA6" : buttonColor,
                fontWeight: filterActive ? 600 : undefined,
              }}
            >
              <FilterAltIcon style={{ marginRight: "6px" }} />
              Filter{filterActive ? " •" : ""}
            </Button>
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

          <ToggleButtonGroup
            size="small"
            color="primary"
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="View Mode"
          >
            <ToggleButton value="grid" aria-label="grid view"><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="list" aria-label="list view"><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>
        </div>

        {viewMode === "list" ? (
          <FundsListTable searchQuery={searchQuery} filterType={filterType} filterRestriction={filterRestriction} sortBy={sortBy} />
        ) : (
          <FundsCardTable searchQuery={searchQuery} filterType={filterType} filterRestriction={filterRestriction} sortBy={sortBy} />
        )}
      </div>

      {/* Filter portal */}
      {filterDropdown.open && filterDropdown.rect && createPortal(
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: filterDropdown.rect.bottom + 8,
            left: filterDropdown.rect.right - 200,
            zIndex: 9999,
            backgroundColor: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}
          className="min-w-[200px] rounded-lg p-4"
        >
          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Type</p>
            {(["all", "Endowment", "Donation"] as FundFilterType[]).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input type="radio" name="filterType" checked={filterType === v} onChange={() => setFilterType(v)} />
                {v === "all" ? "All types" : v}
              </label>
            ))}
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Restriction</p>
            {(["all", "Restricted", "Unrestricted"] as FundFilterRestriction[]).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input type="radio" name="filterRestriction" checked={filterRestriction === v} onChange={() => setFilterRestriction(v)} />
                {v === "all" ? "All restrictions" : v}
              </label>
            ))}
          </div>
          {filterActive && (
            <button
              className="mt-3 text-xs text-blue-500 underline"
              onClick={() => { setFilterType("all"); setFilterRestriction("all"); }}
            >
              Clear filters
            </button>
          )}
        </div>,
        document.body
      )}

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
          {(
            [
              ["newest", "Newest first"],
              ["oldest", "Oldest first"],
              ["name-asc", "Name A → Z"],
              ["name-desc", "Name Z → A"],
              ["amount-desc", "Amount: high to low"],
              ["amount-asc", "Amount: low to high"],
            ] as [FundSortBy, string][]
          ).map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
              <input
                type="radio"
                name="sortBy"
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

export default FundsPage;
