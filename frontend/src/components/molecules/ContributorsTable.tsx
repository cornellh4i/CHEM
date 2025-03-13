import * as React from "react";
import { useState, useEffect } from "react";
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
  name: string;
  recentActivity: string;
  amount: number; // Store as a number for sorting
}

const API_URL = "http://localhost:8000";

const ContributorsTable = () => {
  const PAGE_SIZE = 5;
  const [contributors, setContributors] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/contributors`);

      if (!response.ok) {
        const statusText = response.statusText || "Unknown error";
        throw new Error(`HTTP error! Status: ${response.status} ${statusText}`);
      }

      const data = await response.json();
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
              ? -Math.abs(latestTransaction.amount) // Ensure negative
              : Math.abs(latestTransaction.amount) // Ensure positive
            : null; // Use null to indicate no transactions

          return {
            id: contributor.id,
            name: `${contributor.firstName} ${contributor.lastName}`,
            amount: formattedAmount, // Will be null when no transactions
            hasTransactions: hasTransactions,
            recentActivity: activityDate,
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

  const columns: Column<TableData>[] = [
    {
      header: "Name",
      accessor: "name",
      dataType: "string",
      sortable: true,
    },
    {
      header: "Recent Activity",
      accessor: "recentActivity",
      dataType: "date",
      sortable: true,
    },
    {
      header: "Amount",
      accessor: "amount",
      dataType: "number",
      sortable: true,
      headerClassName: "text-right",
      className: "text-right font-medium",
      Cell: (value, rowData) => {
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
      <SimpleTable<TableData>
        data={contributors}
        columns={columns}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default ContributorsTable;
