"use client";
import React, { useState } from "react";
import FundsTemplate from "@/components/templates/FundsTemplate";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";
import TransactionsTable from "@/components/molecules/TransactionsTable";

const FundsPage = () => {
  const [activeTab, setActiveTab] = useState<
    "summary" | "transactions" | "contributors"
  >("summary");

  // Summary tab content
  const summary = (
    <div className="space-y-8">
      <div className="rounded-xl border px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-gray-500">Account Balance</div>
            <div className="text-3xl font-bold">$63,534</div>
          </div>
          {/* Static date range for now */}
          <div className="text-sm text-gray-600">Jan 04, 2023 — Jan 04, 2024</div>
        </div>
        <ContributionsGraph />
        <div className="flex gap-12 mt-4 text-sm text-gray-700">
          <div>
            <div className="text-lg font-semibold text-green-600">+3.21%</div>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">All transactions</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
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
            className="flex justify-between border-b pb-2 text-sm text-gray-800"
          >
            <span>{contributor.name}</span>
            <span className="font-medium">{contributor.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <FundsTemplate
      summary={summary}
      transactions={transactions}
      contributors={contributors}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default FundsPage;