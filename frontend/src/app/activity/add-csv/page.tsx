"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import api from "@/utils/api";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;
type ParsedRow = Record<string, string>;
type ColumnMap = Record<string, string>; // csvCol -> fundField

const FUND_FIELDS = ["Date", "Contributor", "Amount", "Units", "Type", "Description", "Fund"];

const FIELD_ICONS: Record<string, string> = {
  Date: "☐",
  Contributor: "◎",
  Amount: "▦",
  Units: "▦",
  Type: "☐",
  Description: "☐",
  Fund: "☐",
};

type Contributor = { id: string; firstName: string; lastName: string; organizationId: string };
type Fund = { id: string; name: string };

// ─── CSV parser ───────────────────────────────────────────────────────────────

const parseCSV = (text: string): { headers: string[]; rows: ParsedRow[] } => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: ParsedRow = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  });
  return { headers, rows };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddCsvPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [csvErrors, setCsvErrors] = useState<Record<string, string>>({});
  const [marketValue, setMarketValue] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [importName, setImportName] = useState("");
  const [editingField, setEditingField] = useState<"market" | "units" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [cr, fr] = await Promise.all([api.get("/contributors"), api.get("/funds")]);
        setContributors(Array.isArray(cr.data?.contributors) ? cr.data.contributors : Array.isArray(cr.data) ? cr.data : []);
        setFunds(Array.isArray(fr.data?.funds?.funds) ? fr.data.funds.funds : Array.isArray(fr.data?.funds) ? fr.data.funds : Array.isArray(fr.data) ? fr.data : []);
      } catch {}
    })();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── File handling ─────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) { setError("Please upload a .csv file"); return; }
    setCsvFile(file);
    setUploadProgress(0);
    setUploadDone(false);
    setError(null);

    if (progressRef.current) clearInterval(progressRef.current);
    let progress = 0;
    progressRef.current = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressRef.current!);
        setUploadDone(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          const { headers, rows } = parseCSV(e.target?.result as string);
          setCsvHeaders(headers);
          setCsvRows(rows);
          // Auto-map matching columns
          const autoMap: ColumnMap = {};
          headers.forEach((h) => {
            const match = FUND_FIELDS.find((f) => f.toLowerCase() === h.toLowerCase());
            if (match) autoMap[h] = match;
          });
          setColumnMap(autoMap);
          // Pre-fill import name
          setImportName(file.name.replace(".csv", "").replace(/_/g, " "));
        };
        reader.readAsText(file);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 150);
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateMap = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    Object.entries(columnMap).forEach(([csvCol, fundField]) => {
      if (fundField === "Amount") {
        const hasInvalid = csvRows.some((row) => isNaN(parseFloat(row[csvCol])));
        if (hasInvalid) errors[csvCol] = `Some "${csvCol}" values are not valid numbers`;
      }
    });
    return errors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleImport = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const reverseMap: Record<string, string> = {};
      Object.entries(columnMap).forEach(([col, field]) => { reverseMap[field] = col; });

      const fallbackContributor = contributors[0];
      const fallbackFund = funds[0];

      if (!fallbackContributor) throw new Error("No contributors found. Please add a contributor first.");
      if (!fallbackFund) throw new Error("No funds found. Please add a fund first.");

      const txList = csvRows.map((row) => {
        const csvName = reverseMap["Contributor"] ? row[reverseMap["Contributor"]]?.trim().toLowerCase() : "";
        const matched = contributors.find(
          (c) => `${c.firstName} ${c.lastName}`.toLowerCase() === csvName
        ) ?? fallbackContributor;

        const csvFund = reverseMap["Fund"] ? row[reverseMap["Fund"]]?.trim().toLowerCase() : "";
        const matchedFund = funds.find((f) => f.name.toLowerCase() === csvFund) ?? fallbackFund;

        return {
          date: reverseMap["Date"] ? new Date(row[reverseMap["Date"]]).toISOString() : new Date().toISOString(),
          contributorId: matched.id,
          fundId: matchedFund.id,
          organizationId: matched.organizationId,
          amount: parseFloat(row[reverseMap["Amount"]] ?? "0") || 0,
          units: parseFloat(row[reverseMap["Units"]] ?? "1") || 1,
          type: (row[reverseMap["Type"]]?.toUpperCase() || "DONATION") as string,
          description: row[reverseMap["Description"]] || "Imported from CSV",
        };
      });

      await api.post("/transactions/bulk", { transactions: txList });
      router.push(`/activity?refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || "Import failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Computed values ───────────────────────────────────────────────────────

  const computedAmount = csvRows.reduce((s, row) => {
    const col = Object.entries(columnMap).find(([, f]) => f === "Amount")?.[0];
    return s + (col ? parseFloat(row[col] || "0") : 0);
  }, 0);

  const computedUnits = csvRows.reduce((s, row) => {
    const col = Object.entries(columnMap).find(([, f]) => f === "Units")?.[0];
    return s + (col ? parseFloat(row[col] || "0") : 0);
  }, 0);

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!csvFile || !uploadDone) { setError("Please upload a CSV file first"); return; }
      setStep(2);
    } else if (step === 2) {
      const errs = validateMap();
      setCsvErrors(errs);
      setStep(3);
    } else if (step === 3) {
      if (Object.keys(csvErrors).length > 0) { setError("Please fix errors in your CSV before continuing"); return; }
      setStep(4);
    } else if (step === 4) {
      handleImport();
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === 1) router.push("/activity");
    else setStep((step - 1) as Step);
  };

  // ── Progress bar ──────────────────────────────────────────────────────────

  const ProgressBar = () => (
    <div className="mb-8 flex gap-2">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="h-1 flex-1 rounded-full"
          style={{ backgroundColor: s <= step ? "#1e3a5f" : "#e5e7eb" }} />
      ))}
    </div>
  );

  // ── Step renderers ────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <>
      <h2 className="text-xl font-semibold">Import data</h2>
      <p className="text-gray-500 mb-6 text-sm">Ensure file includes name and amount of contribution</p>

      <div
        className={`flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 transition-colors ${csvFile ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <div className="flex flex-col items-center gap-1">
          <UploadFileIcon className="text-blue-500" />
          <span className="text-sm font-medium">Add CSV file</span>
          <span className="text-gray-400 text-xs">or <span className="underline">click</span> to select files</span>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {csvFile && (
        <div className="mt-4 space-y-3">
          {!uploadDone && (
            <div className="border-gray-200 flex items-center gap-3 rounded-lg border p-3">
              <InsertDriveFileOutlinedIcon className="text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{csvFile.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">{(csvFile.size / 1024 / 1024).toFixed(1)}MB</span>
                  <span className="text-blue-500">Uploading...</span>
                </div>
                <div className="bg-gray-200 mt-1.5 h-1 w-full rounded-full">
                  <div className="h-1 rounded-full bg-blue-500 transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
              <span className="text-gray-400 shrink-0 text-xs">
                {Math.max(0, Math.round((100 - uploadProgress) / 5))}s remaining
              </span>
              <button onClick={() => { setCsvFile(null); setUploadProgress(0); }}>
                <CloseIcon fontSize="small" className="text-gray-400" />
              </button>
            </div>
          )}
          {uploadDone && (
            <div className="border-gray-200 flex items-center gap-3 rounded-lg border p-3">
              <InsertDriveFileOutlinedIcon className="text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{csvFile.name}</div>
                <div className="text-gray-400 text-xs">
                  {(csvFile.size / 1024 / 1024).toFixed(1)}MB &nbsp;·&nbsp; Complete
                </div>
              </div>
              <button onClick={() => { setCsvFile(null); setUploadDone(false); setCsvHeaders([]); setCsvRows([]); }}>
                <CloseIcon fontSize="small" className="text-gray-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  const MappingRows = ({ showStatus }: { showStatus: boolean }) => (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_32px_1fr_32px] gap-2 text-sm font-medium">
        <div>Columns from your file</div>
        <div />
        <div>Columns for the fund</div>
        <div />
      </div>
      {csvHeaders.map((header) => (
        <div key={header} className="grid grid-cols-[1fr_32px_1fr_32px] items-center gap-2">
          {/* CSV column */}
          <div className="border-gray-200 flex items-center gap-2 rounded border px-3 py-2 text-sm">
            <span className="text-gray-400 text-xs">{FIELD_ICONS[columnMap[header]] ?? "☐"}</span>
            {header}
          </div>
          {/* Arrow */}
          <span className="text-gray-400 text-center">→</span>
          {/* Fund field dropdown */}
          <div className="relative" data-dropdown>
            <button
              className="border-gray-200 flex w-full items-center justify-between rounded border px-3 py-2 text-sm"
              onClick={() => setOpenDropdown(openDropdown === header ? null : header)}
            >
              <span className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{FIELD_ICONS[columnMap[header]] ?? "☐"}</span>
                {columnMap[header] || <span className="text-gray-400">Select field</span>}
              </span>
              <span className="text-gray-400 text-xs">{openDropdown === header ? "▲" : "▾"}</span>
            </button>
            {openDropdown === header && (
              <div className="border-gray-200 bg-white absolute left-0 right-0 top-full z-50 rounded border shadow-lg">
                {FUND_FIELDS.map((field) => (
                  <button key={field}
                    className="hover:bg-gray-50 flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                    onClick={() => { setColumnMap((p) => ({ ...p, [header]: field })); setOpenDropdown(null); }}
                  >
                    <span className="text-gray-400 text-xs">{FIELD_ICONS[field]}</span> {field}
                  </button>
                ))}
                <div className="border-gray-100 border-t">
                  <button className="hover:bg-gray-50 w-full px-3 py-2 text-left text-sm text-blue-600">
                    + Create New Property
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Status icon */}
          <div className="flex justify-center">
            {showStatus && (
              csvErrors[header]
                ? <ErrorIcon className="text-red-500" fontSize="small" />
                : columnMap[header]
                  ? <CheckCircleIcon className="text-green-500" fontSize="small" />
                  : null
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const PreviewTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {Object.entries(columnMap).filter(([, f]) => f).map(([, field]) => (
              <th key={field} className="py-2 pr-6 text-left font-medium">{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {csvRows.slice(0, 8).map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {Object.entries(columnMap).filter(([, f]) => f).map(([col, field]) => (
                <td key={field} className={`py-2 pr-6 ${field === "Amount" ? "text-green-600 font-medium" : ""}`}>
                  {field === "Amount"
                    ? `+$${parseFloat(row[col] || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-xl font-semibold">Map properties</h2>
      <p className="text-gray-500 mb-4 text-sm">Ensure data from your file are mapped correctly</p>
      <div className="mb-6 flex items-center gap-3">
        <div className="border-gray-300 inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm">
          {csvFile?.name.replace(".csv", "")} <span className="text-gray-400 text-xs">▾</span>
        </div>
        <button className="text-sm text-blue-600 underline" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Back to editing" : "Preview list"}
        </button>
      </div>
      {showPreview ? <PreviewTable /> : <MappingRows showStatus={false} />}
    </>
  );

  const renderStep3 = () => {
    const errEntries = Object.entries(csvErrors);
    return (
      <>
        <h2 className="text-xl font-semibold">Check for errors</h2>
        <p className="text-gray-500 mb-4 text-sm">Ensure data from your file are mapped correctly</p>
        <div className="mb-6 flex items-center gap-3">
          <div className="border-gray-300 inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm">
            {csvFile?.name.replace(".csv", "")} <span className="text-gray-400 text-xs">▾</span>
          </div>
          <button className="text-sm text-blue-600 underline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Back to editing" : "Preview list"}
          </button>
        </div>
        {showPreview ? <PreviewTable /> : <MappingRows showStatus={true} />}
        {errEntries.length > 0 && (
          <div className="bg-red-50 border-red-200 mt-4 flex items-start gap-2 rounded border p-3">
            <ErrorIcon className="text-red-500 mt-0.5 shrink-0" fontSize="small" />
            <div>
              <div className="text-sm font-medium text-red-700">
                {errEntries.length} Error{errEntries.length > 1 ? "s" : ""} Detected: "{errEntries.map(([col]) => col).join('", "')}"
              </div>
              <div className="text-xs text-red-500">
                Please check that your data in the original file was inputted correctly.
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderStep4 = () => (
    <>
      <h2 className="text-xl font-semibold">Confirm your data</h2>
      <p className="text-gray-500 mb-6 text-sm">Ensure data from your file are mapped correctly</p>
      <div className="border-gray-200 mb-6 rounded-lg border p-5">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-gray-500 mb-1 text-sm">Calculated market value</div>
            {editingField === "market" ? (
              <Input autoFocus value={marketValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarketValue(e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") setEditingField(null); }}
              />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${marketValue || computedAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <button className="text-gray-400 mt-1 text-xs underline" onClick={() => setEditingField("market")}>
                  Edit value
                </button>
              </>
            )}
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-sm">Calculated total units</div>
            {editingField === "units" ? (
              <Input autoFocus value={totalUnits}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalUnits(e.target.value)}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") setEditingField(null); }}
              />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalUnits || computedUnits.toFixed(2)}
                </div>
                <button className="text-gray-400 mt-1 text-xs underline" onClick={() => setEditingField("units")}>
                  Edit value
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Name your import</label>
        <Input value={importName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImportName(e.target.value)}
          placeholder="e.g. Sample Data 1" />
      </div>
    </>
  );

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4][step - 1];

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardTemplate>
      <div className="w-full">
        <h1 className="mb-6 text-3xl font-bold">Activity</h1>
        <ProgressBar />

        {error && (
          <div className="bg-red-50 border-red-200 mb-4 flex items-center justify-between rounded border p-3 text-sm text-red-700">
            {error}
            <button onClick={() => setError(null)}><CloseIcon fontSize="small" /></button>
          </div>
        )}

        <div className="mb-8">{stepContent()}</div>

        <div className="flex justify-between border-t pt-4">
          <Button onClick={handleBack}
            style={{ padding: "8px 28px", background: "white", border: "1px solid #d1d5db", color: "#111" }}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={submitting}
            style={{ padding: "8px 28px", background: "#1e3a5f", color: "white" }}>
            {step === 4 ? (submitting ? "Importing..." : "Import") : "Next"}
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
}
