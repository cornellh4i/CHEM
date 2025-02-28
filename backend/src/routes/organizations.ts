import { Router } from "express";
import controller from "../controllers/organizations";
import { ErrorMessage } from "../utils/types";

const organizationRouter = Router();

// GET all organizations
organizationRouter.get("/", async (req, res) => {
  try {
    // Extract filters, sort, and pagination from query parameters
    const filters = {
      name: req.query.name as string | undefined,
      restriction: req.query.restriction as string | undefined,
      type: req.query.type as string | undefined,
    };
    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "name" | "createdAt" | "units" | "amount",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;
    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    // Fetch organizations from database using filters, sort and pagination
    const { organizations, total } = await controller.getOrganizations(
      filters,
      sort,
      pagination
    );

    // Return organizations with total count
    res.status(200).json({ organizations, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get organizations",
    };
    res.status(500).json(errorResponse);
  }
});

// GET a single organization by ID
organizationRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await controller.getOrganizationById(id);

    if (organization) {
      res.status(200).json(organization);
    } else {
      res.status(404).json({ error: "Organization not found" });
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get organization",
    };
    res.status(500).json(errorResponse);
  }
});

// POST a new organization
organizationRouter.post("/", async (req, res) => {
  try {
    const organizationData = req.body;

    // Basic validation
    if (!organizationData.name) {
      return res.status(400).json({ error: "Organization name is required" });
    }

    const newOrganization =
      await controller.createOrganization(organizationData);
    res.status(201).json(newOrganization);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create organization",
    };
    res.status(400).json(errorResponse);
  }
});

// PUT (update) an existing organization
organizationRouter.put("/:id", async (req, res) => {
  const orgId = req.params.id;
  const organizationData = req.body;

  try {
    const updatedOrg = await controller.updateOrganization(
      orgId,
      organizationData
    );
    res.status(200).json(updatedOrg);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update organization",
    };
    res.status(404).json(errorResponse);
  }
});

// DELETE an organization
organizationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrg = await controller.deleteOrganization(id);
    res.status(200).json(deletedOrg);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
    };
    res.status(400).json(errorResponse);
  }
});

organizationRouter.get("/:id/contributors", async (req, res) => {
  try {
    // Get inputs
    const sortBy = req.query.sortBy as string;
    const order = req.query.order as string;
    const { id } = req.params
    // Validate inputs
    const validSortField = new Set(["firstName", "lastName"]);
    const validOrders = new Set(["asc", "desc"]);

    // Extract sort, and pagination from query parameters
    const sort = sortBy && validSortField.has(sortBy) 
      ? {
          field: sortBy as "firstName" | "lastName",
          order: validOrders.has(order) ? order as "asc" | "desc" : "asc",
        }
      : undefined;
    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    // Fetch contributors from database using sort and pagination
    const { contributors, total } = await controller.getOrganizationContributors(
      id,
      sort,
      pagination
    );

    // Return contributors with total count
    res.status(200).json({ contributors, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get organization's contributors",
    };
    // 404 org not found
    if (errorResponse.error == "Organization not found") { 
      res.status(404).json(errorResponse); 
    }
    else {
      // all other errors
      res.status(500).json(errorResponse);
    }    
  }
});

export default organizationRouter;
