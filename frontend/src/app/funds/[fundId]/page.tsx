"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, use } from "react";
import FundTemplate from "@/components/templates/FundTemplate";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import api from "@/utils/api";

interface FundData {
  id: string;
  name: string;
  amount: number;
  description: string;
  organizationId: string;
  type: "ENDOWMENT" | "DONATION";
  restriction?: boolean;
  purpose?: string;
  units?: number;
  createdAt: string;
  updatedAt: string;
}

interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

const FundPage = ({ params }: { params: Promise<{ fundId: string }> }) => {
  const { fundId } = use(params);
  const [activeTab, setActiveTab] = useState<"summary" | "contributors" | "settings">("summary");

  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributorsData, setContributors] = useState<Contributor[]>([]);
  const [oneYearEarnings, setOneYearEarnings] = useState<number>(0);
  const [contributorTotals, setContributorTotals] = useState<Record<string, number>>({});
  const [settingsForm, setSettingsForm] = useState<{
    name: string;
    description: string;
    type: "ENDOWMENT" | "DONATION";
    restriction: boolean;
    purpose: string;
    rate: string;
  } | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    const fetchFund = async () => {
      try {
        setLoading(true);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const [fundResponse, contributorsResponse, txResponse] = await Promise.all([
          api.get(`/funds/${fundId}`),
          api.get(`/funds/${fundId}/contributors`),
          api.get(`/funds/${fundId}/transactions`),
        ]);

        setFundData(fundResponse.data);
        setContributors(contributorsResponse.data.contributors || []);

        const txList: any[] = txResponse.data.transactions || [];

        // 1-year earnings
        const earnings = txList
          .filter((t) =>
            (t.type === "DONATION" || t.type === "INVESTMENT") &&
            new Date(t.date) >= oneYearAgo
          )
          .reduce((sum, t) => sum + t.amount, 0);
        setOneYearEarnings(earnings);

        // total contributions per contributor for this fund
        const totals: Record<string, number> = {};
        txList
          .filter((t) => t.type === "DONATION" || t.type === "INVESTMENT")
          .forEach((t) => {
            if (t.contributorId) {
              totals[t.contributorId] = (totals[t.contributorId] || 0) + t.amount;
            }
          });
        setContributorTotals(totals);
      } catch (err) {
        setError(err instanceof Error ? err.message : "unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFund();
  }, [fundId]);

  // Sync settings form when fund data loads
  useEffect(() => {
    if (!fundData) return;
    setSettingsForm({
      name: fundData.name,
      description: fundData.description,
      type: fundData.type,
      restriction: fundData.restriction ?? false,
      purpose: fundData.purpose ?? "",
      rate: fundData.units && fundData.amount ? String((fundData.amount / fundData.units).toFixed(4)) : "",
    });
  }, [fundData]);

  const handleSettingsSave = async () => {
    if (!settingsForm) return;
    setSettingsSaving(true);
    setSettingsError(null);
    setSettingsSuccess(false);
    try {
      const payload: Record<string, any> = {
        name: settingsForm.name.trim(),
        description: settingsForm.description.trim(),
        type: settingsForm.type,
        restriction: settingsForm.restriction,
        purpose: settingsForm.restriction ? settingsForm.purpose.trim() : null,
        rate: settingsForm.rate !== "" ? parseFloat(settingsForm.rate) : null,
      };
      const res = await api.put(`/funds/${fundId}`, payload);
      setFundData((prev) => prev ? { ...prev, ...res.data } : prev);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSettingsSaving(false);
    }
  };

  const filteredContributors = contributorsData;

  if (loading) return <div>loading fund data</div>;
  if (error) return <div>error: {error}</div>;
  if (!fundData) return <div>error: fund not found</div>;

  const summary = (
    <div className="space-y-8">
      {/* Graph card */}
      <div className="rounded-xl border px-6 py-4 shadow-sm">
        <ContributionsGraph fundId={fundId} />
        <div className="text-gray-700 mt-4 flex gap-12 text-sm">
          <div>
            {(() => {
              const startBalance = fundData.amount - oneYearEarnings;
              const base = startBalance > 0 ? startBalance : (fundData.amount > 0 ? fundData.amount : null);
              const pct = base !== null && oneYearEarnings !== 0 ? (oneYearEarnings / base) * 100 : null;
              return (
                <>
                  <div className={`text-lg font-semibold ${pct !== null && pct >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "—"}
                  </div>
                  <div className="text-xs">1-Year Return</div>
                </>
              );
            })()}
          </div>
          <div>
            <div className="text-lg font-semibold">
              ${oneYearEarnings.toLocaleString()}
            </div>
            <div className="text-xs">1-Year Earnings</div>
          </div>
        </div>
      </div>

      {/* Transactions below graph */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">All transactions</h2>
        <TransactionsTable
          tableType="transactions"
          fundId={fundId}
          fundName={fundData.name}
        />
      </div>
    </div>
  );

  const contributors = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Contributors</h2>
      </div>

      {/* Table */}
      <div>
        <div className="mb-2 flex justify-between px-2 text-sm font-semibold">
          <span>Name</span>
          <span>Total contributions</span>
        </div>
        <div className="divide-y">
          {filteredContributors.length === 0 ? (
            <div className="text-gray-400 py-6 text-center text-sm">No contributors found</div>
          ) : (
            filteredContributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center justify-between px-2 py-3 text-sm">
                <span className="font-medium">{contributor.firstName} {contributor.lastName}</span>
                <span className="text-gray-700">
                  {contributorTotals[contributor.id] != null
                    ? `$${contributorTotals[contributor.id].toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const settings = settingsForm ? (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-bold">Fund Settings</h2>

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Fund Name</label>
        <input
          type="text"
          value={settingsForm.name}
          onChange={(e) => setSettingsForm((f) => f && { ...f, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
        <textarea
          value={settingsForm.description}
          onChange={(e) => setSettingsForm((f) => f && { ...f, description: e.target.value })}
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
        />
      </div>

      {/* Type */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Fund Type</label>
        <select
          value={settingsForm.type}
          onChange={(e) => setSettingsForm((f) => f && { ...f, type: e.target.value as "ENDOWMENT" | "DONATION" })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
        >
          <option value="ENDOWMENT">Endowment</option>
          <option value="DONATION">Donation</option>
        </select>
      </div>

      {/* Restriction */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Restriction</label>
        <div className="flex gap-4">
          {[{ label: "Restricted", value: true }, { label: "Unrestricted", value: false }].map(({ label, value }) => (
            <label key={label} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                checked={settingsForm.restriction === value}
                onChange={() => setSettingsForm((f) => f && { ...f, restriction: value })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Purpose — only if restricted */}
      {settingsForm.restriction && (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Purpose</label>
          <input
            type="text"
            value={settingsForm.purpose}
            onChange={(e) => setSettingsForm((f) => f && { ...f, purpose: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
          />
        </div>
      )}

      {/* Unit rate */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Unit Rate ($ per unit)</label>
        <input
          type="number"
          min="0"
          step="0.0001"
          placeholder="Leave blank for non-unitized"
          value={settingsForm.rate}
          onChange={(e) => setSettingsForm((f) => f && { ...f, rate: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
        />
      </div>

      {/* Feedback */}
      {settingsError && <p className="text-sm text-red-500">{settingsError}</p>}
      {settingsSuccess && <p className="text-sm text-green-600">Changes saved.</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSettingsSave}
          disabled={settingsSaving}
          className="rounded-lg px-6 py-2 text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#3E6DA6" }}
        >
          {settingsSaving ? "Saving…" : "Save Changes"}
        </button>
        <button
          onClick={() => setSettingsForm({
            name: fundData.name,
            description: fundData.description,
            type: fundData.type,
            restriction: fundData.restriction ?? false,
            purpose: fundData.purpose ?? "",
            rate: fundData.units && fundData.amount ? String((fundData.amount / fundData.units).toFixed(4)) : "",
          })}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Discard
        </button>
      </div>
    </div>
  ) : null;

  return (
    <FundTemplate
      fundName={fundData.name}
      fundDescription={fundData.description}
      fundType={fundData.type === "ENDOWMENT" ? "Endowment" : "Donation"}
      summary={summary}
      contributors={contributors}
      settings={settings}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default FundPage;
