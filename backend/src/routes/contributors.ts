// routes/contributors.ts
import { Router } from "express";
import controller from "../controllers/contributors";

const contributorRouter = Router();

// GET all contributors
contributorRouter.get("/", async (req, res) => {
  // TODO: Implement GET all contributors route
  // This should handle query parameters for filtering, sorting, and pagination
  res.status(501).json({ error: "GET all contributors route not implemented" });
});

// GET a single contributor by ID
contributorRouter.get("/:id", async (req, res) => {
  // TODO: Implement GET single contributor route
  res
    .status(501)
    .json({ error: "GET single contributor route not implemented" });
});

// POST a new contributor
contributorRouter.post("/", async (req, res) => {
  // TODO: Implement POST new contributor route
  res.status(501).json({ error: "POST new contributor route not implemented" });
});

// PUT (update) an existing contributor
contributorRouter.put("/:id", async (req, res) => {
  // TODO: Implement PUT (update) contributor route
  res
    .status(501)
    .json({ error: "PUT update contributor route not implemented" });
});

// DELETE a contributor
contributorRouter.delete("/:id", async (req, res) => {
  // TODO: Implement DELETE contributor route
  res.status(501).json({ error: "DELETE contributor route not implemented" });
});

export default contributorRouter;
