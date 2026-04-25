"use client";

import { useState, useEffect } from "react";
import FundCard from "./FundCard";

// connected api
import api from "@/utils/api";

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

  // Prisma returns relation counts here (used to show #contributors/#transactions in the UI)
  _count?: {
    contributors?: number;
    transactions?: number;
  };
}

// FundCard structure
interface FundCardProps {
  id: string;
  name: string;
  amount: number;
  contributors: number;
  percentage: number;
  isRestricted: boolean;
  isEndowment: boolean;
  description: string;
}

type FundFilterType = "all" | "Endowment" | "Donation";
type FundFilterRestriction = "all" | "Restricted" | "Unrestricted";
type FundSortBy = "name-asc" | "name-desc" | "amount-asc" | "amount-desc" | "newest" | "oldest";

export default function FundsCardTable({
  searchQuery,
  filterType = "all",
  filterRestriction = "all",
  sortBy = "newest",
}: {
  searchQuery: string;
  filterType?: FundFilterType;
  filterRestriction?: FundFilterRestriction;
  sortBy?: FundSortBy;
}) {
  const [funds, setFunds] = useState<FundCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  let filteredFunds = funds;
  if (searchQuery) {
    filteredFunds = filteredFunds.filter((f) =>
      (f.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (filterType !== "all") {
    filteredFunds = filteredFunds.filter((f) =>
      filterType === "Endowment" ? f.isEndowment : !f.isEndowment
    );
  }
  if (filterRestriction !== "all") {
    filteredFunds = filteredFunds.filter((f) =>
      filterRestriction === "Restricted" ? f.isRestricted : !f.isRestricted
    );
  }
  filteredFunds = [...filteredFunds].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "amount-asc") return a.amount - b.amount;
    if (sortBy === "amount-desc") return b.amount - a.amount;
    return 0; // newest/oldest handled by fetch order
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    setLoading(true);
    setError(null);

    // fetches funds, mapping API response to match component's format
    try {
      const response = await api.get(`/funds`);

      // Normalize backend shape to expected structure
      const inner = Array.isArray(response.data.funds?.funds)
        ? response.data.funds.funds
        : Array.isArray(response.data.funds)
        ? response.data.funds
        : [];

     if (inner.length > 0) {
        const mappedFunds: FundCardProps[] = inner.map(
          (apiFund: ApiFund) => ({
            id: apiFund.id,
            name: apiFund.name,
            amount: apiFund.amount ?? 0, // fund total
            contributors: apiFund._count?.contributors ?? 0, // number of contributors
            percentage: apiFund.units ?? 0, // shown next to %
            isRestricted: apiFund.restriction || false,
            isEndowment: apiFund.type === "ENDOWMENT",
            description:
              apiFund.description || "No description available",
          })
        );

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
      <div className="flex w-full items-center justify-center py-8">
        <div className="text-gray-500 text-lg">Loading funds...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex w-full flex-col items-center justify-center gap-4 py-8"
      >
        <div className="text-red-600 text-lg">Error: {error}</div>
        <button
          onClick={fetchFunds}
          className="bg-blue-500 text-white hover:bg-blue-600 rounded px-4 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (funds.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <div className="text-gray-500 text-lg">No funds available</div>
      </div>
    );
  }


  // Added code such that if there's a non-empty search, a small helper line with how many results matched is displayed to user.
  return (
    <div className="w-full">
      {searchQuery?.trim() && (
     <div className="mb-2 text-sm text-gray-600">
       {`Showing ${filteredFunds.length} funds for "${searchQuery}"`}
      </div>
    )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFunds.map((fund, index) => (
          <FundCard
            id={fund.id}
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
