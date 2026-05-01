"use client";

export const dynamic = "force-dynamic";

import { Suspense, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import TransactionsTable, { TransactionFilterType, TransactionSortBy } from "@/components/molecules/TransactionsTable";
import SearchBar from "@/components/molecules/Searchbar";
import Button from "@/components/atoms/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Plus, ArrowUpRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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

function ActivitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterType, setFilterType] = useState<TransactionFilterType>("all");
  const [sortBy, setSortBy] = useState<TransactionSortBy>("date-desc");

  const filterDropdown = useDropdown();
  const sortDropdown = useDropdown();

  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [searchParams]);

  const [addOpen, setAddOpen] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(e.target as Node)) setAddOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filterActive = filterType !== "all";

  return (
    <DashboardTemplate>
      <div className="flex flex-col justify-items-center">
        <h1 className="mb-12 text-3xl font-bold">Activity</h1>
        <div className="mb-6 flex items-center gap-x-4">
          <div className="flex-grow">
            <SearchBar onSearch={setSearchQuery} width="100%" />
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

          {/* Add Transaction dropdown */}
          <div className="relative" ref={addRef}>
            <button
              onClick={() => setAddOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3E6DA6] px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: "#3E6DA6", color: "white" }}
            >
              <Plus size={16} />
              Add Transaction
            </button>
            {addOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50" onClick={() => { setAddOpen(false); router.push("/activity/add-multiple"); }}>Add Manually</button>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50" onClick={() => { setAddOpen(false); router.push("/activity/add-csv"); }}>Import by CSV</button>
              </div>
            )}
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-[#3E6DA6] bg-white px-4 py-2 text-sm font-medium text-[#3E6DA6] hover:bg-[#3E6DA6]/5"
          >
            <ArrowUpRight size={16} />
            Export
          </button>
        </div>

        <TransactionsTable
          tableType="transactions"
          searchQuery={searchQuery}
          filterType={filterType}
          sortBy={sortBy}
          key={refreshKey}
        />
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
          <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Type</p>
          {(["all", "DONATION", "INVESTMENT", "WITHDRAWAL", "EXPENSE"] as TransactionFilterType[]).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
              <input type="radio" name="activityFilterType" checked={filterType === v} onChange={() => setFilterType(v)} />
              {v === "all" ? "All types" : v.charAt(0) + v.slice(1).toLowerCase()}
            </label>
          ))}
          {filterActive && (
            <button className="mt-3 text-xs text-blue-500 underline" onClick={() => setFilterType("all")}>
              Clear filter
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
          <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Sort by</p>
          {([
            ["date-desc", "Date: newest first"],
            ["date-asc", "Date: oldest first"],
            ["amount-desc", "Amount: high to low"],
            ["amount-asc", "Amount: low to high"],
            ["contributor-asc", "Contributor A → Z"],
            ["contributor-desc", "Contributor Z → A"],
          ] as [TransactionSortBy, string][]).map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
              <input type="radio" name="activitySort" checked={sortBy === value} onChange={() => { setSortBy(value); sortDropdown.setOpen(false); }} />
              {label}
            </label>
          ))}
        </div>,
        document.body
      )}
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
