// routes/users.ts
import { Router } from "express";
import controller from "../controllers/users";

const userRouter = Router();

// GET all users
userRouter.get("/", async (req, res) => {
  // TODO: Implement GET all users route
  // This should handle query parameters for filtering, sorting, and pagination
  res.status(501).json({ error: "GET all users route not implemented" });
});

// GET a single user by ID
userRouter.get("/:id", async (req, res) => {
  // TODO: Implement GET single user route
  res.status(501).json({ error: "GET single user route not implemented" });
});

// POST a new user
userRouter.post("/", async (req, res) => {
  // TODO: Implement POST new user route
  res.status(501).json({ error: "POST new user route not implemented" });
});

// PUT (update) an existing user
userRouter.put("/:id", async (req, res) => {
  // TODO: Implement PUT (update) user route
  res.status(501).json({ error: "PUT update user route not implemented" });
});

// DELETE a user
userRouter.delete("/:id", async (req, res) => {
  // TODO: Implement DELETE user route
  res.status(501).json({ error: "DELETE user route not implemented" });
});

export default userRouter;
