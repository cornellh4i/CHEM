import * as React from "react";
import { useState, useEffect } from "react";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

interface TableData {
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
}

const API_URL = "http://localhost:8000";

const TransactionsTable = () => {
  const PAGE_SIZE = 5;
  const [transactions, setTransactions] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/transactions`);

      const responseContributorObject = await fetch(`${API_URL}/contributors`);

      if (!response.ok) {
        const statusText = response.statusText || "Unknown error";
        throw new Error(`HTTP error! Status: ${response.status} ${statusText}`);
      }

      const data = await response.json();

      console.log("Fetched transactions: ", data);

      if (data && data.transactions) {
        // const mappedData = data.transactions.map(
        //   (transaction: Transaction) => ({
        //     id: transaction.id,
        //     date: new Date(transaction.date).toLocaleDateString(),
        //     contributor: transaction.contributor,
        //     // ? `${transaction.contributor.firstName} ${transaction.contributor.lastName}`
        //     // : "---",
        //     contributorId: transaction.contributorId || undefined,
        //     fund: transaction.organization,
        //     fundId: transaction.organizationId,
        //     type: formatTransactionType(transaction.type),
        //     units: transaction.units || undefined,
        //     amount: transaction.amount,

        //   })

        // );
        const mappedData = data.transactions.map((transaction: Transaction) => {
          console.log("Transaction:", transaction); // Log the full transaction
          console.log("Contributor Field:", transaction.contributor); // Log only contributor
          console.log("Organization Field:", transaction.organization);

          return {
            id: transaction.id,
            date: new Date(transaction.date).toLocaleDateString(),
            contributor: transaction.contributor, // Should log correctly
            contributorId: transaction.contributorId || undefined,
            fund: transaction.organization,
            fundId: transaction.organizationId,
            type: formatTransactionType(transaction.type),
            units: transaction.units || undefined,
            amount: transaction.amount,
          };
        });

        console.log("Mapped transactions:", mappedData); // Debugging step

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
      header: "Units",
      accessor: "units",
      dataType: "number",
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
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Math.abs(value))}
        </span>
      ),
    },
  ];

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 rounded p-3 text-sm">{error}</div>
    );
  }

  return (
    <div>
      <SimpleTable<TableData>
        data={transactions}
        columns={columns}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default TransactionsTable;
