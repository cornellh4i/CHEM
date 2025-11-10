"use client";
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
  const [activeTab, setActiveTab] = useState<
    "summary" | "transactions" | "contributors"
  >("summary");

  const [fundData, setFundData] = useState<FundData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributorsData, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const fetchFund = async () => {
      try {
        setLoading(true);
        const [fundResponse, contributorsResponse] = await Promise.all([
          api.get(`/funds/${fundId}`),
          api.get(`/funds/${fundId}/contributors`),
        ]);
    
        const fundData = fundResponse.data;
        const contributorsData = contributorsResponse.data;
        
        setFundData(fundData);
        setContributors(contributorsData.contributors || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : "unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFund();
  }, [fundId]);

  if (loading) return <div>loading fund data</div>;
  if (error) return <div>error: {error}</div>;
  if (!fundData) return <div>error: fund not found</div>;

  // Summary tab content
  const summary = (
    <div className="space-y-8">
      <div className="rounded-xl border px-6 py-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm">Account Balance</div>
            <div className="text-3xl font-bold">
              ${fundData.amount.toLocaleString()}
            </div>
          </div>
          {/* Static date range for now */}
          <div className="text-gray-600 text-sm">{fundData.createdAt}</div>
        </div>
        <ContributionsGraph />
        <div className="text-gray-700 mt-4 flex gap-12 text-sm">
          <div>
            <div className="text-green-600 text-lg font-semibold">+3.21%</div>
            <div className="text-xs">1-Year Return</div>
          </div>
          <div>
            <div className="text-lg font-semibold">$18,344</div>
            <div className="text-xs">1-Year Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Transactions tab content
  const transactions = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">All transactions</h2>
        <button className="bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 text-sm">
          + Add a new transaction
        </button>
      </div>
      <TransactionsTable
        tableType="transactions"
        fundId={fundId}
        fundName={fundData.name}
      />
    </div>
  );

  // Contributors tab content
  const contributors = (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full rounded-md border px-4 py-2 text-sm"
      />
      <div className="space-y-2">
        {contributorsData.map((contributor) => (
          <div
            key={contributor.id}
            className="text-gray-800 flex justify-between border-b pb-2 text-sm"
          >
            <span>
              {contributor.firstName} {contributor.lastName}
            </span>
            <span className="font-medium">{contributor.email || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <FundTemplate
      fundName={fundData.name}
      fundDescription={fundData.description}
      summary={summary}
      transactions={transactions}
      contributors={contributors}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default FundPage;
