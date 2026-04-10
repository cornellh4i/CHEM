"use client";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { ScrollArea } from "@/components/ui/scroll";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DragDrop from "@/components/molecules/DragDrop";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "choose" | "single" | "multi" | "csv-upload" | "csv-map" | "csv-preview" | "csv-errors" | "csv-confirm";

type TransactionData = {
  date: Dayjs | null;
  contributor: string;
  fund: string;
  organizationId: string;
  amount: string;
  unitsPurchased: string;
  type: "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE" | null;
  description: string;
  documents: File[];
};

type Contributor = { id: string; firstName: string; lastName: string; organizationId: string };
type Fund = { id: string; name: string };

// CSV column mapping fields
const FUND_FIELDS = ["Date", "Contributor", "Amount", "Units", "Type", "Description", "Fund"];

type ColumnMap = Record<string, string>; // csvCol -> fundField

type ParsedRow = Record<string, string>;

type TransactionModalProps = {
  children: ReactNode;
  onTransactionAdded?: () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getContributors = async (): Promise<Contributor[]> => {
  const res = await api.get("/contributors");
  const d = res.data;
  if (d?.contributors && Array.isArray(d.contributors)) return d.contributors;
  if (Array.isArray(d)) return d;
  return [];
};

const getFunds = async (): Promise<Fund[]> => {
  const res = await api.get("/funds");
  const d = res.data;
  if (d?.funds && Array.isArray(d.funds)) return d.funds;
  if (Array.isArray(d)) return d;
  return [];
};

const parseCSV = (text: string): { headers: string[]; rows: ParsedRow[] } => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: ParsedRow = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
    return row;
  });
  return { headers, rows };
};

// ─── Component ───────────────────────────────────────────────────────────────

