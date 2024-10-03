// routes/organizations.ts
import { Router } from "express";
import controller from "../controllers/organizations";

const organizationRouter = Router();

// GET all organizations
organizationRouter.get("/", async (req, res) => {
  // TODO: Implement GET all organizations route
  // This should handle query parameters for filtering, sorting, and pagination
  res
    .status(501)
    .json({ error: "GET all organizations route not implemented" });
});

// GET a single organization by ID
organizationRouter.get("/:id", async (req, res) => {
  // TODO: Implement GET single organization route
  res
    .status(501)
    .json({ error: "GET single organization route not implemented" });
});

// POST a new organization
organizationRouter.post("/", async (req, res) => {
  // TODO: Implement POST new organization route
  res
    .status(501)
    .json({ error: "POST new organization route not implemented" });
});

// PUT (update) an existing organization
organizationRouter.put("/:id", async (req, res) => {
  // Exract information from header
  const orgId = req.params.id;
  const partialOrgData = req.body;

  try {
    // Call updateUser with partial user data
    const updatedOrg = await controller.updateOrganization(
      orgId,
      partialOrgData
    );

    // Return updated user
    res.status(200).json(updatedOrg);
  } catch (error) {
    if (error instanceof Error) {
      // Catch and return errors if any
      res.status(404).json({ error: error.message });
    }
  }

  // TODO: Implement PUT (update) organization route
  res
    .status(501)
    .json({ error: "PUT update organization route not implemented" });
});

// DELETE an organization
organizationRouter.delete("/:id", async (req, res) => {
  // TODO: Implement DELETE organization route
  res.status(501).json({ error: "DELETE organization route not implemented" });
});

export default organizationRouter;
