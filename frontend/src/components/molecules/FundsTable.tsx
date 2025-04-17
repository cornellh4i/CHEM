"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

type Fund = {
  name: string;
  id: string;
  restriction: "Restricted" | "Unrestricted";
  type: "Endowment" | "Donation";
  contributors: number;
  units: number;
  amount: number;
};

const dummyFunds: Fund[] = Array(5).fill({
  name: "Milstein Fund",
  id: "#ID Number",
  restriction: "Restricted",
  type: "Endowment",
  contributors: 80,
  units: 2000,
  amount: 10000,
});

export default function FundsTable() {
  return (
    <div className="w-full flex flex-col gap-4">
      {dummyFunds.map((fund, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border"
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
            <span className="text-sm text-muted-foreground">
              {fund.contributors} contributors · {fund.units.toLocaleString()} units
            </span>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">
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
