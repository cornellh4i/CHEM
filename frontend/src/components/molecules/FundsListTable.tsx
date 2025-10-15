"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

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

export default function FundsListTable() {
  const router = useRouter();
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const mappedFunds: Fund[] = data.funds.funds.map((apiFund: ApiFund) => ({
          name: apiFund.name,
          id: apiFund.id,
          restriction: apiFund.restriction ? "Restricted" : "Unrestricted",
          type: apiFund.type === "ENDOWMENT" ? "Endowment" : "Donation",
          contributors: 0,
          units: apiFund.units || 0,
          amount: apiFund.amount,
        }));

        setFunds(mappedFunds);
      } else {
        setFunds([]);
      }
    } catch (err) {
      console.error("errpr fetching funds:", err);
      setError("failed to load funds");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-lg text-muted-foreground">Loading funds...</div>
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
        <div className="text-lg text-muted-foreground">No funds available</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {funds.map((fund, index) => (
        <div
          key={index}
          onClick={() => router.push(`/fundsMain/${fund.id}`)}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col gap-2">
            <span className="text-lg font-medium">{fund.name}</span>
            <div className="flex flex-wrap gap-2">
              <Badge>{fund.id}</Badge>
              <Badge>{fund.restriction}</Badge>
              <Badge>{fund.type}</Badge>
            </div>
          </div>

          <div className="flex flex-col md:items-end items-start gap-2 mt-4 md:mt-0">
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
    <span className="bg-muted text-sm text-muted-foreground rounded-full px-3 py-1 border">
      {children}
    </span>
  );
}
