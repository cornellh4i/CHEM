"use client";
import React, { useEffect, useState } from "react";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  month: string;
  desktop: number;
  mobile: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#88AEDC",
  },
  mobile: {
    label: "Mobile",
    color: "#3E6DA6",
  },
} satisfies ChartConfig;

export function BarGraph() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [range, setRange] = useState<"6m" | "1y">("6m");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/transactions?type=DONATION"
        );
        const json = await res.json();
        const transactions = json.transactions;

        const now = new Date();
        const cutoff = new Date();
        cutoff.setMonth(
          range === "6m" ? now.getMonth() - 5 : now.getMonth() - 11
        );

        const grouped: Record<string, number> = {};

        const filtered = transactions.filter((tx: any) => {
          const txDate = new Date(tx.date);
          return txDate >= cutoff && txDate <= now;
        });

        filtered.forEach((tx: any) => {
          const date = new Date(tx.date);
          const month = date.toLocaleString("default", { month: "long" });
          grouped[month] = (grouped[month] || 0) + tx.amount;
        });

        const formatted = Object.entries(grouped).map(([month, amount]) => ({
          month,
          desktop: Math.round(amount * 0.6),
          mobile: Math.round(amount * 0.4),
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Failed to fetch contributions:", err);
      }
    };

    fetchData();
  }, [range]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contributions Per Month</CardTitle>
            <CardDescription>
              {range === "6m" ? "Last 6 Months" : "Last Year"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <button
              className={`rounded-lg px-3 py-1 text-sm font-medium ${
                range === "6m" ? "bg-blue-100 text-blue-800" : "bg-gray-200" }`}
              onClick={() => setRange("6m")}
            >
              Last 6 Months
            </button>
            <button
              className={`rounded-lg px-3 py-1 text-sm font-medium ${
                range === "1y" ? "bg-blue-100 text-blue-800" : "bg-gray-200" }`}
              onClick={() => setRange("1y")}
            >
              Last Year
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="desktop"
              fill={chartConfig.desktop.color}
              radius={4}
            />
            <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total contributions for the selected time range
        </div>
      </CardFooter>
    </Card>
  );
}

export default BarGraph;
