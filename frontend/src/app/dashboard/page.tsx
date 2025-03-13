"use client";
import React from "react";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import DashboardTemplate from "@/components/templates/DashboardTemplate";

const DashboardPage = () => {
  return (
    <DashboardTemplate>
      <div className="mb-8 text-4xl font-bold">Museum of the Sea</div>
      <div className="flex items-center justify-between">
        <div className="text-3xl font-medium">Contribution Total</div>
        <button className="bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-300 dark:border-gray-300 mb-2 me-2 inline-flex items-center rounded-xl px-4 py-1.5 text-center text-lg font-light focus:outline-none focus:ring-2">
          Export
          <svg
            className="text-black dark:text-white ml-2 h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
            />
          </svg>
        </button>
      </div>

      <div className="bg-gray-100 mt-4 h-96 w-auto rounded-3xl p-6">
        Overall Contributions Graph
      </div>

      <div className="mb-4 mt-12 flex items-center justify-between">
        <div className="text-3xl font-medium">Recent Contributions</div>
        <button className="bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-300 dark:border-gray-300 mb-2 me-2 inline-flex items-center rounded-xl px-4 py-1.5 text-center text-lg font-light focus:outline-none focus:ring-2">
          Export
          <svg
            className="text-black dark:text-white ml-2 h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
            />
          </svg>
        </button>
      </div>

      <TransactionsTable tableType="contributions" />

      <div className="mt-12 flex items-center justify-between">
        <div className="text-3xl font-medium">Activity Level</div>
        <button className="bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-300 dark:border-gray-300 mb-2 me-2 inline-flex items-center rounded-xl px-4 py-1.5 text-center text-lg font-light focus:outline-none focus:ring-2">
          Export
          <svg
            className="text-black dark:text-white ml-2 h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
            />
          </svg>
        </button>
      </div>

      <div className="bg-gray-100 mt-4 h-96 w-auto rounded-3xl p-6">
        Contributions per month graph
      </div>
    </DashboardTemplate>
  );
};

export default DashboardPage;
