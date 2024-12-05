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

// GET contributors for a specific organization
organizationRouter.get("/:id/contributors", async (req, res) => {
  try {
    const { id } = req.params;

    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "firstName" | "lastName",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? parseInt(req.query.skip as string, 10) : undefined,
      take: req.query.take ? parseInt(req.query.take as string, 10) : undefined,
    };

    const contributors = await controller.getOrganizationContributors(
      id,
      sort,
      pagination
    );

    res.status(200).json(contributors);
  } catch (error) {
    console.error(error);
    const errorResponse = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get contributors for the organization",
    };
    res.status((error as any).status || 500).json(errorResponse);
  }
});

// POST a contributor to a specific organization
organizationRouter.post("/:id/contributors", async (req, res) => {
  try {
    const { id } = req.params;
    const { contributorId } = req.body;

    if (!contributorId) {
      return res
        .status(400)
        .json({ error: "Contributor ID is required to add a contributor" });
    }

    const link = await controller.addContributorToOrganization(
      id,
      contributorId
    );

    res.status(201).json(link);
  } catch (error) {
    console.error(error);
    const errorResponse = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to add contributor to the organization",
    };
    res.status((error as any).status || 500).json(errorResponse);
  }
});

export default organizationRouter;
