// transactions.test.ts

import request from "supertest";
import app from "../utils/server";
import prisma from "../utils/client";
import { TransactionType } from "@prisma/client";

describe("Transaction Routes", () => {
  let transactionId: string;

  beforeAll(async () => {
    // Optionally, seed the database with test data
    // For example, create a test transaction
    const transaction = await prisma.transaction.create({
      data: {
        organization: {
          create: {
            name: "Test Organization",
          },
        },
        type: TransactionType.DONATION,
        date: new Date(),
        amount: 100,
      },
    });
    transactionId = transaction.id;
  });

  afterAll(async () => {
    // Clean up the database after tests
    await prisma.transaction.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.$disconnect();
  });

  describe("GET /transactions", () => {
    it("should get all transactions", async () => {
      const res = await request(app).get("/transactions");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("transactions");
      expect(res.body).toHaveProperty("total");
      expect(Array.isArray(res.body.transactions)).toBeTruthy();
    });

    it("should filter transactions by type", async () => {
      const res = await request(app)
        .get("/transactions")
        .query({ type: TransactionType.DONATION });

      expect(res.statusCode).toEqual(200);
      expect(
        res.body.transactions.every(
          (t: any) => t.type === TransactionType.DONATION
        )
      ).toBeTruthy();
    });

    it("should sort transactions by amount", async () => {
      const res = await request(app)
        .get("/transactions")
        .query({ sortBy: "amount", order: "asc" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.transactions);
    });
  });

  describe("GET /transactions/:id", () => {
    it("should get a transaction by ID", async () => {
      const res = await request(app).get(`/transactions/${transactionId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", transactionId);
    });

    it("should return 404 if transaction not found", async () => {
      const res = await request(app).get("/transactions/nonexistent-id");

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Transaction not found");
    });
  });

  describe("PUT /transactions/:id", () => {
    it("should update a transaction", async () => {
      const updatedData = {
        amount: 200,
        description: "Updated transaction",
      };

      const res = await request(app)
        .put(`/transactions/${transactionId}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("amount", updatedData.amount);
      expect(res.body).toHaveProperty("description", updatedData.description);
    });

    it("should return 404 if transaction to update is not found", async () => {
      const res = await request(app)
        .put("/transactions/nonexistent-id")
        .send({ amount: 300 });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Transaction not found");
    });
  });
});
