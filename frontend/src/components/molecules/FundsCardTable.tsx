"use client";

import React, { useState, useEffect } from "react";
import FundCard from "./FundCard";

// connected api
const API_URL = "http://localhost:8000";

interface ApiFund {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  type: "ENDOWMENT" | "DONATION";
  restriction?: boolean;
  purpose?: string;
  units?: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

// FundCard structure
interface FundCardProps {
  name: string;
  amount: number;
  contributors: number;
  percentage: number;
  isRestricted: boolean;
  isEndowment: boolean;
  description: string;
}


export default function FundsCardTable() {
  const [funds, setFunds] = useState<FundCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    setLoading(true);
    setError(null);

    // fetches funds, mapping API response to match component's format
    try {
      const response = await fetch(`${API_URL}/funds`);

      if (!response.ok) {
        const statusText = response.statusText || "unknown error";
        throw new Error(`${response.status} ${statusText}`);
      }

      const data = await response.json();

      if (data && data.funds && data.funds.funds) {
        // API data to FundCard format
        const mappedFunds: FundCardProps[] = data.funds.funds.map((apiFund: ApiFund) => ({
          name: apiFund.name,
          amount: apiFund.amount,
          contributors: 0, // todo: fetch contributors count from API
          percentage: 0, // todo: calculate percentage or get from API
          isRestricted: apiFund.restriction || false,
          isEndowment: apiFund.type === "ENDOWMENT",
          description: apiFund.description || "No description available",
        }));

        setFunds(mappedFunds);
      } else {
        setFunds([]);
      }
    } catch (err) {
      console.error("error retrieving funds:", err);
      setError("failed to load funds");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-lg text-gray-500">Loading funds...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8 gap-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <button
          onClick={fetchFunds}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (funds.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-lg text-gray-500">No funds available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund, index) => (
          <FundCard
            key={index}
            name={fund.name}
            amount={fund.amount}
            contributors={fund.contributors}
            percentage={fund.percentage}
            isRestricted={fund.isRestricted}
            isEndowment={fund.isEndowment}
            description={fund.description}
          />
        ))}
      </div>
    </div>
  );
}