import request from "supertest";
import app from "../utils/server";
import controller from "../controllers/users";

describe("Sanity check", () => {
  test("Ensure tests run", async () => {
    expect(true).toBe(true);
  });
});

describe("GET /users", () => {
  test("Get all users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body.result.length > 0).toBe(true);
  });
});

describe("GET /users/:userid", () => {
  test("Get a valid user", async () => {
    const user = (await controller.getUsers()).result[0];
    const response = await request(app).get(`/users/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  test("Get an invalid user", async () => {
    const response = await request(app).get("/users/asdf");
    expect(response.status).toBe(404);
  });
});
