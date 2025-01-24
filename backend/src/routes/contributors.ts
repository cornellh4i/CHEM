import { Router } from "express";
import controller from "../controllers/contributors";
import { ErrorMessage } from "../utils/types";

const contributorRouter = Router();

// GET all contributors
contributorRouter.get("/", async (req, res) => {
  try {
    const filters = {
      firstName: req.query.firstName as string | undefined,
      lastName: req.query.lastName as string | undefined,
      organizationId: req.query.organizationId as string | undefined,
    };
    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "firstName" | "lastName" | "createdAt",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;
    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    const { contributors, total } = await controller.getContributors(
      filters,
      sort,
      pagination
    );
    res.status(200).json({ contributors, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get contributors",
    };
    res.status(500).json(errorResponse);
  }
});

// GET a single contributor by ID
contributorRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contributor = await controller.getContributorById(id);

    if (contributor) {
      res.status(200).json(contributor);
    } else {
      res.status(404).json({ error: "Contributor not found" });
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get contributor",
    };
    res.status(500).json(errorResponse);
  }
});

// POST a new contributor
contributorRouter.post("/", async (req, res) => {
  try {
    const contributorData = req.body;

    if (
      !contributorData.firstName ||
      !contributorData.lastName ||
      !contributorData.organizationId
    ) {
      return res
        .status(400)
        .json({
          error: "First name, last name, and organization ID are required",
        });
    }

    const newContributor = await controller.createContributor(contributorData);
    res.status(201).json(newContributor);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to create contributor",
    };
    res.status(400).json(errorResponse);
  }
});

// PUT (update) an existing contributor
contributorRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const contributorData = req.body;

  try {
    const updatedContributor = await controller.updateContributor(
      id,
      contributorData
    );
    res.status(200).json(updatedContributor);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to update contributor",
    };
    res.status(404).json(errorResponse);
  }
});

// DELETE a contributor
contributorRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContributor = await controller.deleteContributor(id);
    res.status(200).json(deletedContributor);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to delete contributor",
    };
    res.status(400).json(errorResponse);
  }
});

// GET transactions for a specific contributor
contributorRouter.get("/:id/transactions", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the list of transaction amounts for the given contributor ID
    const amounts = await controller.getContributorTransactions(id);

    if (amounts.length > 0) {
      res.status(200).json(amounts);
    } else {
      res.status(404).json({ error: "No transactions found for this contributor" });
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch transactions for the contributor",
    };
    res.status(500).json(errorResponse);
  }
});

export default contributorRouter;
