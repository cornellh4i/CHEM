// routes/organizations.ts
import { Router } from "express";
import controller from "../controllers/organizations";

const organizationRouter = Router();

// GET all organizations
organizationRouter.get("/", async (req, res) => {
  try {
    // Extract filters, sort, and pagination from query parameters
    const filters = {
      name: req.query.name as string,
      restriction: req.query.restriction as string,
      type: req.query.type as string,
    };
    const sort = {
      field:
        (req.query.sortBy as "name" | "createdAt" | "units" | "amount") ||
        "name",
      order: (req.query.order as "asc" | "desc") || "asc",
    };
    const pagination = {
      skip: Number(req.query.skip) || 0,
      take: Number(req.query.take) || 10,
    };

    // Call getOrganizations with filters, sort, and pagination
    const organizations = await controller.getOrganizations(
      filters,
      sort,
      pagination
    );

    //Return organizations
    res.status(501).json(organizations);
  } catch (error) {
    //Return error if any
    res.status(400).json({ error: "Failed to get organizations" });
  }
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
  try {
    // Extract organization data
    const organizationData = req.body;

    // Call createOrganization with organizationData
    const newOrganization =
      await controller.createOrganization(organizationData);

    // Return created organization
    res.status(201).json(newOrganization);
  } catch (error) {
    if (error instanceof Error) {
      // Catch and return errors if any
      res.status(400).json({ error: error.message });
    }
  }
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
});

// DELETE an organization
organizationRouter.delete("/:id", async (req, res) => {
  // TODO: Implement DELETE organization route
  res.status(501).json({ error: "DELETE organization route not implemented" });
});

export default organizationRouter;
