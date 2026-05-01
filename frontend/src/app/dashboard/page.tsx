"use client";

export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import api from "@/utils/api";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import ContributionsGraph from "@/components/molecules/ContributionsGraph";
import BarGraph from "@/components/molecules/BarGraph";
import { ArrowUpRight, Info } from "lucide-react";

interface TopContributor {
  id: string;
  name: string;
  fundName: string;
  amount: number;
  date: string;
}

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  contributor?: { id: string; firstName: string; lastName: string };
  fund?: { id: string; name: string };
}

type ContributorsRange = "last-year" | "last-month" | "today";
type ContributionRange = "last-month" | "last-year" | "all";


function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ExportButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-[#3E6DA6]/40 bg-white px-3.5 py-1.5 text-sm text-[#3E6DA6] hover:bg-[#3E6DA6]/5"
    >
      <ArrowUpRight size={14} />
      Export
    </button>
  );
}

function StatCard({
  value,
  label,
  positive,
}: {
  value: string;
  label: string;
  positive?: boolean;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div
        className={`text-[26px] font-bold leading-tight ${positive ? "text-emerald-600" : "text-gray-900"}`}
      >
        {value}
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-sm text-gray-400">
        {label}
        <Info size={12} className="text-gray-300" />
      </div>
    </div>
  );
}

