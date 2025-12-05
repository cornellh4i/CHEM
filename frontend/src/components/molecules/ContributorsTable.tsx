import * as React from "react";
import { useState, useEffect, useMemo } from "react";
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
  contributor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  organization: {
    id: string;
    name: string;
    type: string;
    restriction: string;
  };
}

interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  organization: {
    id: string;
    name: string;
  };
  transactions: Transaction[];
  updatedAt: string;
}

interface TableData {
  id: string;
  date: string;
  contributor: string;
  amount: number | null; // Store as a number for sorting
  hasTransactions: boolean;
}

interface ContributorsTableProps {
  searchQuery?: string; // New prop to filter by contributor name
  refreshToken?: number; // bump this value to force a refetch
}

const ContributorsTable: React.FC<ContributorsTableProps> = ({
  searchQuery = "", // Default to empty string if not provided
  refreshToken = 0,
}) => {
  const PAGE_SIZE = 5;
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
      console.log("Fetched", data);

      if (data && data.contributors) {
        const mappedData = data.contributors.map((contributor: Contributor) => {
          const hasTransactions = contributor.transactions.length > 0;
          const latestTransaction = hasTransactions
            ? contributor.transactions[contributor.transactions.length - 1]
            : null;

          const activityDate = latestTransaction
            ? new Date(latestTransaction.date).toLocaleDateString()
            : new Date(contributor.updatedAt).toLocaleDateString();

          const formattedAmount = latestTransaction
            ? latestTransaction.type === "EXPENSE" ||
              latestTransaction.type === "WITHDRAWAL"
              ? -Math.abs(latestTransaction.amount)
              : Math.abs(latestTransaction.amount)
            : null;

          return {
            id: contributor.id,
            date: activityDate,
            contributor: `${contributor.firstName} ${contributor.lastName}`,
            amount: formattedAmount, // Will be null when no transactions
            hasTransactions: hasTransactions,
          };
        });

        // Sort contributors by date in descending order before setting the state
        const sortedData: TableData[] = mappedData.sort(
          (a: TableData, b: TableData) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setContributors(sortedData); // Update state with sorted data
      }
    } catch (err) {
      console.error("Error fetching contributors:", err);
      setError("Failed to load contributors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Enables “search anything” on the table:
  // normalize the query, and if present, build a combined text string per row
  // (date, name, fund, amount, status, id) and keep rows that contain the query.
  const filteredContributors = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return contributors;

    const rowText = (r: TableData) => {
      const amountStr =
        r.amount === null || r.amount === undefined
          ? "no transactions found"
          : (() => {
              const sign = r.amount < 0 ? "-" : "+";
              const amt = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.abs(r.amount));
              return `${sign}${amt}`;
            })();

      return [
        r.date,
        r.contributor,
        amountStr,
        r.hasTransactions ? "has transactions" : "no transactions",
        r.id,
      ]
        .join(" ")
        .toLowerCase();
    };

    return contributors.filter((r) => rowText(r).includes(q));
  }, [contributors, searchQuery]);

  const columns: Column<TableData>[] = [
    {
      header: "Date",
      accessor: "date",
      dataType: "date",
      sortable: true,
    },
    {
      header: "Contributor",
      accessor: "contributor",
      dataType: "string",
      sortable: true,
    },
    {
      header: "Amount",
      accessor: "amount",
      dataType: "number",
      sortable: true,
      headerClassName: "text-right",
      className: "text-right font-medium",
      Cell: (value) => {
        if (value === null) {
          return <span className="text-gray-500">No Transactions Found</span>;
        }

        return (
          <span style={{ color: value < 0 ? "red" : "green" }}>
            {value < 0 ? "-" : "+"}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Math.abs(value))}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading contributors...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 rounded p-3 text-sm">{error}</div>
    );
  }

  return (
    <div>
      {/* Display search results message if filtering */}
      {searchQuery && searchQuery.trim() !== "" && (
        <div className="mb-4 text-sm">
          {filteredContributors.length === 0
            ? `No contributors found for "${searchQuery}"`
            : `Showing ${filteredContributors.length} contributor${filteredContributors.length !== 1 ? "s" : ""} for "${searchQuery}"`}
        </div>
      )}

      <SimpleTable<TableData>
        data={filteredContributors} // Use the filtered data
        columns={columns}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default ContributorsTable;
