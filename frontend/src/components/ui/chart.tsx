"use client";
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";
import React, { ReactElement } from "react";

interface ChartContainerProps {
  children: ReactElement; // Ensures that children is always a valid React element
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export function ChartContainer({
  children,
  config,
}: {
  children: ReactElement;
  config?: ChartConfig;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTooltip({
  cursor = false,
  content,
}: {
  cursor?: boolean;
  content?: React.ReactElement; // Allow custom content
}) {
  return (
    <Tooltip cursor={cursor} content={content || <ChartTooltipContent />} />
  );
}

export function ChartTooltipContent({ payload, label }: any) {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="bg-white border-gray-300 rounded border p-2 shadow">
      <p className="text-sm font-semibold">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-xs">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}
