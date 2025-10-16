import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";

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

type TxRow = {
  id: string;
  date: string;
  contributor?: string;
  contributorId?: string;
  fund: string;
  fundId: string;
  type: string;
  units?: number;
  amount: number;
  restriction?: string;
  documentLink?: string;
  _desc?: string; // for searching description
};

interface TransactionsTableProps {
  tableType: "transactions" | "contributions";
  searchQuery?: string;
}

const API_URL = "http://localhost:8000";

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  tableType,
  searchQuery = "",
}) => {
  const PAGE_SIZE = 5;
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableType]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) {
        const statusText = response.statusText || "Unknown error";
        throw new Error(`HTTP error! Status: ${response.status} ${statusText}`);
      }

      const data = await response.json();

      if (data && data.transactions) {
        const filtered =
          tableType === "contributions"
            ? data.transactions.filter(
                (t: Transaction) =>
                  t.type === "DONATION" || t.type === "INVESTMENT"
              )
            : data.transactions;

        const mapped: TxRow[] = filtered.map((t: Transaction) => ({
          id: t.id,
          date: new Date(t.date).toLocaleDateString(),
          contributor: t.contributor
            ? `${t.contributor.firstName} ${t.contributor.lastName}`
            : `--`,
          contributorId: t.contributorId || undefined,
          fund: t.organization.name,
          fundId: t.organizationId || "",
          type: formatTransactionType(t.type),
          units: t.units || undefined,
          amount:
            t.type === "EXPENSE" || t.type === "WITHDRAWAL"
              ? -Math.abs(t.amount)
              : t.amount,
          restriction: t.organization?.restriction ?? "",
          _desc: t.description ?? "",
        }));

        setTransactions(mapped);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again later.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTransactionType = (type: TransactionType): string =>
    type.charAt(0) + type.slice(1).toLowerCase();

  const getTableTitle = () =>
    tableType === "contributions" ? "Contributions" : "Transactions";

  // ---- robust filtering across fields ----
  const norm = (v: unknown) =>
    (v ?? "").toString().toLowerCase().normalize("NFKD");

  const filteredTransactions = useMemo(() => {
    const q = norm(searchQuery).trim();
    if (!q) return transactions;

    return transactions.filter((t) => {
      const haystack = [
        t.date,
        t.contributor,
        t.fund,
        t.type,
        t.units,
        t.amount,
        t.restriction,
        t._desc,
      ]
        .map(norm)
        .join(" ");
      return haystack.includes(q);
    });
  }, [transactions, searchQuery]);
  // ---------------------------------------

  const columns: Column<TxRow>[] = [
    { header: "Date", accessor: "date", dataType: "date", sortable: true },
    { header: "Contributor", accessor: "contributor", dataType: "string", sortable: true },
    { header: "Fund", accessor: "fund", dataType: "string", sortable: true },
    { header: "Type", accessor: "type", dataType: "string", sortable: true },
    // Insert Units before Amount for transactions view
    ...(tableType === "transactions"
      ? [{ header: "Units", accessor: "units", dataType: "number", sortable: true } as Column<TxRow>]
      : []),
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
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            Math.abs(value)
          )}
        </span>
      ),
    },
  ];

  if (loading) return <div>Loading {getTableTitle().toLowerCase()}...</div>;
  if (error)
    return <div className="bg-red-100 text-red-700 rounded p-3 text-sm">{error}</div>;

  return (
    <div>
      {searchQuery && searchQuery.trim() !== "" && (
        <div className="mb-4 text-sm">
          {filteredTransactions.length === 0
            ? `No results found for "${searchQuery}"`
            : `Showing ${filteredTransactions.length} result${
                filteredTransactions.length !== 1 ? "s" : ""
              } for "${searchQuery}"`}
        </div>
      )}

      <SimpleTable<TxRow> data={filteredTransactions} columns={columns} pageSize={PAGE_SIZE} />
    </div>
  );
};

export default TransactionsTable;
