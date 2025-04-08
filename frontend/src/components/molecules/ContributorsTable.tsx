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
  date: string;
  contributor: string;
  fund: string;
  amount: number; // Store as a number for sorting
}

const API_URL = "http://localhost:8000";

const ContributorsTable = () => {
  const PAGE_SIZE = 5;
  const [contributors, setContributors] = useState<TableData[]>([]);
  const [organizations, setOrganizations] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations().then(() => fetchContributors());
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_URL}/organizations`);

      if (!response.ok) {
        console.warn(
          "Could not fetch organizations, fund names may not display correctly"
        );
        return;
      }

      const data = await response.json();

      if (data && data.organizations) {
        // Create a lookup map of organization ID to name
        const orgMap: Record<string, string> = {};
        data.organizations.forEach((org: any) => {
          if (org.id && org.name) {
            orgMap[org.id] = org.name;
          }
        });

        setOrganizations(orgMap);
      }
    } catch (err) {
      console.warn("Error fetching organizations:", err);
    }
  };

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

          let fund = "---";
          if (latestTransaction) {
            if (
              latestTransaction.organization &&
              latestTransaction.organization.name
            ) {
              fund = latestTransaction.organization.name;
            } else if (
              latestTransaction.organizationId &&
              organizations[latestTransaction.organizationId]
            ) {
              fund = organizations[latestTransaction.organizationId];
            } else if (
              contributor.organization &&
              contributor.organization.name
            ) {
              fund = contributor.organization.name;
            }
          }

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
            fund: fund,
            amount: formattedAmount,
            hasTransactions: hasTransactions,
          };
        });

        // Sort contributors by date in descending order before setting the state
        const sortedData: TableData[] = mappedData.sort(
          (a: TableData, b: TableData) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
