"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, useMemo, use } from "react";
import FundTemplate from "@/components/templates/FundTemplate";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import AddTransactionModal from "@/components/molecules/AddTransactionModal";
import AddContributorModal from "@/components/molecules/AddContributorModal";
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
  const [activeTab, setActiveTab] = useState<"summary" | "contributors">("summary");

  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributorsData, setContributors] = useState<Contributor[]>([]);
  const [oneYearEarnings, setOneYearEarnings] = useState<number>(0);
  const [contributorTotals, setContributorTotals] = useState<Record<string, number>>({});
  const [contributorSearch, setContributorSearch] = useState("");
  const [contributorRefresh, setContributorRefresh] = useState(0);

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
  }, [fundId, contributorRefresh]);

  const filteredContributors = useMemo(() => {
    const q = contributorSearch.trim().toLowerCase();
    if (!q) return contributorsData;
    return contributorsData.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  }, [contributorsData, contributorSearch]);

  if (loading) return <div>loading fund data</div>;
  if (error) return <div>error: {error}</div>;
  if (!fundData) return <div>error: fund not found</div>;

  const summary = (
    <div className="space-y-8">
      {/* Graph card */}
      <div className="rounded-xl border px-6 py-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm">Account Balance</div>
            <div className="text-3xl font-bold">
              ${fundData.amount.toLocaleString()}
            </div>
          </div>
        </div>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">All transactions</h2>
          <AddTransactionModal>
            <button
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: "#3E6DA6", color: "white" }}
            >
              + Add a new transaction
            </button>
          </AddTransactionModal>
        </div>
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
        <AddContributorModal onAdded={() => setContributorRefresh((r) => r + 1)}>
          <button
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: "#3E6DA6", color: "white" }}
          >
            + Add new contributor
          </button>
        </AddContributorModal>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-md border px-3 py-2">
        <svg className="text-gray-400 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={contributorSearch}
          onChange={(e) => setContributorSearch(e.target.value)}
          className="w-full text-sm outline-none"
        />
      </div>

      {/* Table */}
      <div>
        <div className="mb-2 flex justify-between px-2 text-sm font-semibold">
          <span>Date</span>
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

  return (
    <FundTemplate
      fundName={fundData.name}
      fundDescription={fundData.description}
      fundType={fundData.type === "ENDOWMENT" ? "Endowment" : "Donation"}
      summary={summary}
      contributors={contributors}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default FundPage;