const TransactionModal: React.FC<TransactionModalProps> = ({ children, onTransactionAdded }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("choose");

  // Single transaction state
  const [transaction, setTransaction] = useState<TransactionData>({
    date: dayjs(), contributor: "", fund: "", organizationId: "",
    amount: "", unitsPurchased: "", type: null, description: "", documents: [],
  });
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploadProgress, setCsvUploadProgress] = useState<number>(0);
  const [csvUploadDone, setCsvUploadDone] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap>({});
  const [mapDropdownOpen, setMapDropdownOpen] = useState<string | null>(null);
  const [csvErrors, setCsvErrors] = useState<Record<string, string>>({}); // csvCol -> error
  const [csvMarketValue, setCsvMarketValue] = useState("");
  const [csvTotalUnits, setCsvTotalUnits] = useState("");
  const [csvImportName, setCsvImportName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load contributors/funds when modal opens
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoading(true);
        const [c, f] = await Promise.all([getContributors(), getFunds()]);
        setContributors(c);
        setFunds(f);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  const resetAll = () => {
    setMode("choose");
    setTransaction({ date: dayjs(), contributor: "", fund: "", organizationId: "", amount: "", unitsPurchased: "", type: null, description: "", documents: [] });
    setCsvFile(null); setCsvUploadProgress(0); setCsvUploadDone(false);
    setCsvHeaders([]); setCsvRows([]); setColumnMap({});
    setCsvErrors({}); setCsvMarketValue(""); setCsvTotalUnits("");
    setCsvImportName(""); setShowPreview(false); setError(null);
  };

  const handleClose = () => { setIsOpen(false); resetAll(); };

  const handleInputChange = (field: keyof TransactionData, value: any) => {
    setTransaction((prev) => ({ ...prev, [field]: value }));
  };

  // ── Single transaction submit ─────────────────────────────────────────────

  const handleSingleSubmit = async () => {
    if (!transaction.contributor || !transaction.fund || !transaction.amount || !transaction.type) {
      setError("Please fill in all required fields"); return;
    }
    const selectedContributor = contributors.find((c) => c.id === transaction.contributor);
    if (!selectedContributor) { setError("Please select a valid contributor"); return; }
    try {
      setLoading(true); setError(null);
      await api.post("/transactions", {
        date: transaction.date?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
        contributorId: transaction.contributor,
        fundId: transaction.fund,
        organizationId: selectedContributor.organizationId,
        amount: parseFloat(transaction.amount),
        units: parseFloat(transaction.unitsPurchased) || 1,
        type: transaction.type,
        description: transaction.description || "No description provided",
      });
      onTransactionAdded?.();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Transaction creation failed");
    } finally {
      setLoading(false);
    }
  };

  // ── CSV helpers ───────────────────────────────────────────────────────────

  const handleCsvFileSelect = (file: File) => {
    setCsvFile(file);
    setCsvUploadProgress(0);
    setCsvUploadDone(false);
    // Simulate upload progress
    let progress = 0;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressIntervalRef.current!);
        setCsvUploadDone(true);
        // Parse the file
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const { headers, rows } = parseCSV(text);
          setCsvHeaders(headers);
          setCsvRows(rows);
          // Auto-map columns that match fund field names
          const autoMap: ColumnMap = {};
          headers.forEach((h) => {
            const match = FUND_FIELDS.find((f) => f.toLowerCase() === h.toLowerCase());
            if (match) autoMap[h] = match;
          });
          setColumnMap(autoMap);
        };
        reader.readAsText(file);
      }
      setCsvUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const validateColumnMap = () => {
    const errors: Record<string, string> = {};
    Object.entries(columnMap).forEach(([csvCol, fundField]) => {
      if (fundField === "Amount") {
        // Check all rows have numeric amount
        const hasInvalid = csvRows.some((row) => isNaN(parseFloat(row[csvCol])));
        if (hasInvalid) errors[csvCol] = `Some values in "${csvCol}" are not valid numbers`;
      }
    });
    return errors;
  };

  const handleCsvImport = async () => {
    try {
      setLoading(true); setError(null);
      const reverseMap: Record<string, string> = {};
      Object.entries(columnMap).forEach(([csvCol, fundField]) => { reverseMap[fundField] = csvCol; });

      const txList = csvRows.map((row) => ({
        date: reverseMap["Date"] ? new Date(row[reverseMap["Date"]]).toISOString() : new Date().toISOString(),
        contributorId: contributors[0]?.id ?? "",
        fundId: funds[0]?.id ?? "",
        amount: parseFloat(row[reverseMap["Amount"]] ?? "0"),
        units: parseFloat(row[reverseMap["Units"]] ?? "1") || 1,
        type: (row[reverseMap["Type"]]?.toUpperCase() || "DONATION") as any,
        description: row[reverseMap["Description"]] || "Imported from CSV",
      }));

      await api.post("/transactions/bulk", { transactions: txList });
      onTransactionAdded?.();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Progress bar ──────────────────────────────────────────────────────────

  const modeToStep = (): number => {
    if (mode === "choose") return 0;
    if (mode === "single") return 1;
    if (mode === "csv-upload") return 1;
    if (mode === "csv-map" || mode === "csv-preview") return 2;
    if (mode === "csv-errors") return 3;
    if (mode === "csv-confirm") return 4;
    return 0;
  };

  const totalSteps = mode.startsWith("csv") ? 4 : mode === "single" ? 2 : 1;

  const renderProgressBar = () => {
    const step = modeToStep();
    if (step === 0) return null;
    return (
      <div className="mb-8 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ backgroundColor: i < step ? "#1e3a5f" : "#e5e7eb" }}
          />
        ))}
      </div>
    );
  };

  // ── Renderers ─────────────────────────────────────────────────────────────

  const renderChoose = () => (
    <div className="flex h-full flex-col">
      <DialogTitle className="mb-6 text-2xl font-semibold">Add Transaction</DialogTitle>
      <div className="flex flex-grow flex-col gap-4">
        {[
          { label: "Add a single transaction", action: () => setMode("single") },
          { label: "Add by CSV", action: () => setMode("csv-upload") },
          { label: "Add multiple transactions", action: () => { setIsOpen(false); router.push("/activity/add-multiple"); } },
        ].map(({ label, action }) => (
          <button
            key={label}
            className="border-gray-300 hover:border-black flex flex-1 items-center justify-center rounded-xl border-2 px-4 py-6 text-center text-lg transition-colors"
            onClick={action}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSingle = () => (
    <>
      <DialogTitle className="mb-4 text-xl font-semibold">Manually enter contribution</DialogTitle>
      <div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Select Contributor <span className="text-red-500">*</span></label>
          <Select
            values={contributors.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))}
            onSelect={(val) => {
              handleInputChange("contributor", val);
              const c = contributors.find((c) => c.id === val);
              if (c) handleInputChange("organizationId", c.organizationId);
            }}
            placeholder="Choose a contributor"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Select Fund <span className="text-red-500">*</span></label>
          <Select
            values={funds.map((f) => ({ value: f.id, label: f.name }))}
            onSelect={(val) => handleInputChange("fund", val)}
            placeholder="Choose a fund"
            disabled={loading}
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Amount <span className="text-red-500">*</span></label>
            <Input type="number" placeholder="0.00" min="0" value={transaction.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("amount", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Units purchased <span className="text-red-500">*</span></label>
            <Input type="number" placeholder="0" min="0" value={transaction.unitsPurchased}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("unitsPurchased", e.target.value)} />
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Transaction Type <span className="text-red-500">*</span></label>
          <RadioGroup value={transaction.type || ""} onValueChange={(v) => handleInputChange("type", v as any)}
            className="flex gap-6">
            {["DONATION", "WITHDRAWAL", "INVESTMENT", "EXPENSE"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <RadioGroupItem value={t} id={t} />
                <label htmlFor={t} className="text-sm capitalize">{t.charAt(0) + t.slice(1).toLowerCase()}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Description of transaction</label>
          <textarea className="border-gray-300 h-20 w-full rounded border p-3 text-sm" placeholder="Enter description..."
            value={transaction.description}
            onChange={(e) => handleInputChange("description", e.target.value)} />
        </div>
        <div className="mb-2">
          <label className="mb-1 block text-sm font-medium">Add documents</label>
          <DragDrop onDrop={(files) => handleInputChange("documents", files)} />
        </div>
      </div>
    </>
  );

  const renderCsvUpload = () => (
    <>
      <DialogTitle className="mb-1 text-xl font-semibold">Import data</DialogTitle>
      <p className="text-gray-500 mb-6 text-sm">Ensure file includes name and amount of contribution</p>
      <div
        className={`border-gray-300 flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 transition-colors ${csvFile ? "border-blue-300 bg-blue-50" : "hover:bg-gray-50"}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.name.endsWith(".csv")) handleCsvFileSelect(file);
        }}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <UploadFileIcon className="text-blue-500" />
          <span className="text-sm font-medium">Add CSV file</span>
          <span className="text-gray-400 text-xs">or <span className="underline">click</span> to select files</span>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCsvFileSelect(f); }} />

      {csvFile && (
        <div className="mt-4 space-y-3">
          {/* Uploading row */}
          {!csvUploadDone && (
            <div className="border-gray-200 flex items-center gap-3 rounded-lg border p-3">
              <InsertDriveFileOutlinedIcon className="text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium">{csvFile.name}</div>
                <div className="text-gray-400 flex items-center gap-2 text-xs">
                  <span>{(csvFile.size / 1024 / 1024).toFixed(1)}MB</span>
                  <span className="text-blue-500">Uploading...</span>
                </div>
                <div className="bg-gray-200 mt-1 h-1 w-full rounded-full">
                  <div className="h-1 rounded-full bg-blue-500 transition-all" style={{ width: `${csvUploadProgress}%` }} />
                </div>
              </div>
              <span className="text-gray-400 text-xs">{Math.round((csvFile.size / 1024 / 1024) * (1 - csvUploadProgress / 100) * 10).toFixed(0)}s remaining</span>
              <button onClick={() => { setCsvFile(null); setCsvUploadProgress(0); }}><CloseIcon fontSize="small" /></button>
            </div>
          )}
          {/* Complete row */}
          {csvUploadDone && (
            <div className="border-gray-200 flex items-center gap-3 rounded-lg border p-3">
              <InsertDriveFileOutlinedIcon className="text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium">{csvFile.name}</div>
                <div className="text-gray-400 text-xs">{(csvFile.size / 1024 / 1024).toFixed(1)}MB &nbsp; Complete</div>
              </div>
              <button onClick={() => { setCsvFile(null); setCsvUploadDone(false); }}><CloseIcon fontSize="small" /></button>
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderCsvMap = () => (
    <>
      <DialogTitle className="mb-1 text-xl font-semibold">Map properties</DialogTitle>
      <p className="text-gray-500 mb-4 text-sm">Ensure data from your file are mapped correctly</p>
      <div className="mb-4 flex items-center gap-3">
        <div className="border-gray-300 flex items-center gap-2 rounded border px-3 py-1.5 text-sm">
          {csvFile?.name.replace(".csv", "")} <span className="text-gray-400">▾</span>
        </div>
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Back to editing" : "Preview list"}
        </button>
      </div>

      {showPreview ? (
        // Preview table
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {Object.values(columnMap).filter(Boolean).map((field) => (
                  <th key={field} className="py-2 pr-4 text-left font-medium">{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvRows.slice(0, 8).map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  {Object.entries(columnMap).filter(([, f]) => f).map(([csvCol, field]) => (
                    <td key={field} className="py-2 pr-4 text-green-600">
                      {field === "Amount" ? `+$${parseFloat(row[csvCol] || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}` : row[csvCol]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Mapping UI
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-medium">Columns from your file</div>
            <div className="text-sm font-medium">Columns for the fund</div>
          </div>
          {csvHeaders.map((header) => (
            <div key={header} className="grid grid-cols-2 items-center gap-4">
              <div className="border-gray-200 flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <span className="text-gray-400">☐</span> {header}
              </div>
              <span className="text-gray-400 justify-self-center">→</span>
              {/* This is in the wrong column but used for arrow layout */}
              <div className="-mt-8 col-start-2 relative">
                <button
                  className="border-gray-200 flex w-full items-center justify-between rounded border px-3 py-2 text-sm"
                  onClick={() => setMapDropdownOpen(mapDropdownOpen === header ? null : header)}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">☐</span>
                    {columnMap[header] || <span className="text-gray-400">Select field</span>}
                  </span>
                  <span className="text-gray-400">{mapDropdownOpen === header ? "▲" : "▾"}</span>
                </button>
                {mapDropdownOpen === header && (
                  <div className="border-gray-200 bg-white absolute left-0 right-0 top-full z-50 rounded border shadow-lg">
                    {FUND_FIELDS.map((field) => (
                      <button
                        key={field}
                        className="hover:bg-gray-50 flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                        onClick={() => {
                          setColumnMap((prev) => ({ ...prev, [header]: field }));
                          setMapDropdownOpen(null);
                        }}
                      >
                        <span className="text-gray-400">☐</span> {field}
                      </button>
                    ))}
                    <div className="border-gray-100 border-t">
                      <button className="hover:bg-gray-50 flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-blue-600">
                        + Create New Property
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCsvErrors = () => {
    const errEntries = Object.entries(csvErrors);
    return (
      <>
        <DialogTitle className="mb-1 text-xl font-semibold">Check for errors</DialogTitle>
        <p className="text-gray-500 mb-4 text-sm">Ensure data from your file are mapped correctly</p>
        <div className="mb-4 flex items-center gap-3">
          <div className="border-gray-300 flex items-center gap-2 rounded border px-3 py-1.5 text-sm">
            {csvFile?.name.replace(".csv", "")} <span className="text-gray-400">▾</span>
          </div>
          <button className="text-sm text-blue-600 underline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Back to editing" : "Preview list"}
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-medium">Columns from your file</div>
            <div className="text-sm font-medium">Columns for the fund</div>
          </div>
          {csvHeaders.map((header) => (
            <div key={header} className="grid grid-cols-2 items-center gap-4">
              <div className="border-gray-200 flex items-center gap-2 rounded border px-3 py-2 text-sm">
                <span className="text-gray-400">☐</span> {header}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">→</span>
                <div className="border-gray-200 flex flex-1 items-center justify-between rounded border px-3 py-2 text-sm">
                  <span>{columnMap[header] || <span className="text-gray-400">—</span>}</span>
                  <span className="text-gray-400">▾</span>
                </div>
                {csvErrors[header] ? (
                  <ErrorIcon className="text-red-500" fontSize="small" />
                ) : columnMap[header] ? (
                  <CheckCircleIcon className="text-green-500" fontSize="small" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        {errEntries.length > 0 && (
          <div className="bg-red-50 border-red-200 mt-4 flex items-start gap-2 rounded border p-3">
            <ErrorIcon className="text-red-500 mt-0.5" fontSize="small" />
            <div>
              <div className="text-sm font-medium text-red-700">{errEntries.length} Error{errEntries.length > 1 ? "s" : ""} Detected: "{errEntries.map(([col]) => col).join('", "')}"</div>
              <div className="text-xs text-red-500">Please check that your data in the original file was inputted correctly.</div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderCsvConfirm = () => {
    const totalAmount = csvRows.reduce((sum, row) => {
      const amountCol = Object.entries(columnMap).find(([, f]) => f === "Amount")?.[0];
      return sum + (amountCol ? parseFloat(row[amountCol] || "0") : 0);
    }, 0);
    const totalUnits = csvRows.reduce((sum, row) => {
      const unitsCol = Object.entries(columnMap).find(([, f]) => f === "Units")?.[0];
      return sum + (unitsCol ? parseFloat(row[unitsCol] || "0") : 0);
    }, 0);

    return (
      <>
        <DialogTitle className="mb-1 text-xl font-semibold">Confirm your data</DialogTitle>
        <p className="text-gray-500 mb-6 text-sm">Ensure data from your file are mapped correctly</p>
        <div className="border-gray-200 mb-6 rounded-lg border p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 mb-1 text-sm">Calculated market value</div>
              <div className="text-2xl font-bold">
                ${csvMarketValue || totalAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </div>
              <button className="text-gray-400 mt-1 text-xs underline" onClick={() => {
                const val = prompt("Enter market value:", csvMarketValue || totalAmount.toString());
                if (val) setCsvMarketValue(val);
              }}>Edit value</button>
            </div>
            <div>
              <div className="text-gray-500 mb-1 text-sm">Calculated total units</div>
              <div className="text-2xl font-bold">
                {csvTotalUnits || totalUnits.toFixed(2)}
              </div>
              <button className="text-gray-400 mt-1 text-xs underline" onClick={() => {
                const val = prompt("Enter total units:", csvTotalUnits || totalUnits.toString());
                if (val) setCsvTotalUnits(val);
              }}>Edit value</button>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Name your import</label>
          <Input
            value={csvImportName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCsvImportName(e.target.value)}
            placeholder="e.g. Sample Data 1"
          />
        </div>
      </>
    );
  };

  // ── Navigation logic ──────────────────────────────────────────────────────

  const handleNext = async () => {
    setError(null);
    if (mode === "single") { await handleSingleSubmit(); return; }
    if (mode === "csv-upload") {
      if (!csvFile || !csvUploadDone) { setError("Please upload a CSV file first"); return; }
      setMode("csv-map"); return;
    }
    if (mode === "csv-map") {
      const errors = validateColumnMap();
      setCsvErrors(errors);
      setMode("csv-errors"); return;
    }
    if (mode === "csv-errors") {
      if (Object.keys(csvErrors).length > 0) { setError("Please fix errors before continuing"); return; }
      setMode("csv-confirm"); return;
    }
    if (mode === "csv-confirm") { await handleCsvImport(); return; }
  };

  const handleBack = () => {
    if (mode === "single" || mode === "csv-upload") { setMode("choose"); return; }
    if (mode === "csv-map") { setMode("csv-upload"); return; }
    if (mode === "csv-errors") { setMode("csv-map"); return; }
    if (mode === "csv-confirm") { setMode("csv-errors"); return; }
  };

  const getNextLabel = () => {
    if (mode === "single") return loading ? "Submitting..." : "Submit";
    if (mode === "csv-confirm") return loading ? "Importing..." : "Import";
    return "Next";
  };

  const renderContent = () => {
    switch (mode) {
      case "choose": return renderChoose();
      case "single": return renderSingle();
      case "csv-upload": return renderCsvUpload();
      case "csv-map": case "csv-preview": return renderCsvMap();
      case "csv-errors": return renderCsvErrors();
      case "csv-confirm": return renderCsvConfirm();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); setIsOpen(open); }}>
      <DialogTrigger asChild onClick={() => { setIsOpen(true); resetAll(); }}>
        {children}
      </DialogTrigger>
      <DialogContent className="h-[700px] w-[860px] overflow-hidden rounded-xl border-none p-0 shadow-2xl">
        <div className="flex h-full flex-col px-12 py-10">
          {/* Progress bar */}
          {renderProgressBar()}

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border-red-200 mb-4 flex items-center justify-between rounded border p-3 text-sm text-red-700">
              {error}
              <button onClick={() => setError(null)}><CloseIcon fontSize="small" /></button>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Footer nav */}
          {mode !== "choose" && (
            <div className="mt-6 flex justify-between border-t pt-4">
              <Button onClick={handleBack} style={{ padding: "8px 28px", background: "white", border: "1px solid #d1d5db", color: "#111" }}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={loading} style={{ padding: "8px 28px", background: "#1e3a5f", color: "white" }}>
                {getNextLabel()}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
