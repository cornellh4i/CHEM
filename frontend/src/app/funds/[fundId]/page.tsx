"use client";
import React, { useState } from "react";
import FundTemplate from "@/components/templates/FundTemplate";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";
import TransactionsTable from "@/components/molecules/TransactionsTable";

const FundPage = () => {
  const [activeTab, setActiveTab] = useState<
    "summary" | "transactions" | "contributors"
  >("summary");

  // Summary tab content
  const summary = (
    <div className="space-y-8">
      <div className="rounded-xl border px-6 py-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm">Account Balance</div>
            <div className="text-3xl font-bold">$63,534</div>
          </div>
          {/* Static date range for now */}
          <div className="text-gray-600 text-sm">
            Jan 04, 2023 — Jan 04, 2024
          </div>
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
      <TransactionsTable tableType="contributions" />
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
        {[
          // TODO make this connect 2 backend for contributors
          { name: "Theo Rumburg", amount: "$11,508.97" },
          { name: "John Clay", amount: "$11,508.97" },
          { name: "Dorothy Rumburg", amount: "$11,508.97" },
        ].map((contributor, index) => (
          <div
            key={index}
            className="text-gray-800 flex justify-between border-b pb-2 text-sm"
          >
            <span>{contributor.name}</span>
            <span className="font-medium">{contributor.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <FundTemplate
      summary={summary}
      transactions={transactions}
      contributors={contributors}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default FundPage;