const DashboardPage = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [contributorsRange, setContributorsRange] =
    useState<ContributorsRange>("last-month");
  const [contributionRange, setContributionRange] =
    useState<ContributionRange>("last-month");
  const [activityRange, setActivityRange] = useState<"last-year" | "last-6m" | "today">("last-year");
  const [activityStats, setActivityStats] = useState({
    total: 0,
    mostActive: "—",
    leastActive: "—",
    median: 0,
    mean: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const txRes = await api.get("/transactions");
        const txList: Transaction[] = txRes.data.transactions ?? [];
        setAllTransactions(txList);

        // Activity stats
        const byMonth: Record<string, number> = {};
        txList.forEach((t) => {
          const key = new Date(t.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          byMonth[key] = (byMonth[key] ?? 0) + 1;
        });
        const entries = Object.entries(byMonth).sort((a, b) => b[1] - a[1]);
        const counts = entries.map(([, v]) => v).sort((a, b) => a - b);
        const median =
          counts.length > 0 ? counts[Math.floor(counts.length / 2)] : 0;
        const mean =
          counts.length > 0
            ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length)
            : 0;

        setActivityStats({
          total: txList.length,
          mostActive: entries[0]?.[0] ?? "—",
          leastActive: entries[entries.length - 1]?.[0] ?? "—",
          median,
          mean,
        });
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    void loadData();
  }, []);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    let cutoff: Date | null = new Date(now);
    if (contributionRange === "last-month") {
      cutoff.setMonth(now.getMonth() - 1);
    } else if (contributionRange === "last-year") {
      cutoff.setFullYear(now.getFullYear() - 1);
    } else {
      cutoff = null;
    }

    const inRange = allTransactions.filter((t) =>
      cutoff ? new Date(t.date) >= cutoff : true,
    );
    const totalAll = allTransactions
      .filter((t) => t.type === "DONATION" || t.type === "INVESTMENT")
      .reduce((sum, t) => sum + t.amount, 0);
    const earnings = inRange
      .filter((t) => t.type === "INVESTMENT")
      .reduce((sum, t) => sum + t.amount, 0);
    const contributions = inRange
      .filter((t) => t.type === "DONATION")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      returnRate:
        totalAll > 0
          ? parseFloat(((earnings / totalAll) * 100).toFixed(2))
          : 0,
      earnings,
      contributions,
    };
  }, [allTransactions, contributionRange]);

  const statLabelPrefix =
    contributionRange === "last-month"
      ? new Date().toLocaleString("default", { month: "long" })
      : contributionRange === "last-year"
        ? "Year"
        : "All-Time";

  const topContributors = useMemo<TopContributor[]>(() => {
    const now = new Date();
    const cutoff = new Date(now);
    if (contributorsRange === "last-year") {
      cutoff.setFullYear(now.getFullYear() - 1);
    } else if (contributorsRange === "last-month") {
      cutoff.setMonth(now.getMonth() - 1);
    } else {
      cutoff.setHours(0, 0, 0, 0);
    }

    const map: Record<
      string,
      { name: string; fundName: string; amount: number; date: string }
    > = {};
    allTransactions
      .filter(
        (t) =>
          t.type === "DONATION" &&
          t.contributor &&
          new Date(t.date) >= cutoff,
      )
      .forEach((t) => {
        const id = t.contributor!.id;
        const name = `${t.contributor!.firstName} ${t.contributor!.lastName}`;
        const fundName = t.fund?.name ?? "Unknown Fund";
        if (!map[id]) map[id] = { name, fundName, amount: 0, date: t.date };
        map[id].amount += t.amount;
      });
    return Object.entries(map)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [allTransactions, contributorsRange]);

  return (
    <DashboardTemplate>
      <div className="-m-8 min-h-[calc(100vh-0px)] p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Your Total Contribution */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Your Total Contribution
            </h2>
            <ExportButton onClick={() => {
              const now = new Date();
              let cutoff: Date | null = new Date(now);
              if (contributionRange === "last-month") cutoff.setMonth(now.getMonth() - 1);
              else if (contributionRange === "last-year") cutoff.setFullYear(now.getFullYear() - 1);
              else cutoff = null;
              const rows = allTransactions
                .filter((t) => (t.type === "DONATION" || t.type === "INVESTMENT") && (cutoff ? new Date(t.date) >= cutoff : true))
                .map((t) => [
                  new Date(t.date).toLocaleDateString(),
                  t.type,
                  t.contributor ? `${t.contributor.firstName} ${t.contributor.lastName}` : "",
                  t.fund?.name ?? "",
                  t.amount.toFixed(2),
                ]);
              downloadCSV("total-contributions.csv", [["Date", "Type", "Contributor", "Fund", "Amount"], ...rows]);
            }} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <ContributionsGraph
                range={contributionRange}
                onRangeChange={setContributionRange}
              />
            </div>
            <div className="flex flex-col gap-4">
              <StatCard
                value={`+${monthlyStats.returnRate}%`}
                label={`${statLabelPrefix} Return`}
                positive
              />
              <StatCard
                value={formatCurrency(monthlyStats.earnings)}
                label={`${statLabelPrefix} Earnings`}
              />
              <StatCard
                value={formatCurrency(monthlyStats.contributions)}
                label={`${statLabelPrefix} Contributions`}
              />
            </div>
          </div>
        </section>

        {/* Your Contributors */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Your Contributors
            </h2>
            <ExportButton onClick={() => {
              const rows = topContributors.map((c) => [c.name, c.fundName, c.amount.toFixed(2)]);
              downloadCSV("top-contributors.csv", [["Name", "Fund", "Total Amount"], ...rows]);
            }} />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Top Contributors
              </span>
              <div className="flex items-center gap-5 text-sm">
                {(
                  [
                    ["last-year", "Last Year"],
                    ["last-month", "Last Month"],
                    ["today", "Today"],
                  ] as [ContributorsRange, string][]
                ).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setContributorsRange(val)}
                    className={
                      contributorsRange === val
                        ? "font-semibold text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {topContributors.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No contribution data for this range.
                </p>
              ) : (
                topContributors.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[15px] font-semibold text-gray-900">
                        {c.name}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-400">
                        {c.fundName}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">
                      +
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(c.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Your Activity Level */}
        <section className="pb-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Your Activity Level
            </h2>
            <ExportButton onClick={() => {
              const now = new Date();
              const cutoff = new Date(now);
              if (activityRange === "last-year") cutoff.setFullYear(now.getFullYear() - 1);
              else if (activityRange === "last-6m") cutoff.setMonth(now.getMonth() - 5);
              else cutoff.setHours(0, 0, 0, 0);
              const byMonth: Record<string, { donations: number; investments: number }> = {};
              allTransactions
                .filter((t) => new Date(t.date) >= cutoff)
                .forEach((t) => {
                  const key = new Date(t.date).toLocaleString("default", { month: "long", year: "numeric" });
                  if (!byMonth[key]) byMonth[key] = { donations: 0, investments: 0 };
                  if (t.type === "DONATION") byMonth[key].donations += 1;
                  else if (t.type === "INVESTMENT") byMonth[key].investments += 1;
                });
              const rows = Object.entries(byMonth).map(([month, v]) => [month, v.donations.toString(), v.investments.toString()]);
              downloadCSV("activity-level.csv", [["Month", "Donations", "Investments"], ...rows]);
            }} />
          </div>
          <BarGraph range={activityRange} onRangeChange={setActivityRange} />
          <div className="mt-4 grid grid-cols-4 gap-4">
            <StatCard value={activityStats.mostActive} label="Most Active" />
            <StatCard value={activityStats.leastActive} label="Least Active" />
            <StatCard value={activityStats.median.toString()} label="Median / month" />
            <StatCard value={activityStats.mean.toString()} label="Mean / month" />
          </div>
        </section>
      </div>
    </DashboardTemplate>
  );
};

export default DashboardPage;
