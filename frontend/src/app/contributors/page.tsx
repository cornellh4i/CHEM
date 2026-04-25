"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributorsTable from "@/components/molecules/ContributorsTable";
import AddContributorModal from "@/components/molecules/AddContributorModal";
import SearchBar from "@/components/molecules/Searchbar";
import FilterListIcon from "@mui/icons-material/FilterList";
import LaunchIcon from "@mui/icons-material/Launch";
import api from "@/utils/api";

export type ContributorSortBy = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "amount-desc" | "amount-asc";

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

// ── Email tab ──────────────────────────────────────────────────────────────

interface ContributorItem {
  id: string;
  firstName: string;
  lastName: string;
  funds: { id: string; name: string }[];
  transactions: { amount: number; type: string }[];
}

const TEMPLATES = [
  { title: "Contact a contributor", tag: "Donor Relations", tagColor: "bg-yellow-100 text-yellow-700" },
  { title: "Invite new contributors", tag: "Donor Relations", tagColor: "bg-yellow-100 text-yellow-700" },
  { title: "Send a report", tag: "Report", tagColor: "bg-blue-100 text-blue-700" },
  { title: "Thank a contributor", tag: "Donor Relations", tagColor: "bg-yellow-100 text-yellow-700" },
];

function EmailTab() {
  const [contributors, setContributors] = useState<ContributorItem[]>([]);
  const [toQuery, setToQuery] = useState("");
  const [toOpen, setToOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<ContributorItem | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/contributors").then((res) => {
      setContributors(res.data.contributors ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toOpen) return;
    const handler = (e: MouseEvent) => {
      if (toRef.current && !toRef.current.contains(e.target as Node)) setToOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [toOpen]);

  const topContributors = [...contributors]
    .map((c) => ({
      ...c,
      total: c.transactions
        .filter((t) => t.type === "DONATION" || t.type === "INVESTMENT")
        .reduce((s, t) => s + t.amount, 0),
      fund: c.funds?.[0]?.name ?? "—",
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const filteredContributors = contributors.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(toQuery.toLowerCase())
  );

  const fmtAmt = (n: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-8">
      {/* Templates */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Templates</h2>
          <button className="flex items-center gap-1 text-sm text-blue-300 hover:underline">
            See more →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.title}
              className="flex h-36 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-sm font-semibold leading-snug">{t.title}</p>
              <span className={`w-fit rounded px-2 py-0.5 text-xs font-medium ${t.tagColor}`}>{t.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Send an Email */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Send an Email</h2>
        <div className="flex gap-4 items-start">

          {/* Left: top contributors */}
          <div className="w-72 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="text-sm font-medium text-gray-800">Last Month's Top Contributors</span>
              <FilterListIcon fontSize="small" style={{ color: "#3E6DA6" }} />
            </div>
            {/* Rows */}
            <div className="divide-y divide-gray-50 px-4">
              {topContributors.length === 0 ? (
                <p className="py-4 text-xs text-gray-400">No contributors yet</p>
              ) : (
                topContributors.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.firstName} {c.lastName}</p>
                      <p className="text-xs text-gray-400">{c.fund}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+{fmtAmt(c.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: compose */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Compose header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="font-semibold text-gray-900">New Email</h3>
              <button className="text-lg text-gray-400 hover:text-gray-600">↗</button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* To */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">To</label>
                <div className="relative" ref={toRef}>
                  <div
                    className="flex cursor-text items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                    onClick={() => setToOpen(true)}
                  >
                    {selectedContributor ? (
                      <span className="text-sm text-gray-800">{selectedContributor.firstName} {selectedContributor.lastName}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Type a contributor"
                        value={toQuery}
                        onChange={(e) => { setToQuery(e.target.value); setToOpen(true); }}
                        className="w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
                      />
                    )}
                    <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {toOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                      {filteredContributors.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-gray-400">No contributors found</p>
                      ) : (
                        filteredContributors.slice(0, 8).map((c) => (
                          <button
                            key={c.id}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => { setSelectedContributor(c); setToQuery(""); setToOpen(false); }}
                          >
                            {c.firstName} {c.lastName}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {selectedContributor && (
                  <button className="mt-1 text-xs text-gray-400 underline" onClick={() => setSelectedContributor(null)}>
                    Clear
                  </button>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">Subject</label>
                <input
                  type="text"
                  placeholder="Type a subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>

              {/* Message */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-800">Message</label>
                  <div className="flex items-center gap-3 text-gray-400">
                    <button title="Attach" className="hover:text-gray-600 text-base">↑</button>
                    <button title="Link" className="hover:text-gray-600 text-base">🔗</button>
                    <button title="Image" className="hover:text-gray-600 text-base">🖼</button>
                    <button title="Bold" className="hover:text-gray-600 text-sm font-bold">B</button>
                    <button title="Italic" className="hover:text-gray-600 text-sm italic">I</button>
                    <button title="Bullet list" className="hover:text-gray-600 text-base">☰</button>
                    <button title="Numbered list" className="hover:text-gray-600 text-base">≣</button>
                  </div>
                </div>
                <textarea
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => { setSelectedContributor(null); setSubject(""); setMessage(""); }}
              >
                Cancel
              </button>
              <button className="rounded-lg bg-gray-700 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Send Email
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

const ContributorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [activeTab, setActiveTab] = useState<"table" | "email">("table");
  const [sortBy, setSortBy] = useState<ContributorSortBy>("date-desc");

  const sortDropdown = useDropdown();

  return (
    <DashboardTemplate>
      <div className="flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Contributors</h1>
          {activeTab === "email" && (
            <div className="w-56">
              <SearchBar onSearch={() => {}} width="100%" placeholder="Search" />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-6 border-b">
          {(["table", "email"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-base capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-black font-semibold text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "table" && (
          <>
            <div className="mb-6 flex items-center gap-x-3">
              <div className="w-[340px]">
                <SearchBar onSearch={setSearchQuery} width="100%" />
              </div>
              <div className="flex-1" />
              <AddContributorModal onAdded={() => setRefreshToken((v) => v + 1)}>
                <button
                  className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium"
                  style={{ backgroundColor: "#3E6DA6", color: "white" }}
                >
                  Add Contributor +
                </button>
              </AddContributorModal>
              <div ref={sortDropdown.buttonRef}>
                <button
                  onClick={sortDropdown.toggle}
                  className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <FilterListIcon fontSize="small" />
                  Filters
                </button>
              </div>
              <button className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Export <LaunchIcon fontSize="small" />
              </button>
            </div>
            <ContributorsTable searchQuery={searchQuery} refreshToken={refreshToken} sortBy={sortBy} />
          </>
        )}

        {activeTab === "email" && <EmailTab />}
      </div>

      {/* Sort portal */}
      {sortDropdown.open && sortDropdown.rect && createPortal(
        <div
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
