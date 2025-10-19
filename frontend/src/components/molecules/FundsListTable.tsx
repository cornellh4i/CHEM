"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

type Fund = {
  name: string;
  id: string;
  restriction: "Restricted" | "Unrestricted";
  type: "Endowment" | "Donation";
  contributors: number;
  units: number;
  amount: number;
};

export default function FundsCardTable({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const filteredFunds = searchQuery
    ? funds.filter((fund) =>
        (fund.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : funds;

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/funds`);

      if (!response.ok) {
        const statusText = response.statusText || "unknown error";
        throw new Error(`${response.status} ${statusText}`);
      }

      const data = await response.json();

      if (data && data.funds && data.funds.funds) {
        const mappedFunds: Fund[] = data.funds.funds.map(
          (apiFund: ApiFund) => ({
            name: apiFund.name,
            id: apiFund.id,
            restriction: apiFund.restriction ? "Restricted" : "Unrestricted",
            type: apiFund.type === "ENDOWMENT" ? "Endowment" : "Donation",
            contributors: 0,
            units: apiFund.units || 0,
            amount: apiFund.amount,
          })
        );

        setFunds(mappedFunds);
      } else {
        setFunds([]);
      }
    } catch (err) {
      console.error("error fetching funds:", err);
      setError("failed to load funds");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <div className="text-lg text-muted-foreground">Loading funds...</div>
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
        <div className="text-lg text-muted-foreground">No funds available</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {filteredFunds.map((fund) => (
        <div
          key={fund.id}
          onClick={() => router.push(`/funds/${fund.id}`)}
          className="bg-white flex cursor-pointer flex-col items-start justify-between rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center"
        >
          <div className="flex flex-col gap-2">
            <span className="text-lg font-medium">{fund.name}</span>
            <div className="flex flex-wrap gap-2">
              <Badge>{fund.type}</Badge>
              <Badge>{fund.restriction}</Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-start gap-2 md:mt-0 md:items-end">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{fund.contributors} contributors</span>
              <span>{fund.units.toLocaleString()} units</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">
                ${fund.amount.toLocaleString()}
              </span>
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border bg-muted px-3 py-1 text-sm text-muted-foreground">
      {children}
    </span>
  );
}
