"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

interface EmailTemplate {
  title: string;
  tag: string;
  tagStyle: React.CSSProperties;
  subject: string;
  body: string;
}

const TEMPLATES: EmailTemplate[] = [
  {
    title: "Contact a contributor",
    tag: "Donor Relations",
    tagStyle: { backgroundColor: "#fdf3dc", color: "#a07830", border: "1px solid #e8d5a0" },
    subject: "",
    body: "",
  },
  {
    title: "Invite new contributors",
    tag: "Donor Relations",
    tagStyle: { backgroundColor: "#fdf3dc", color: "#a07830", border: "1px solid #e8d5a0" },
    subject: "",
    body: "",
  },
  {
    title: "Send a report",
    tag: "Report",
    tagStyle: { backgroundColor: "#e8f0fe", color: "#4a6fa5", border: "1px solid #c5d5f5" },
    subject: "",
    body: "",
  },
  {
    title: "Thank a contributor",
    tag: "Donor Relations",
    tagStyle: { backgroundColor: "#fdf3dc", color: "#a07830", border: "1px solid #e8d5a0" },
    subject: "",
    body: "",
  },
];

function EmailTab() {
  const [contributors, setContributors] = useState<ContributorItem[]>([]);
  const [toQuery, setToQuery] = useState("");
  const [toOpen, setToOpen] = useState(false);
  const [selectedContributors, setSelectedContributors] = useState<ContributorItem[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
  const [tmplSelectedContributors, setTmplSelectedContributors] = useState<ContributorItem[]>([]);
  const [tmplToQuery, setTmplToQuery] = useState("");
  const [tmplToOpen, setTmplToOpen] = useState(false);
  const [tmplToRect, setTmplToRect] = useState<DOMRect | null>(null);
  const tmplWrapRef = useRef<HTMLDivElement>(null);
  const tmplDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tmplToOpen) return;
    const handler = (e: MouseEvent) => {
      const inWrap = tmplWrapRef.current?.contains(e.target as Node);
      const inDrop = tmplDropRef.current?.contains(e.target as Node);
      if (!inWrap && !inDrop) setTmplToOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tmplToOpen]);

  const tmplFilteredContributors = contributors.filter((c) =>
    !tmplSelectedContributors.some((s) => s.id === c.id) &&
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(tmplToQuery.toLowerCase())
  );
  const toRef = useRef<HTMLDivElement>(null);
  const toPortalRef = useRef<HTMLDivElement>(null);
  const [toRect, setToRect] = React.useState<DOMRect | null>(null);
  const [listFilter, setListFilter] = React.useState<"last-month" | "last-year" | "all-time">("last-month");
  const [listFilterOpen, setListFilterOpen] = React.useState(false);
  const [listFilterRect, setListFilterRect] = React.useState<DOMRect | null>(null);
  const listFilterRef = useRef<HTMLButtonElement>(null);
  const listFilterPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listFilterOpen) return;
    const handler = (e: MouseEvent) => {
      const inButton = listFilterRef.current?.contains(e.target as Node);
      const inPortal = listFilterPortalRef.current?.contains(e.target as Node);
      if (!inButton && !inPortal) setListFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [listFilterOpen]);

  useEffect(() => {
    api.get("/contributors").then((res) => {
      setContributors(res.data.contributors ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toOpen) return;
    const handler = (e: MouseEvent) => {
      const inInput = toRef.current?.contains(e.target as Node);
      const inPortal = toPortalRef.current?.contains(e.target as Node);
      if (!inInput && !inPortal) setToOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [toOpen]);

  const filterCutoff = React.useMemo(() => {
    const d = new Date();
    if (listFilter === "last-month") { d.setMonth(d.getMonth() - 1); return d; }
    if (listFilter === "last-year") { d.setFullYear(d.getFullYear() - 1); return d; }
    return null;
  }, [listFilter]);

  const topContributors = [...contributors]
    .map((c) => ({
      ...c,
      total: c.transactions
        .filter((t) =>
          (t.type === "DONATION" || t.type === "INVESTMENT") &&
          (filterCutoff ? new Date((t as any).date ?? 0) >= filterCutoff : true)
        )
        .reduce((s, t) => s + t.amount, 0),
      fund: c.funds?.[0]?.name ?? "—",
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const listFilterLabel = listFilter === "last-month" ? "Last Month's" : listFilter === "last-year" ? "Last Year's" : "All Time";

  const filteredContributors = contributors.filter((c) =>
    !selectedContributors.some((s) => s.id === c.id) &&
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(toQuery.toLowerCase())
  );

  const fmtAmt = (n: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-8">
      {/* Templates */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Templates</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.title}
              onClick={() => setActiveTemplate(t)}
              className="flex h-36 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-sm font-semibold leading-snug text-gray-900">{t.title}</p>
              <span className="w-fit rounded px-2 py-0.5 text-xs font-medium" style={t.tagStyle}>{t.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Template modal */}
      <Dialog open={activeTemplate !== null} onOpenChange={(o) => { if (!o) { setActiveTemplate(null); setTmplSelectedContributors([]); setTmplToQuery(""); setTmplToOpen(false); } }}>
        <DialogContent
          className="max-w-3xl p-0 gap-0 overflow-visible"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            if (tmplDropRef.current?.contains(target)) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement;
            if (tmplDropRef.current?.contains(target)) e.preventDefault();
          }}
        >
          <DialogTitle className="sr-only">{activeTemplate?.title ?? "Email template"}</DialogTitle>

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
            <span className="text-lg font-bold text-gray-900">New Email</span>
            {activeTemplate && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {activeTemplate.title}
              </span>
            )}
          </div>

          {/* Fields */}
          <div className="divide-y divide-gray-100 px-6">
            {/* Contributors row */}
            <div className="flex items-start gap-3 py-4">
              <span className="w-24 shrink-0 pt-0.5 text-sm text-gray-500">Contributors</span>
              <div
                ref={tmplWrapRef}
                className="flex flex-1 flex-wrap gap-1.5 cursor-text"
                onClick={() => {
                  if (tmplWrapRef.current) setTmplToRect(tmplWrapRef.current.getBoundingClientRect());
                  setTmplToOpen(true);
                }}
              >
                {tmplSelectedContributors.map((c) => (
                  <span key={c.id} className="flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {c.firstName} {c.lastName}
                    <button
                      className="ml-0.5 text-gray-400 hover:text-gray-600"
                      onMouseDown={(e) => { e.stopPropagation(); setTmplSelectedContributors((prev) => prev.filter((s) => s.id !== c.id)); }}
                    >×</button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={tmplSelectedContributors.length === 0 ? "Add contributors…" : "Add more…"}
                  value={tmplToQuery}
                  onFocus={() => {
                    if (tmplWrapRef.current) setTmplToRect(tmplWrapRef.current.getBoundingClientRect());
                    setTmplToOpen(true);
                  }}
                  onChange={(e) => {
                    setTmplToQuery(e.target.value);
                    if (tmplWrapRef.current) setTmplToRect(tmplWrapRef.current.getBoundingClientRect());
                    setTmplToOpen(true);
                  }}
                  className="min-w-[140px] flex-1 text-sm outline-none placeholder:text-gray-400 bg-transparent"
                />
              </div>
            </div>
            {tmplToOpen && tmplToRect && createPortal(
              <div
                ref={tmplDropRef}
                style={{
                  position: "fixed",
                  top: tmplToRect.bottom + 4,
                  left: tmplToRect.left,
                  width: Math.max(tmplToRect.width, 220),
                  zIndex: 9999,
                  backgroundColor: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                  borderRadius: 8,
                  pointerEvents: "auto",
                }}
              >
                {tmplFilteredContributors.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-400">No contributors found</p>
                ) : (
                  tmplFilteredContributors.slice(0, 8).map((c) => (
                    <button
                      key={c.id}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setTmplSelectedContributors((prev) => [...prev, c]);
                        setTmplToQuery("");
                      }}
                    >
                      {c.firstName} {c.lastName}
                    </button>
                  ))
                )}
              </div>,
              document.body
            )}

            {/* Subject row */}
            <div className="flex items-center gap-3 py-4">
              <span className="w-24 shrink-0 text-sm text-gray-500">Subject</span>
              <input
                type="text"
                placeholder="Subject"
                defaultValue={activeTemplate?.subject ?? ""}
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Message */}
          <div className="px-6 pt-4 pb-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Message</span>
              <div className="flex items-center gap-3 text-gray-400">
                <button title="Attach" className="hover:text-gray-600">↑</button>
                <button title="Link" className="hover:text-gray-600">🔗</button>
                <button title="Image" className="hover:text-gray-600">🖼</button>
                <button title="Bold" className="hover:text-gray-600 font-bold text-sm">B</button>
                <button title="Italic" className="hover:text-gray-600 text-sm italic">I</button>
                <button title="Bullet list" className="hover:text-gray-600">☰</button>
                <button title="Numbered list" className="hover:text-gray-600">≣</button>
              </div>
            </div>
            <textarea
              placeholder="Type a message"
              defaultValue={activeTemplate?.body ?? ""}
              rows={10}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-300"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => { setActiveTemplate(null); setTmplSelectedContributors([]); setTmplToQuery(""); setTmplToOpen(false); }}
              className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="rounded-xl px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              style={{ backgroundColor: "#e4e4e4" }}
              onClick={() => { setActiveTemplate(null); setTmplSelectedContributors([]); setTmplToQuery(""); setTmplToOpen(false); }}
            >
              Send Email
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send an Email */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Send an Email</h2>
        <div className="flex gap-4 items-start">

          {/* Left: top contributors */}
          <div className="w-72 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="text-sm font-medium text-gray-800">{listFilterLabel} Top Contributors</span>
              <button
                ref={listFilterRef}
                onClick={() => {
                  if (listFilterRef.current) setListFilterRect(listFilterRef.current.getBoundingClientRect());
                  setListFilterOpen((o) => !o);
                }}
              >
                <FilterListIcon fontSize="small" style={{ color: "#3E6DA6" }} />
              </button>
            </div>
            {/* Rows */}
            <div className="divide-y divide-gray-50 px-4">
              {topContributors.length === 0 ? (
                <p className="py-4 text-xs text-gray-400">No contributors yet</p>
              ) : (
                topContributors.map((c) => (
                  <div
                    key={c.id}
                    className="flex cursor-pointer items-center justify-between py-3 hover:bg-gray-50 -mx-4 px-4 rounded"
                    onClick={() => {
                      if (!selectedContributors.some((s) => s.id === c.id)) {
                        setSelectedContributors((prev) => [...prev, c]);
                      }
                      setToQuery("");
                    }}
                  >
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
                <div ref={toRef}>
                  <div
                    className="flex flex-wrap cursor-text items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2"
                    onClick={() => {
                      if (toRef.current) setToRect(toRef.current.getBoundingClientRect());
                      setToOpen(true);
                    }}
                  >
                    {selectedContributors.map((c) => (
                      <span
                        key={c.id}
                        className="flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                      >
                        {c.firstName} {c.lastName}
                        <button
                          className="ml-0.5 text-gray-400 hover:text-gray-600"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setSelectedContributors((prev) => prev.filter((s) => s.id !== c.id));
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={selectedContributors.length === 0 ? "Type a contributor" : "Add more…"}
                      value={toQuery}
                      onFocus={() => {
                        if (toRef.current) setToRect(toRef.current.getBoundingClientRect());
                        setToOpen(true);
                      }}
                      onChange={(e) => {
                        setToQuery(e.target.value);
                        if (toRef.current) setToRect(toRef.current.getBoundingClientRect());
                        setToOpen(true);
                      }}
                      className="min-w-[120px] flex-1 bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
                {toOpen && toRect && createPortal(
                  <div
                    ref={toPortalRef}
                    style={{
                      position: "fixed",
                      top: toRect.bottom + 4,
                      left: toRect.left,
                      width: toRect.width,
                      zIndex: 9999,
                      backgroundColor: "white",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                    }}
                    className="rounded-lg"
                  >
                    {filteredContributors.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-gray-400">No contributors found</p>
                    ) : (
                      filteredContributors.slice(0, 8).map((c) => (
                        <button
                          key={c.id}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSelectedContributors((prev) => [...prev, c]);
                            setToQuery("");
                            setToOpen(false);
                          }}
                        >
                          {c.firstName} {c.lastName}
                        </button>
                      ))
                    )}
                  </div>,
                  document.body
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
                onClick={() => { setSelectedContributors([]); setToQuery(""); setSubject(""); setMessage(""); }}
              >
                Cancel
              </button>
              <button className="rounded-xl px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200" style={{ backgroundColor: "#e4e4e4" }}>
                Send Email
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* List filter portal */}
      {listFilterOpen && listFilterRect && createPortal(
        <div
          ref={listFilterPortalRef}
          style={{
            position: "fixed",
            top: listFilterRect.bottom + 6,
            left: listFilterRect.right - 160,
            zIndex: 9999,
            backgroundColor: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}
          className="min-w-[160px] rounded-lg p-2"
        >
          {([
            ["last-month", "Last Month's"],
            ["last-year", "Last Year's"],
            ["all-time", "All Time"],
          ] as ["last-month" | "last-year" | "all-time", string][]).map(([val, label]) => (
            <button
              key={val}
              className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50 ${listFilter === val ? "font-semibold text-blue-600" : "text-gray-700"}`}
              onMouseDown={(e) => { e.preventDefault(); setListFilter(val); setListFilterOpen(false); }}
            >
              {label}
            </button>
          ))}
        </div>,
        document.body
      )}
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
