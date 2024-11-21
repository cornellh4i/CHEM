"use client";
import React, { useState, useEffect } from "react";

// Define the types we need
type Role = "USER" | "ADMIN";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
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

interface Transactions {
  id: string;
  organization: Organization;
  organizationId: string;
  contributor: Contributor;
  contributorId: string;
  date: Date;
  units: number | null,
  amount: number,
  description: string | null;
}

const API_URL = "http://localhost:8000";

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);


  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    email: "",
    firstName: "",
    lastName: "",
    role: "USER",
  });

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
  const [newTransaction, setNewTransaction] = useState<Omit<Transactions, "id" | "organization" | "contributor">>({
    organizationId: "",
    contributorId: "",
    date: new Date(),
    units: null,
    amount: 0,
    description: "",
  });


  useEffect(() => {
    fetchUsers();
    fetchOrganizations().then(() => fetchContributors());
    fetchTransactions();

  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data.result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error("Unexpected transactions data format:", data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setStateFunction: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setStateFunction((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, entity: string) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${entity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          entity === "users"
            ? newUser
            : entity === "contributors"
              ? newContributor
              : newOrganization
        ),
      });
      if (response.ok) {
        if (entity === "users") fetchUsers();
        else if (entity === "contributors") {
          console.log("Contributor created, fetching updated list...");
          await fetchOrganizations(); // Fetch organizations first
          await fetchContributors(); // Then fetch contributors
        } else {
          console.log("Organization created, fetching updated list...");
          await fetchOrganizations();
        }

        // Reset form
        if (entity === "users")
          setNewUser({ email: "", firstName: "", lastName: "", role: "USER" });
        else if (entity === "contributors")
          setNewContributor({
            firstName: "",
            lastName: "",
            organizationId: "",
          });
        else setNewOrganization({ name: "", description: "" });
      } else {
        const errorData = await response.json();
        console.error(`Error creating ${entity.slice(0, -1)}:`, errorData);
      }
    } catch (error) {
      console.error(`Error creating ${entity.slice(0, -1)}:`, error);
    }
  };
  //Transaction Submit Logic 
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (response.ok) {
        console.log("Transaction created successfully");
        setNewTransaction({
          organizationId: "",
          contributorId: "",
          date: new Date(),
          units: null,
          amount: 0,
          description: "",
        });
        fetchTransactions();
      } else {
        const errorData = await response.json();
        console.error("Error creating transaction:", errorData);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };
  // Delete transaction
  const handleTransactionDelete = async (transactionId: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Transaction deleted successfully");
        fetchTransactions();
      } else {
        const errorData = await response.json();
        console.error("Error deleting transaction:", errorData);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

      {/* Users Section */}
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Users</h2>
        <ul className="mb-4 list-disc pl-5">
          {users.map((user) => (
            <li key={user.id}>
              {user.firstName} {user.lastName} ({user.email}) - {user.role}
            </li>
          ))}
        </ul>
        <form onSubmit={(e) => handleSubmit(e, "users")} className="space-y-4">
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={(e) => handleInputChange(e, setNewUser)}
            placeholder="Email"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="firstName"
            value={newUser.firstName}
            onChange={(e) => handleInputChange(e, setNewUser)}
            placeholder="First Name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="lastName"
            value={newUser.lastName}
            onChange={(e) => handleInputChange(e, setNewUser)}
            placeholder="Last Name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={(e) => handleInputChange(e, setNewUser)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
      </section>

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
            onChange={(e) => handleInputChange(e, setNewContributor)}
            placeholder="First Name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="lastName"
            value={newContributor.lastName}
            onChange={(e) => handleInputChange(e, setNewContributor)}
            placeholder="Last Name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <select
            name="organizationId"
            value={newContributor.organizationId}
            onChange={(e) => handleInputChange(e, setNewContributor)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
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
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
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
            onChange={(e) => handleInputChange(e, setNewOrganization)}
            placeholder="Organization Name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="description"
            value={newOrganization.description || ""}
            onChange={(e) => handleInputChange(e, setNewOrganization)}
            placeholder="Description"
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="submit"
            className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          >
            Add Organization
          </button>
        </form>
      </section>
      {/* Transactions Section */}
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">Transactions</h2>
        {transactions.length > 0 ? (
          <ul className="mb-4 list-disc pl-5">
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.description || "No description"} - Amount: {transaction.amount} - Organization:{" "}
                {organizations.find((org) => org.id === transaction.organizationId)?.name || "Unknown"}{" "}
                - Contributor:{" "}
                {contributors.find((cont) => cont.id === transaction.contributorId)?.firstName || "Anonymous"}
                <button
                  className="ml-4 text-red-500"
                  onClick={() => handleTransactionDelete(transaction.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
        <form onSubmit={handleTransactionSubmit} className="space-y-4">
          <select
            name="organizationId"
            value={newTransaction.organizationId}
            onChange={(e) => handleInputChange(e, setNewTransaction)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <select
            name="contributorId"
            value={newTransaction.contributorId}
            onChange={(e) => handleInputChange(e, setNewTransaction)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select Contributor</option>
            {contributors.map((contributor) => (
              <option key={contributor.id} value={contributor.id}>
                {contributor.firstName} {contributor.lastName}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={(e) => handleInputChange(e, setNewTransaction)}
            placeholder="Amount"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="number"
            name="units"
            value={newTransaction.units || ""}
            onChange={(e) => handleInputChange(e, setNewTransaction)}
            placeholder="Units (optional)"
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <input
            type="text"
            name="description"
            value={newTransaction.description || ""}
            onChange={(e) => handleInputChange(e, setNewTransaction)}
            placeholder="Description (optional)"
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </form>
      </section>

    </div>
  );
};

export default Dashboard;
