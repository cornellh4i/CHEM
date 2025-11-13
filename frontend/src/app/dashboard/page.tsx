"use client";
import React, { useEffect, useState } from "react";
import auth from "@/utils/firebase-client";
import TransactionsTable from "@/components/molecules/TransactionsTable";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import BarGraph from "@/components/molecules/BarGraph";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";


// fetch the logged-in user via /auth/login using their Firebase ID token
// and replace the default org name with the organization name returned from the backend.
const DashboardPage = () => {
  const [orgName, setOrgName] = useState<string>("Museum of the Sea");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        const res = await fetch(`${apiBase}/auth/login`, {
          method: "GET", // backend route is router.get("/login", ...)
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.error("Failed to fetch user", res.status);
          return;
        }
        const data = await res.json();
        const org = data.user?.organization?.name;
        if (org) setOrgName(org);
      } catch (err) {
        console.error("Error loading user", err);
      }
    };
    void loadUser();
  }, []);

  return (
    <DashboardTemplate>
      <div className="mb-8 text-4xl font-bold">{orgName}</div>
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

      {/* <div className="bg-gray-100 mt-4 h-96 w-auto rounded-3xl p-6">
        Overall Contributions Graph
      </div> */}
      <ContributionsGraph />

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
        <BarGraph />
      </div>
    </DashboardTemplate>
  );
};

export default DashboardPage;
