"use client";

export const dynamic = "force-dynamic";

import { use, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";
import api from "@/utils/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import LaunchIcon from "@mui/icons-material/Launch";

interface Transaction {
  id: string;
  type: "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE";
  date: string;
  amount: number;
  units?: number;
  fund?: { id: string; name: string };
  fundId?: string;
}

interface ContributorDetail {
  id: string;
  firstName: string;
  lastName: string;
  funds: { id: string; name: string }[];
}

interface TableRow {
  id: string;
  date: string;
  contributor: string;
  fund: string;
  amount: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function ContributorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [contributor, setContributor] = useState<ContributorDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [cRes, tRes] = await Promise.all([
          api.get(`/contributors/${id}`),
          api.get(`/transactions/contributors/${id}`),
        ]);
        setContributor(cRes.data);
        setTransactions(tRes.data.transactions ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const donations = useMemo(
    () => transactions.filter((t) => t.type === "DONATION" || t.type === "INVESTMENT"),
    [transactions]
  );

  const oneYearAgo = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d;
  }, []);

  const oneYearDonations = useMemo(
    () => donations.filter((t) => new Date(t.date) >= oneYearAgo),
    [donations, oneYearAgo]
  );

  const oneYearEarnings = useMemo(
    () => oneYearDonations.reduce((s, t) => s + t.amount, 0),
    [oneYearDonations]
  );

  const totalContributions = useMemo(
    () => donations.reduce((s, t) => s + t.amount, 0),
    [donations]
  );

  const startBalance = totalContributions - oneYearEarnings;
  const base = startBalance > 0 ? startBalance : (totalContributions > 0 ? totalContributions : null);
  const oneYearReturn = base !== null && oneYearEarnings !== 0 ? (oneYearEarnings / base) * 100 : null;

  // Build monthly chart data for the last 12 months
  const chartData = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      months[key] = 0;
    }
    oneYearDonations.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString("en-US", { month: "short" });
      if (key in months) months[key] += t.amount;
    });
    // Convert to cumulative
    let cum = 0;
    return Object.entries(months).map(([month, val]) => {
      cum += val;
      return { month, amount: cum };
    });
  }, [oneYearDonations]);

  const tableRows: TableRow[] = useMemo(
    () =>
      [...donations]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((t) => ({
          id: t.id,
          date: new Date(t.date).toLocaleDateString(),
          contributor: contributor
            ? `${contributor.firstName} ${contributor.lastName}`
            : "—",
          fund: t.fund?.name ?? "—",
          amount: t.amount,
        })),
    [donations, contributor]
  );

  const columns: Column<TableRow>[] = [
    { header: "Date", accessor: "date", dataType: "date", sortable: true },
    { header: "Contributor", accessor: "contributor", dataType: "string", sortable: true },
    { header: "Fund", accessor: "fund", dataType: "string", sortable: true },
    {
      header: "Amount",
      accessor: "amount",
      dataType: "number",
      sortable: true,
      headerClassName: "text-right",
      className: "text-right font-medium",
      Cell: (value) => (
        <span style={{ color: value >= 0 ? "green" : "red" }}>
          {value >= 0 ? "+" : "-"}{fmt(Math.abs(value))}
        </span>
      ),
    },
  ];

  if (loading) return <DashboardTemplate><div className="p-8">Loading...</div></DashboardTemplate>;
  if (error || !contributor) return <DashboardTemplate><div className="p-8 text-red-500">{error ?? "Not found"}</div></DashboardTemplate>;

  const name = `${contributor.firstName} ${contributor.lastName}`;

  return (
    <DashboardTemplate>
      <div className="space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button onClick={() => router.push("/contributors")} className="hover:text-gray-600">
            Contributors
          </button>
          <span>›</span>
          <span className="text-gray-600">{name}</span>
        </div>

        {/* Name row */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{name}</h1>
          <button className="text-gray-400 hover:text-gray-600 text-xl">⋯</button>
        </div>


        {/* Total Contributions section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{contributor.firstName}'s Total Contributions</h2>
            <button className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              Export <LaunchIcon fontSize="small" />
            </button>
          </div>

          <div className="flex gap-4">
            {/* Chart card */}
            <div className="flex-1 rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-1 text-sm text-gray-500">Yearly Contributions</div>
              <div className="mb-4 text-2xl font-bold">{fmt(totalContributions)}</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ left: 8, right: 8, top: 4, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Line type="linear" dataKey="amount" stroke="#000" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats cards */}
            <div className="flex w-56 shrink-0 flex-col gap-4">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className={`text-2xl font-bold ${oneYearReturn !== null && oneYearReturn >= 0 ? "text-black" : "text-red-500"}`}>
                  {oneYearReturn !== null
                    ? `${oneYearReturn >= 0 ? "+" : ""}${oneYearReturn.toFixed(2)}%`
                    : "—"}
                </div>
                <div className="mt-1 text-sm text-gray-500">1-Year Return</div>
              </div>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="text-2xl font-bold">{fmt(oneYearEarnings)}</div>
                <div className="mt-1 text-sm text-gray-500">1-Year Earnings</div>
              </div>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="text-2xl font-bold">{fmt(totalContributions)}</div>
                <div className="mt-1 text-sm text-gray-500">1-Year Contributions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution History */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{contributor.firstName}'s Contribution History</h2>
            <button className="flex items-center gap-1 rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              Export <LaunchIcon fontSize="small" />
            </button>
          </div>
          <SimpleTable<TableRow>
            data={tableRows}
            columns={columns}
            pageSize={6}
          />
        </div>

      </div>
    </DashboardTemplate>
  );
}
