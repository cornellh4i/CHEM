"use client";
import * as React from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { MoreVertical } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/utils/api";

type TransactionType = "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE";

interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  amount: number;
}

type Range = "last-month" | "last-year" | "all";

interface Point {
  date: Date;
  value: number;
}

const fetchTransactions = async (fundId?: string): Promise<Transaction[]> => {
  try {
    const url = fundId ? `/funds/${fundId}/transactions` : `/transactions`;
    const response = await api.get(url);
    return response.data.transactions ?? [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const formatK = (n: number) => {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
};

const chartConfig = {
  value: { label: "Amount $", color: "black" },
} satisfies ChartConfig;

interface ContributionsGraphProps {
  fundId?: string;
  range?: Range;
  onRangeChange?: (range: Range) => void;
}

export function ContributionsGraph({
  fundId,
  range: rangeProp,
  onRangeChange,
}: ContributionsGraphProps) {
  const [allPoints, setAllPoints] = React.useState<Point[]>([]);
  const [internalRange, setInternalRange] = React.useState<Range>("last-month");
  const range = rangeProp ?? internalRange;
  const setRange = (r: Range) => {
    if (onRangeChange) onRangeChange(r);
    else setInternalRange(r);
  };

  React.useEffect(() => {
    fetchTransactions(fundId).then((txs) => {
      const sorted = txs
        .filter((t) => ["DONATION", "INVESTMENT", "WITHDRAWAL", "EXPENSE"].includes(t.type))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      let cumulative = 0;
      const points: Point[] = sorted.map((t) => {
        if (t.type === "WITHDRAWAL" || t.type === "EXPENSE") {
          cumulative -= t.amount;
        } else {
          cumulative += t.amount;
        }
        return { date: new Date(t.date), value: cumulative };
      });
      setAllPoints(points);
    });
  }, [fundId]);

  const filteredPoints = React.useMemo(() => {
    if (allPoints.length === 0) return [];
    if (range === "all") return allPoints;
    const now = new Date();
    const cutoff = new Date(now);
    if (range === "last-month") cutoff.setMonth(now.getMonth() - 1);
    else cutoff.setFullYear(now.getFullYear() - 1);
    const filtered = allPoints.filter((p) => p.date >= cutoff);
    return filtered.length > 0 ? filtered : allPoints.slice(-2);
  }, [allPoints, range]);

  const chartData = filteredPoints.map((p) => ({
    timestamp: p.date.getTime(),
    value: p.value,
  }));

  const total = React.useMemo(() => {
    if (filteredPoints.length === 0) return 0;
    const last = filteredPoints[filteredPoints.length - 1].value;
    if (range === "all") return last;
    const cutoff = filteredPoints[0].date;
    const pointsBefore = allPoints.filter((p) => p.date < cutoff);
    const valueBeforeRange = pointsBefore.length > 0 ? pointsBefore[pointsBefore.length - 1].value : 0;
    return last - valueBeforeRange;
  }, [filteredPoints, allPoints, range]);

  // Build evenly spaced ticks
  const xAxisTicks = React.useMemo<number[]>(() => {
    if (filteredPoints.length === 0) return [];
    const first = filteredPoints[0].date.getTime();
    const last = filteredPoints[filteredPoints.length - 1].date.getTime();
    if (first === last) {
      const day = 86_400_000;
      return [first - day, first, first + day];
    }
    const out: number[] = [];
    for (let i = 0; i < 5; i++) {
      out.push(Math.round(first + ((last - first) * i) / 4));
    }
    return out;
  }, [filteredPoints]);

  const formatXAxisTick = (timestamp: string | number) => {
    const date = new Date(Number(timestamp));
    return formatDate(date);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-400">Account Balance</div>
          <div className="mt-1 text-[30px] font-bold leading-none text-gray-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total)}
          </div>
        </div>
        <div className="flex items-center gap-5 text-sm">
          {(
            [
              ["last-month", "Last Month"],
              ["last-year", "Last Year"],
              ["all", "All"],
            ] as [Range, string][]
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setRange(val)}
              className={
                range === val
                  ? "font-semibold text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }
            >
              {label}
            </button>
          ))}
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-[340px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 4, right: 12, top: 16, bottom: 4 }}
        >
          <YAxis
            dataKey="value"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatK}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            width={36}
          />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            ticks={xAxisTicks}
            tickFormatter={formatXAxisTick}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="value"
            type="linear"
            stroke="#111827"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default ContributionsGraph;
