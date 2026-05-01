import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";
import api from "@/utils/api";

type TransactionType = "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE";

interface Transaction {
  id: string;
  organizationId: string;
  contributorId?: string;
  type: TransactionType;
  date: string;
  units?: number;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Fund {
  id: string;
  name: string;
}

interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  organization: { id: string; name: string };
  transactions: Transaction[];
  funds: Fund[];
  updatedAt: string;
}

interface TableData {
  id: string;
  date: string;
  contributor: string;
  fund: string;
  amount: number | null;
  hasTransactions: boolean;
  transactionTypes: TransactionType[];
}

export type ContributorSortBy =
  | "date-desc" | "date-asc"
  | "name-asc" | "name-desc"
  | "amount-desc" | "amount-asc";

export type ContributorFilterBy = "all" | "DONATION" | "INVESTMENT" | "WITHDRAWAL" | "EXPENSE" | "no-transactions";

interface ContributorsTableProps {
  searchQuery?: string;
  refreshToken?: number;
  sortBy?: ContributorSortBy;
  filterBy?: ContributorFilterBy;
}

function ThreeDotsMenu({ contributorId: _contributorId }: { contributorId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="rounded p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
      >
        ⋮
      </button>
      {open && (
        <div
          className="absolute right-0 top-7 z-50 min-w-[140px] rounded-lg bg-white p-1 text-sm"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
        >
          <button
            className="w-full rounded px-3 py-2 text-left hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            View details
          </button>
          <button
            className="w-full rounded px-3 py-2 text-left text-red-500 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

const ContributorsTable: React.FC<ContributorsTableProps> = ({
  searchQuery = "",
  refreshToken = 0,
  sortBy = "date-desc",
  filterBy = "all",
}) => {
  const PAGE_SIZE = 5;
  const router = useRouter();
  const [contributors, setContributors] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContributors();
  }, [refreshToken]);

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/contributors");
      const data = response.data;

      if (data && data.contributors) {
        const mappedData: TableData[] = data.contributors.map((contributor: Contributor) => {
          const hasTransactions = contributor.transactions.length > 0;
          const latestTransaction = hasTransactions
            ? [...contributor.transactions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )[0]
            : null;

          const activityDate = latestTransaction
            ? new Date(latestTransaction.date).toLocaleDateString()
            : new Date(contributor.updatedAt).toLocaleDateString();

          const formattedAmount = latestTransaction
            ? latestTransaction.type === "EXPENSE" || latestTransaction.type === "WITHDRAWAL"
              ? -Math.abs(latestTransaction.amount)
              : Math.abs(latestTransaction.amount)
            : null;

          const fundName = contributor.funds?.length > 0
            ? contributor.funds.map((f) => f.name).join(", ")
            : "—";

          return {
            id: contributor.id,
            date: activityDate,
            contributor: `${contributor.firstName} ${contributor.lastName}`,
            fund: fundName,
            amount: formattedAmount,
            hasTransactions,
            transactionTypes: contributor.transactions.map((t) => t.type),
          };
        });

        setContributors(mappedData);
      }
    } catch (err) {
      console.error("Error fetching contributors:", err);
      setError("Failed to load contributors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredContributors = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    let result = contributors;

    if (filterBy === "no-transactions") {
      result = result.filter((r) => !r.hasTransactions);
    } else if (filterBy !== "all") {
      result = result.filter((r) => r.transactionTypes.includes(filterBy as TransactionType));
    }

    if (q) {
      result = result.filter((r) =>
        [r.date, r.contributor, r.fund, r.amount?.toString() ?? "", r.id]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "name-asc") return a.contributor.localeCompare(b.contributor);
      if (sortBy === "name-desc") return b.contributor.localeCompare(a.contributor);
      if (sortBy === "amount-desc") return (b.amount ?? 0) - (a.amount ?? 0);
      if (sortBy === "amount-asc") return (a.amount ?? 0) - (b.amount ?? 0);
      return 0;
    });
  }, [contributors, searchQuery, sortBy]);

  const columns: Column<TableData>[] = [
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
      Cell: (value) => {
        if (value === null) return <span className="text-gray-400">—</span>;
        return (
          <span style={{ color: value < 0 ? "red" : "green" }}>
            {value < 0 ? "-" : "+"}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(value))}
          </span>
        );
      },
    },
    {
      header: "",
      accessor: "id",
      dataType: "string",
      sortable: false,
      className: "w-8 text-right",
      Cell: (value) => <ThreeDotsMenu contributorId={value} />,
    },
  ];

  if (loading) return <div>Loading contributors...</div>;
  if (error) return <div className="bg-red-100 text-red-700 rounded p-3 text-sm">{error}</div>;

  return (
    <div>
      {searchQuery?.trim() && (
        <div className="mb-4 text-sm">
          {filteredContributors.length === 0
            ? `No contributors found for "${searchQuery}"`
            : `Showing ${filteredContributors.length} contributor${filteredContributors.length !== 1 ? "s" : ""} for "${searchQuery}"`}
        </div>
      )}
      <SimpleTable<TableData>
        data={filteredContributors}
        columns={columns}
        pageSize={PAGE_SIZE}
        onRowClick={(row) => router.push(`/contributors/${row.id}`)}
      />
    </div>
  );
};

export default ContributorsTable;
