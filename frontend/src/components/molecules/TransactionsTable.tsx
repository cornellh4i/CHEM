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
  contributor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  organization?: {
    id: string;
    name: string;
    type: string;
    restriction: string;
  };
}

interface TableData {
  id: string;
  date: string;
  contributor?: string;
  contributorId?: string;
  fund: string;
  fundId?: string;
  type: string;
  units?: number;
  amount: number;
  restriction?: string;
  documentLink?: string;
}

export type TransactionFilterType = "all" | "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE";
export type TransactionSortBy = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "contributor-asc" | "contributor-desc";

interface TransactionsTableProps {
  tableType: "transactions" | "contributions";
  searchQuery?: string;
  fundId?: string;
  fundName?: string;
  filterType?: TransactionFilterType;
  sortBy?: TransactionSortBy;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  tableType,
  searchQuery = "",
  fundId,
  fundName,
  filterType = "all",
  sortBy,
}) => {
  const PAGE_SIZE = 5;
  const [transactions, setTransactions] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [tableType, fundId]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use fund-specific endpoint if fundId is provided
      const endpoint = fundId
        ? `/funds/${fundId}/transactions`
        : `/transactions`;
      const response = await api.get(endpoint);
      const data = response.data;

      // Handle both response formats: { transactions } and { transactions, total }
      const transactionsList = data.transactions || [];

      if (transactionsList && Array.isArray(transactionsList)) {
        const filteredTransactions =
          tableType === "contributions"
            ? transactionsList.filter(
                (t: Transaction) =>
                  t.type === "DONATION" || t.type === "INVESTMENT"
              )
            : transactionsList;

        const mappedData = filteredTransactions.map(
          (transaction: Transaction) => {
            return {
              id: transaction.id,
              date: new Date(transaction.date).toLocaleDateString(),
              contributor: transaction.contributor
                ? `${transaction.contributor.firstName} ${transaction.contributor.lastName}`
                : `--`,
              contributorId: transaction.contributorId || undefined,
              fund:
                (transaction as any).fund?.name || fundName || transaction.organization?.name || "Unknown Fund",
              fundId: transaction.organizationId || undefined,
              type: formatTransactionType(transaction.type),
              units: transaction.units || undefined,
              amount:
                transaction.type === "EXPENSE" ||
                transaction.type === "WITHDRAWAL"
                  ? -Math.abs(transaction.amount) // Ensure it's negative
                  : transaction.amount, // Leave as is for other types
            };
          }
        );

        setTransactions(mappedData);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatTransactionType = (type: TransactionType): string => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const getTableTitle = () => {
    return tableType === "contributions" ? "Contributions" : "Transactions";
  };

  // Normalize the user's search input by trimming spaces and converting to lowercase.
  // If the query is empty, return all transactions without filtering.
  const filteredTransactions = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    const rowText = (t: TableData) =>
      [t.date, t.contributor ?? "", t.fund ?? "", t.type ?? "", t.units?.toString() ?? "", t.restriction ?? "", t.documentLink ?? "", t.id]
        .join("").toLowerCase();

    let result = transactions
      .filter((t) => filterType === "all" || t.type.toUpperCase() === filterType)
      .filter((t) => !q || rowText(t).includes(q));

    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "amount-desc") return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortBy === "amount-asc") return Math.abs(a.amount) - Math.abs(b.amount);
        if (sortBy === "contributor-asc") return (a.contributor ?? "").localeCompare(b.contributor ?? "");
        if (sortBy === "contributor-desc") return (b.contributor ?? "").localeCompare(a.contributor ?? "");
        return 0;
      });
    }

    return result;
  }, [transactions, searchQuery, filterType, sortBy]);

  const getColumns = (): Column<TableData>[] => {
    const baseColumns: Column<TableData>[] = [
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
        header: "Fund",
        accessor: "fund",
        dataType: "string",
        sortable: true,
      },
      {
        header: "Type",
        accessor: "type",
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
        Cell: (value) => (
          <span style={{ color: value < 0 ? "red" : "green" }}>
            {value < 0 ? "-" : "+"}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Math.abs(value))}
          </span>
        ),
      },
    ];

    if (tableType === "transactions") {
      baseColumns.splice(4, 0, {
        header: "Units",
        accessor: "units",
        dataType: "number",
        sortable: true,
      });
      baseColumns.splice(4, 0, {
        header: "Documents",
        accessor: "documentLink",
        dataType: "string",
        sortable: false,
        Cell: (value) =>
          value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm underline">
              Open documents ↗
            </a>
          ) : null,
      });
    }

    return baseColumns;
  };

  const columns = getColumns();

  if (loading) {
    return <div>Loading {getTableTitle().toLowerCase()}...</div>;
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
          {filteredTransactions.length === 0
            ? `No results found for "${searchQuery}"`
            : `Showing ${filteredTransactions.length} result${filteredTransactions.length !== 1 ? "s" : ""} for "${searchQuery}"`}
        </div>
      )}

      <SimpleTable<TableData>
        data={filteredTransactions} // Use the filtered data
        columns={columns}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default TransactionsTable;
