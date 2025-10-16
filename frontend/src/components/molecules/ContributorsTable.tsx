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
  organization: { id: string; name: string };
}

interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  organization?: { id: string; name: string };
  transactions: Transaction[];
  updatedAt: string;
}

type ContributorRow = {
  id: string;
  date: string;
  contributor: string;
  fund: string;
  amount: number | null;
  hasTransactions: boolean;
};

interface ContributorsTableProps {
  searchQuery?: string;
}

const API_URL = "http://localhost:8000";

const ContributorsTable: React.FC<ContributorsTableProps> = ({
  searchQuery = "",
}) => {
  const PAGE_SIZE = 5;
  const [contributors, setContributors] = useState<ContributorRow[]>([]);
  const [organizations, setOrganizations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations().then(() => fetchContributors());
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await fetch(`${API_URL}/organizations`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.organizations) {
        const map: Record<string, string> = {};
        data.organizations.forEach((o: any) => {
          if (o.id && o.name) map[o.id] = o.name;
        });
        setOrganizations(map);
      }
    } catch {
      /* non-fatal */
    }
  };

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/contributors`);
      if (!res.ok) {
        const statusText = res.statusText || "Unknown error";
        throw new Error(`HTTP error! Status: ${res.status} ${statusText}`);
      }
      const data = await res.json();

      if (data?.contributors) {
        const rows: ContributorRow[] = data.contributors.map((c: Contributor) => {
          const hasTx = c.transactions.length > 0;
          const lastTx = hasTx ? c.transactions[c.transactions.length - 1] : null;

          const date = lastTx
            ? new Date(lastTx.date).toLocaleDateString()
            : new Date(c.updatedAt).toLocaleDateString();

          let fund = "---";
          if (lastTx?.organization?.name) fund = lastTx.organization.name;
          else if (lastTx?.organizationId && organizations[lastTx.organizationId])
            fund = organizations[lastTx.organizationId];
          else if (c.organization?.name) fund = c.organization.name;

          const amount = lastTx
            ? lastTx.type === "EXPENSE" || lastTx.type === "WITHDRAWAL"
              ? -Math.abs(lastTx.amount)
              : Math.abs(lastTx.amount)
            : null;

          return {
            id: c.id,
            date,
            contributor: `${c.firstName} ${c.lastName}`,
            fund,
            amount,
            hasTransactions: hasTx,
          };
        });

        // newest first
        rows.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setContributors(rows);
      } else {
        setContributors([]);
      }
    } catch (err) {
      console.error("Error fetching contributors:", err);
      setError("Failed to load contributors. Please try again later.");
      setContributors([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- robust filtering across fields ----
  const norm = (v: unknown) =>
    (v ?? "").toString().toLowerCase().normalize("NFKD");

  const filteredContributors = useMemo(() => {
    const q = norm(searchQuery).trim();
    if (!q) return contributors;

    return contributors.filter((c) => {
      const haystack = [
        c.contributor,
        c.fund,
        c.date,
        c.amount,
        c.hasTransactions ? "has transactions" : "no transactions",
      ]
        .map(norm)
        .join(" ");
      return haystack.includes(q);
    });
  }, [contributors, searchQuery]);
  // ---------------------------------------

  const columns: Column<ContributorRow>[] = [
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
        if (value === null || value === undefined) {
          return <span className="text-gray-500">No Transactions Found</span>;
        }
        return (
          <span style={{ color: value < 0 ? "red" : "green" }}>
            {value < 0 ? "-" : "+"}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
              Math.abs(value)
            )}
          </span>
        );
      },
    },
  ];

  if (loading) return <div>Loading contributors...</div>;
  if (error)
    return <div className="bg-red-100 text-red-700 rounded p-3 text-sm">{error}</div>;

  return (
    <div>
      {searchQuery && searchQuery.trim() !== "" && (
        <div className="mb-4 text-sm">
          {filteredContributors.length === 0
            ? `No contributors found for "${searchQuery}"`
            : `Showing ${filteredContributors.length} contributor${
                filteredContributors.length !== 1 ? "s" : ""
              } for "${searchQuery}"`}
        </div>
      )}

      <SimpleTable<ContributorRow>
        data={filteredContributors}
        columns={columns}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default ContributorsTable;
