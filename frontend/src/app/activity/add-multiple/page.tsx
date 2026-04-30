"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DragDrop from "@/components/molecules/DragDrop";
import api from "@/utils/api";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = "DEPOSIT" | "WITHDRAWAL";

type TxRow = {
  id: string;
  contributorId: string;
  fundId: string;
  amount: string;
  units: string;
  type: TransactionType | null;
  description: string;
  documents: File[];
  collapsed: boolean;
};

type Contributor = { id: string; firstName: string; lastName: string; organizationId: string };
type Fund = { id: string; name: string };

const emptyRow = (): TxRow => ({
  id: Math.random().toString(36).slice(2),
  contributorId: "", fundId: "", amount: "", units: "",
  type: null, description: "", documents: [], collapsed: false,
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddMultiplePage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = form, 2 = summary
  const [rows, setRows] = useState<TxRow[]>([emptyRow()]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [cr, fr] = await Promise.all([api.get("/contributors"), api.get("/funds")]);
        const c = Array.isArray(cr.data?.contributors) ? cr.data.contributors : Array.isArray(cr.data) ? cr.data : [];
        const f = Array.isArray(fr.data?.funds?.funds) ? fr.data.funds.funds : Array.isArray(fr.data?.funds) ? fr.data.funds : Array.isArray(fr.data) ? fr.data : [];
        setContributors(c);
        setFunds(f);
      } catch {
        setError("Failed to load contributors/funds.");
      }
    })();
  }, []);

  const updateRow = (id: string, field: keyof TxRow, value: any) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const duplicateRow = (id: string) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      const copy = { ...prev[idx], id: Math.random().toString(36).slice(2), collapsed: false };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const deleteRow = (id: string) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleCollapse = (id: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, collapsed: !r.collapsed } : r));
  };

  const handleNext = () => {
    setError(null);
    const invalid = rows.find((r) => !r.contributorId || !r.fundId || !r.amount || !r.type);
    if (invalid) { setError("Please fill in Contributor, Fund, Amount, and Type for every transaction."); return; }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const txList = rows.map((r) => {
        const contributor = contributors.find((c) => c.id === r.contributorId);
        return {
          contributorId: r.contributorId,
          organizationId: contributor?.organizationId ?? "",
          fundId: r.fundId,
          amount: parseFloat(r.amount),
          units: parseFloat(r.units) || 1,
          type: r.type === "DEPOSIT" ? "DONATION" : "WITHDRAWAL",
          description: r.description || "No description",
          date: new Date().toISOString(),
        };
      });
      await api.post("/transactions/bulk", { transactions: txList });
      router.push(`/activity?refresh=${Date.now()}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit transactions.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const totalUnits = rows.reduce((s, r) => s + (parseFloat(r.units) || 0), 0);

  // ── Progress bar ──────────────────────────────────────────────────────────

  const ProgressBar = () => (
    <div className="mb-8 flex gap-2">
      {[1, 2].map((s) => (
        <div key={s} className="h-1 flex-1 rounded-full"
          style={{ backgroundColor: s <= step ? "#1e3a5f" : "#e5e7eb" }} />
      ))}
    </div>
  );

  // ── Step 1: Transaction forms ──────────────────────────────────────────────

  const renderForm = () => (
    <>
      <h2 className="mb-6 text-xl font-semibold">Manually add transactions</h2>
      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div key={row.id} className="border-gray-200 rounded-lg border">
            {/* Card header */}
            <button
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium"
              onClick={() => toggleCollapse(row.id)}
            >
              {row.collapsed ? <KeyboardArrowRightIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
              Transaction {idx + 1}/{rows.length}
            </button>

            {!row.collapsed && (
              <div className="border-t px-4 pb-4 pt-4">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm">Contributor</label>
                    <select
                      className="border-gray-300 w-full rounded-lg border bg-gray-100 p-2.5 text-sm"
                      value={row.contributorId}
                      onChange={(e) => updateRow(row.id, "contributorId", e.target.value)}
                    >
                      <option value="">Select contributor</option>
                      {contributors.map((c) => (
                        <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Fund</label>
                    <select
                      className="border-gray-300 w-full rounded-lg border bg-gray-100 p-2.5 text-sm"
                      value={row.fundId}
                      onChange={(e) => updateRow(row.id, "fundId", e.target.value)}
                    >
                      <option value="">Select fund</option>
                      {funds.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm">Amount of contribution</label>
                    <Input type="number" min="0" value={row.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, "amount", e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Units purchased</label>
                    <Input type="number" min="0" value={row.units}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRow(row.id, "units", e.target.value)} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm">Type</label>
                  <RadioGroup value={row.type ?? ""} onValueChange={(v) => updateRow(row.id, "type", v as TransactionType)}
                    className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="DEPOSIT" id={`deposit-${row.id}`} />
                      <label htmlFor={`deposit-${row.id}`} className="text-sm">Deposit</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="WITHDRAWAL" id={`withdrawal-${row.id}`} />
                      <label htmlFor={`withdrawal-${row.id}`} className="text-sm">Withdrawal</label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm">Description of transaction</label>
                  <textarea
                    className="border-gray-300 h-24 w-full rounded-lg border p-3 text-sm"
                    placeholder="Add a description"
                    value={row.description}
                    onChange={(e) => updateRow(row.id, "description", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="mb-1 block text-sm">Add documents</label>
                  <DragDrop onDrop={(files) => updateRow(row.id, "documents", files)} />
                </div>
                <div className="mt-3 flex justify-end gap-4 text-sm">
                  <button className="text-blue-600 underline" onClick={() => duplicateRow(row.id)}>Duplicate</button>
                  {idx > 0 && (
                    <button className="text-red-500 underline" onClick={() => deleteRow(row.id)}>Delete</button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add another */}
      <button
        onClick={addRow}
        className="border-blue-400 mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 text-sm text-blue-600 hover:bg-blue-50"
      >
        <AddIcon fontSize="small" /> Add Another Transaction
      </button>
    </>
  );

  // ── Step 2: Summary ───────────────────────────────────────────────────────

  const renderSummary = () => (
    <>
      <h2 className="mb-1 text-xl font-semibold">Transaction summary</h2>
      <p className="text-gray-400 mb-6 text-sm">Each row represents a transaction. You can add, edit, or delete rows.</p>
      <div className="border-gray-200 mb-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-gray-200 border-b">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Units</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-gray-100 border-b last:border-0">
                <td className="px-4 py-3">
                  {contributors.find((c) => c.id === row.contributorId)
                    ? `${contributors.find((c) => c.id === row.contributorId)!.firstName} ${contributors.find((c) => c.id === row.contributorId)!.lastName}`
                    : "—"}
                </td>
                <td className="px-4 py-3">{row.amount}</td>
                <td className="px-4 py-3">{row.units}</td>
                <td className="px-4 py-3">
                  {row.type && (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${row.type === "DEPOSIT" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                      {row.type === "DEPOSIT" ? "Deposit" : "Withdrawal"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  <button className="text-blue-600 mr-3" onClick={() => { setStep(1); }}>Edit</button>
                  <button className="text-blue-600" onClick={() => deleteRow(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="px-4 py-3 font-medium">Total</td>
              <td className="px-4 py-3 font-medium">{totalAmount}</td>
              <td className="px-4 py-3 font-medium">{totalUnits}</td>
              <td />
              <td className="px-4 py-3 text-blue-600">Edit</td>
            </tr>
          </tbody>
        </table>
        <div className="text-gray-400 border-gray-100 border-t px-4 py-3 text-center text-sm">
          In total {rows.length} transaction{rows.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="border-gray-200 rounded-lg border p-4">
        <h3 className="mb-4 font-medium">Data summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-gray-500 mb-1 text-sm">Number of transactions</div>
            <div className="text-2xl font-bold">{rows.length}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-sm">Calculated market value</div>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-sm">Calculated total units</div>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </div>
        </div>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardTemplate>
      <div className="w-full">
        <h1 className="mb-6 text-3xl font-bold">Activity</h1>
        <ProgressBar />

        {error && (
          <div className="bg-red-50 border-red-200 mb-4 rounded border p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mb-8">
          {step === 1 ? renderForm() : renderSummary()}
        </div>

        <div className="flex justify-between border-t pt-4">
          <Button
            onClick={() => step === 1 ? router.push("/activity") : setStep(1)}
            style={{ padding: "8px 28px", background: "white", border: "1px solid #d1d5db", color: "#111" }}
          >
            Back
          </Button>
          <Button
            onClick={step === 1 ? handleNext : handleSubmit}
            disabled={submitting}
            style={{ padding: "8px 28px", background: "#1e3a5f", color: "white" }}
          >
            {step === 1 ? "Next" : submitting ? "Submitting..." : "Next"}
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
}
