"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { MoreVertical } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  label: string;
  light: number;
  dark: number;
}

const calendarOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  light: {
    label: "Donations",
    color: "#88AEDC",
  },
  dark: {
    label: "Investments",
    color: "#3E6DA6",
  },
} satisfies ChartConfig;

type Range = "last-year" | "last-6m" | "today";

interface BarGraphProps {
  total?: number;
  range?: Range;
  onRangeChange?: (range: Range) => void;
}

export function BarGraph({ total, range: rangeProp, onRangeChange }: BarGraphProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [internalRange, setInternalRange] = useState<Range>("last-year");
  const range = rangeProp ?? internalRange;
  const setRange = (r: Range) => {
    if (onRangeChange) onRangeChange(r);
    else setInternalRange(r);
  };
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transactions");
        const transactions = res.data.transactions ?? [];

        const now = new Date();
        const cutoff = new Date(now);
        if (range === "last-year") cutoff.setFullYear(now.getFullYear() - 1);
        else if (range === "last-6m") cutoff.setMonth(now.getMonth() - 5);
        else cutoff.setHours(0, 0, 0, 0);

        const filtered = transactions.filter((tx: { date: string }) => {
          const d = new Date(tx.date);
          return d >= cutoff && d <= now;
        });

        setCount(filtered.length);

        if (range === "today") {
          // Group by hour-of-day for "Today" view
          const buckets: Record<number, { light: number; dark: number }> = {};
          for (let h = 0; h < 24; h += 3) buckets[h] = { light: 0, dark: 0 };
          filtered.forEach((tx: { date: string; type: string }) => {
            const hour = new Date(tx.date).getHours();
            const bucket = Math.floor(hour / 3) * 3;
            if (!buckets[bucket]) buckets[bucket] = { light: 0, dark: 0 };
            if (tx.type === "INVESTMENT")
              buckets[bucket].dark += 1;
            else buckets[bucket].light += 1;
          });
          const formatted = Object.entries(buckets).map(([h, v]) => {
            const hourNum = parseInt(h, 10);
            const ampm = hourNum >= 12 ? "pm" : "am";
            const display = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
            return {
              label: `${display}:00${ampm}`,
              light: v.light,
              dark: v.dark,
            };
          });
          setChartData(formatted);
          return;
        }

        // Group by month
        const grouped: Record<string, { light: number; dark: number }> = {};
        filtered.forEach((tx: { date: string; type: string }) => {
          const date = new Date(tx.date);
          const month = date.toLocaleString("default", { month: "long" });
          if (!grouped[month]) grouped[month] = { light: 0, dark: 0 };
          if (tx.type === "INVESTMENT") grouped[month].dark += 1;
          else grouped[month].light += 1;
        });

        const formatted = calendarOrder
          .filter((m) => grouped[m])
          .map((m) => ({
            label: m.slice(0, 3),
            light: grouped[m].light,
            dark: grouped[m].dark,
          }));

        setChartData(formatted);
      } catch (err) {
        console.error("Failed to fetch contributions:", err);
      }
    };

    void fetchData();
  }, [range]);

  const displayedTotal = total ?? count;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-[28px] font-bold leading-none text-gray-900">
            {displayedTotal}
          </div>
          <div className="mt-1.5 text-sm text-gray-400">Contributions</div>
        </div>
        <div className="flex items-center gap-5 text-sm">
          {(
            [
              ["last-year", "Last Year"],
              ["last-6m", "Last 6 Months"],
              ["today", "Today"],
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

      <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
        <BarChart data={chartData} barCategoryGap="20%">
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval="preserveStartEnd"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            width={28}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="light" fill={chartConfig.light.color} radius={[3, 3, 0, 0]} />
          <Bar dataKey="dark" fill={chartConfig.dark.color} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default BarGraph;
