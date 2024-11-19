import request from "supertest";
import app from "../utils/server";
import controller from "../controllers/contributors";

describe("GET /contributors/:id/transactions", () => {
  test("Get transactions for a valid contributor ID", async () => {
    // Mock the controller method to return sample transactions
    const mockTransactions = [100, 200, 300];
    jest
      .spyOn(controller, "getContributorTransactions")
      .mockResolvedValue(mockTransactions);

    const contributorId = "charlie-id"; // Replace with a valid ID
    const response = await request(app).get(
      `/contributors/${contributorId}/transactions`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTransactions);
  });

  test("Get transactions for a contributor with no transactions", async () => {
    // Mock the controller method to return an empty array
    jest.spyOn(controller, "getContributorTransactions").mockResolvedValue([]);

    const contributorId = "valid-contributor-id"; // Replace with a valid ID
    const response = await request(app).get(
      `/contributors/${contributorId}/transactions`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "No transactions found for this contributor"
    );
  });

  test("Get transactions for an invalid contributor ID", async () => {
    // Mock the controller to throw an error for an invalid ID
    jest
      .spyOn(controller, "getContributorTransactions")
      .mockRejectedValue(new Error("Contributor not found"));

    const contributorId = "akshdgah"; // Replace with an invalid ID
    const response = await request(app).get(
      `/contributors/${contributorId}/transactions`
    );

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Contributor not found");
  });
});
