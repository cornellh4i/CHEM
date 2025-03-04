import request from "supertest";
import app from "../app";

describe("GET /organizations/:id/transactions", () => {
  it("should return transactions for a valid organization", async () => {
    const organizationId = "some-existing-org-id"; // Replace with real id in test DB
    const response = await request(app).get(
      `/organizations/${organizationId}/transactions`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Optional: Check schema of response (amount, date, etc.)
  });
});

describe("GET /contributors/:id/transactions", () => {
  it("should return transactions for a valid contributor", async () => {
    const contributorId = "some-existing-contributor-id"; // Replace with real id in test DB
    const response = await request(app).get(
      `/contributors/${contributorId}/transactions`
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
