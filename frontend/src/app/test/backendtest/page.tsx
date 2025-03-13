"use client";
import React, { useState, useEffect } from "react";

enum TransactionType {
  DONATION,
  WITHDRAWAL,
  INVESTMENT,
  EXPENSE,
}

interface Contributor {
  id: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  organization: Organization;
}

interface Organization {
  id: string;
  name: string;
  description: string | null;
}
interface Transaction {
  id: string;
  organizationId: string;
  contributorId?: string;
  units?: number;
  description?: string;
  type: TransactionType;
  date: string;
  amount: number;
}

const API_URL = "http://localhost:8000";

const Dashboard = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<
    Contributor[]
  >([]);

  const [newContributor, setNewContributor] = useState<
    Omit<Contributor, "id" | "organization">
  >({
    firstName: "",
    lastName: "",
    organizationId: "",
  });

  const [newOrganization, setNewOrganization] = useState<
    Omit<Organization, "id">
  >({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchOrganizations().then(() => fetchContributors());
  }, []);

  const fetchContributors = async () => {
    try {
      console.log("Fetching contributors...");
      const response = await fetch(`${API_URL}/contributors`);
      console.log("Contributors response status:", response.status);
      const data = await response.json();
      console.log("Contributors data:", data);
      if (Array.isArray(data.contributors)) {
        setContributors(data.contributors);
      } else if (Array.isArray(data)) {
        setContributors(data);
      } else {
        console.error("Unexpected contributors data format:", data);
        setContributors([]);
      }
    } catch (error) {
      console.error("Error fetching contributors:", error);
      setContributors([]);
    }
  };

  const fetchOrganizations = async () => {
    try {
      console.log("Fetching organizations...");
      const response = await fetch(`${API_URL}/organizations`);
      console.log("Organizations response status:", response.status);
      const data = await response.json();
      console.log("Organizations data:", data);
      if (Array.isArray(data.organizations)) {
        setOrganizations(data.organizations);
      } else if (Array.isArray(data)) {
        setOrganizations(data);
      } else {
        console.error("Unexpected organizations data format:", data);
        setOrganizations([]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    }
  };

  const [testHistory, setTestHistory] = useState<
    {
      id: number;
      operation: "CREATE" | "DELETE";
      transactionId?: string;
      data?: any;
      status: "SUCCESS" | "FAILED";
      response: any;
      timestamp: Date;
    }[]
  >([]);

  const [status, setStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const [testCounter, setTestCounter] = useState(1);

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>(
    {
      organizationId: "",
      contributorId: "",
      units: 1,
      description: "",
      type: TransactionType.DONATION,
      date: new Date().toISOString().split("T")[0],
      amount: 0,
    }
  );

  const [lastCreatedId, setLastCreatedId] = useState<string>("");

  const [deleteId, setDeleteId] = useState<string>("");

  useEffect(() => {
    if (newTransaction.organizationId) {
      const filteredContributors = contributors.filter(
        (c) => c.organizationId === newTransaction.organizationId
      );
      setSelectedContributors(filteredContributors);

      if (
        newTransaction.contributorId &&
        !filteredContributors.some((c) => c.id === newTransaction.contributorId)
      ) {
        setNewTransaction((prev) => ({ ...prev, contributorId: "" }));
      }
    } else {
      setSelectedContributors([]);
    }
  }, [newTransaction.organizationId, contributors]);
  const handleSubmit = async (
    e: React.FormEvent,
    type: "organizations" | "contributors"
  ) => {
    e.preventDefault();

    try {
      setStatus({
        message: `Creating ${type === "organizations" ? "organization" : "contributor"}...`,
        isError: false,
      });

      const dataToSend =
        type === "organizations" ? newOrganization : newContributor;
      console.log(`Data to send for ${type}:`, dataToSend);

      const response = await fetch(`${API_URL}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from server for ${type}:`, errorText);
        throw new Error(`Failed to create ${type.slice(0, -1)}: ${errorText}`);
      }

      const responseData = await response.json();

      setStatus({
        message: `${type.slice(0, -1)} created successfully!`,
        isError: false,
      });

      console.log(`${type} created:`, responseData);

      // Reset form
      if (type === "organizations") {
        setNewOrganization({
          name: "",
          description: "",
        });
        // Refetch organizations
        fetchOrganizations();
      } else {
        setNewContributor({
          firstName: "",
          lastName: "",
          organizationId: "",
        });
        // Refetch contributors
        fetchContributors();
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      setStatus({
        message: `Error creating ${type.slice(0, -1)}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        isError: true,
      });
    }
  };

  const handleTransactionInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => {
      if (name === "amount" || name === "units") {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  // For organization form
  const handleOrganizationInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewOrganization((prev) => ({ ...prev, [name]: value }));
  };

  // For contributor form
  const handleContributorInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewContributor((prev) => ({ ...prev, [name]: value }));
  };

  const logTestResult = (
    operation: "CREATE" | "DELETE",
    status: "SUCCESS" | "FAILED",
    response: any,
    transactionId?: string,
    data?: any
  ) => {
    const newEntry = {
      id: testCounter,
      operation,
      transactionId,
      data,
      status,
      response,
      timestamp: new Date(),
    };

    setTestHistory((prev) => [newEntry, ...prev]);
    setTestCounter((prev) => prev + 1);
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus({ message: "Creating transaction...", isError: false });

      const dataToSend = { ...newTransaction };

      console.log("Data to send:", dataToSend);

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        // Log the raw HTML response to help debug
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error(`Failed to create transaction: ${errorText}`);
      }

      // If successful, parse the JSON response
      const responseData = await response.json();

      setStatus({
        message: `Transaction created successfully! ID: ${responseData.id}`,
        isError: false,
      });

      if (responseData.id) {
        setLastCreatedId(responseData.id);
        setDeleteId(responseData.id);
      }

      logTestResult(
        "CREATE",
        "SUCCESS",
        responseData,
        responseData.id,
        dataToSend
      );

      setNewTransaction({
        organizationId: "",
        contributorId: "",
        units: 1,
        description: "",
        type: TransactionType.DONATION,
        date: new Date().toISOString().split("T")[0],
        amount: 0,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      setStatus({
        message: `Error creating transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
        isError: true,
      });

      // Log the failed test
      logTestResult(
        "CREATE",
        "FAILED",
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        undefined,
        newTransaction
      );
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteId) {
      setStatus({
        message: "Please enter a transaction ID to delete",
        isError: true,
      });
      return;
    }

    try {
      setStatus({
        message: `Deleting transaction ${deleteId}...`,
        isError: false,
      });

      const response = await fetch(`${API_URL}/transactions/${deleteId}`, {
        method: "DELETE",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete transaction");
      }

      setStatus({
        message: `Transaction ${deleteId} deleted successfully!`,
        isError: false,
      });

      logTestResult("DELETE", "SUCCESS", responseData, deleteId);

      if (deleteId === lastCreatedId) {
        setLastCreatedId("");
      }

      setDeleteId("");
    } catch (error) {
      console.error(`Error deleting transaction ${deleteId}:`, error);
      setStatus({
        message: `Error deleting transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
        isError: true,
      });

      logTestResult(
        "DELETE",
        "FAILED",
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        deleteId
      );
    }
  };

  const getOrganizationName = (id: string) => {
    const organization = organizations.find((o) => o.id === id);
    return organization ? organization.name : id;
  };

  const getContributorName = (id: string) => {
    const contributor = contributors.find((c) => c.id === id);
    return contributor
      ? `${contributor.firstName} ${contributor.lastName}`
      : id;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Transaction API Tester</h1>

      {status && (
        <div
          className={`mb-4 rounded p-4 ${
          status.isError
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Contributors Section */}
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Contributors</h2>
        {contributors.length > 0 ? (
          <ul className="mb-4 list-disc pl-5">
            {contributors.map((contributor) => {
              const organization = organizations.find(
                (org) => org.id === contributor.organizationId
              );
              return (
                <li key={contributor.id}>
                  {contributor.firstName} {contributor.lastName} - Organization:{" "}
                  {organization ? organization.name : "Unknown"}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No contributors found. {JSON.stringify(contributors)}</p>
        )}
        <form
          onSubmit={(e) => handleSubmit(e, "contributors")}
          className="space-y-4"
        >
          <input
            type="text"
            name="firstName"
            value={newContributor.firstName}
            onChange={handleContributorInputChange}
            placeholder="First Name"
            required
            className="border-gray-300 block w-full rounded-md shadow-sm"
          />
          <input
            type="text"
            name="lastName"
            value={newContributor.lastName}
            onChange={handleContributorInputChange}
            placeholder="Last Name"
            required
            className="border-gray-300 block w-full rounded-md shadow-sm"
          />
          <select
            name="organizationId"
            value={newContributor.organizationId}
            onChange={handleContributorInputChange}
            required
            className="border-gray-300 block w-full rounded-md shadow-sm"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white hover:bg-green-600 rounded px-4 py-2"
          >
            Add Contributor
          </button>
        </form>
      </section>

      {/* Organizations Section */}
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Organizations</h2>
        {organizations.length > 0 ? (
          <ul className="mb-4 list-disc pl-5">
            {organizations.map((org) => (
              <li key={org.id}>
                {org.name} - {org.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No organizations found. {JSON.stringify(organizations)}</p>
        )}
        <form
          onSubmit={(e) => handleSubmit(e, "organizations")}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            value={newOrganization.name}
            onChange={handleOrganizationInputChange}
            placeholder="Organization Name"
            required
            className="border-gray-300 block w-full rounded-md shadow-sm"
          />
          <input
            type="text"
            name="description"
            value={newOrganization.description || ""}
            onChange={handleOrganizationInputChange}
            placeholder="Description"
            className="border-gray-300 block w-full rounded-md shadow-sm"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white hover:bg-purple-600 rounded px-4 py-2"
          >
            Add Organization
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Create Transaction Form */}
        <section className="bg-gray-50 rounded border p-4">
          <h2 className="mb-4 text-xl font-semibold">
            Test Create Transaction
          </h2>
          <form onSubmit={handleCreateTransaction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Organization
                </label>
                <select
                  name="organizationId"
                  value={newTransaction.organizationId}
                  onChange={handleTransactionInputChange}
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Contributor
                </label>
                <select
                  name="contributorId"
                  value={newTransaction.contributorId}
                  onChange={handleTransactionInputChange}
                  required
                  className="w-full rounded border p-2"
                  disabled={!newTransaction.organizationId}
                >
                  <option value="">Select Contributor</option>
                  {selectedContributors.map((contributor) => (
                    <option key={contributor.id} value={contributor.id}>
                      {contributor.firstName} {contributor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Transaction Type
                </label>
                <select
                  name="type"
                  value={newTransaction.type}
                  onChange={handleTransactionInputChange}
                  required
                  className="w-full rounded border p-2"
                >
                  <option value={TransactionType.DONATION}>Donation</option>
                  <option value={TransactionType.WITHDRAWAL}>Withdrawal</option>
                  <option value={TransactionType.INVESTMENT}>Income</option>
                  <option value={TransactionType.EXPENSE}>Expense</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleTransactionInputChange}
                  required
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleTransactionInputChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Units</label>
                <input
                  type="number"
                  name="units"
                  value={newTransaction.units}
                  onChange={handleTransactionInputChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded border p-2"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={newTransaction.description}
                onChange={handleTransactionInputChange}
                required
                className="w-full rounded border p-2"
                rows={3}
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600 rounded px-4 py-2"
            >
              Create Transaction
            </button>
          </form>
        </section>

        {/* Delete Transaction Test */}
        <section className="bg-gray-50 rounded border p-4">
          <h2 className="mb-4 text-xl font-semibold">
            Test Delete Transaction
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Transaction ID to Delete
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteId}
                  onChange={(e) => setDeleteId(e.target.value)}
                  placeholder="Enter transaction ID"
                  className="flex-1 rounded border p-2"
                />

                {lastCreatedId && (
                  <button
                    type="button"
                    onClick={() => setDeleteId(lastCreatedId)}
                    className="bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
                    title="Use the last created transaction ID"
                  >
                    Use Last
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleDeleteTransaction}
              disabled={!deleteId}
              className="bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 rounded px-4 py-2 disabled:cursor-not-allowed"
            >
              Delete Transaction
            </button>

            {lastCreatedId && (
              <p className="text-gray-600 text-sm">
                Last created transaction ID:{" "}
                <span className="font-mono">{lastCreatedId}</span>
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Test History Log */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Test Results History</h2>
        {testHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="bg-white min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Timestamp</th>
                  <th className="border px-4 py-2">Operation</th>
                  <th className="border px-4 py-2">Transaction ID</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((test) => (
                  <tr
                    key={test.id}
                    className={`hover:bg-gray-50 ${
                      test.status === "SUCCESS" ? "bg-green-50" : "bg-red-50" }`}
                  >
                    <td className="border px-4 py-2">{test.id}</td>
                    <td className="border px-4 py-2">
                      {test.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="border px-4 py-2 font-medium">
                      {test.operation}
                    </td>
                    <td className="border px-4 py-2 font-mono">
                      {test.transactionId || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`rounded px-2 py-1 ${
                          test.status === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {test.status}
                      </span>
                    </td>
                    <td className="max-w-xs overflow-hidden border px-4 py-2">
                      <details>
                        <summary className="cursor-pointer">
                          View Details
                        </summary>
                        <div className="bg-gray-100 mt-2 max-h-40 overflow-auto rounded p-2">
                          {test.operation === "CREATE" && test.data && (
                            <div className="mb-2">
                              <p className="font-semibold">Request Data:</p>
                              <pre className="whitespace-pre-wrap text-xs">
                                {JSON.stringify(
                                  {
                                    ...test.data,
                                    organizationName: test.data.organizationId
                                      ? getOrganizationName(
                                          test.data.organizationId
                                        )
                                      : "-",
                                    contributorName: test.data.contributorId
                                      ? getContributorName(
                                          test.data.contributorId
                                        )
                                      : "-",
                                  },
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          )}
                          <p className="font-semibold">Response:</p>
                          <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(test.response, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No tests have been run yet.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;