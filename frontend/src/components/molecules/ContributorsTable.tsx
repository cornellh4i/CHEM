import * as React from "react";
import { useState, useEffect } from "react";
import { SimpleTable, Column } from "@/components/molecules/SimpleTable";

interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  organization: {
    id: string;
    name: string;
  };
  transactions: { amount: number }[];
  updatedAt: string;
}

interface TableData {
  id: string;
  name: string;
  recentActivity: string;
  amount: string;
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

      if (data && data.contributors) {
        const mappedData = data.contributors.map(
          (contributor: Contributor) => ({
            id: contributor.id,
            name: `${contributor.firstName} ${contributor.lastName}`,
            recentActivity: new Date(
              contributor.updatedAt
            ).toLocaleDateString(),
            // ,
            // amount:
            //   contributor.transactions.length > 0
            //     ? `$${contributor.transactions[contributor.transactions.length - 1].amount.toFixed(2)}`
            //     : "---",
          })
        );

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
      dataType: "string",
      sortable: true,
      className: "text-right font-medium",
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
