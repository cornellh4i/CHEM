// routes/funds.js
import { Router } from "express";
import controller from "../controllers/funds";
import { ErrorMessage } from "../utils/types";
import { FundType } from "@prisma/client";

const fundRouter = Router();

// GET /funds - Get all funds with filtering, sorting, and pagination
fundRouter.get("/", async (req, res) => {
  try {
    const filters = {
      type: req.query.type as string | undefined,
      organizationId: req.query.organizationId as string | undefined,
    };

    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "createdAt" | "amount",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    const { funds, total } = await controller.getFunds(
      filters,
      sort,
      pagination
    );
    res.status(200).json({ funds, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to get funds",
    };
    res.status(500).json(errorResponse);
  }
});

// GET /funds/:id - Get a single fund by ID
fundRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fund = await controller.getFundById(id);

    if (fund) {
      res.status(200).json(fund);
    } else {
      res.status(404).json({ error: "Fund not found" });
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to get fund",
    };
    res.status(500).json(errorResponse);
  }
});

// GET /funds/:id/transactions - Get all transactions for a fund
fundRouter.get("/:id/transactions", async (req, res) => {
  try {
    const { id } = req.params;

    const filters = {
      type: req.query.type as string | undefined,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      contributorId: req.query.contributorId as string | undefined,
    };

    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "date" | "amount" | "units",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : 0,
      take: req.query.take ? Number(req.query.take) : 100,
    };

    const { transactions, total } = await controller.getFundTransactions(
      id,
      filters,
      sort,
      pagination
    );
    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error(error);

    let statusCode = 500;
    let errorMsg =
      "Failed to get transactions: " +
      (error instanceof Error ? error.message : "Unknown Error");

    if (error instanceof Error) {
      if (error.message.includes("Fund not found")) {
        statusCode = 404;
      } else if (error.message.includes("Invalid Date Format")) {
        statusCode = 400;
      }
    }

    const errorResponse: ErrorMessage = {
      error: errorMsg,
    };

    res.status(statusCode).json(errorResponse);
  }
});

// GET /funds/:id/contributors - Get all contributors for a fund
fundRouter.get("/:id/contributors", async (req, res) => {
  try {
    const { id } = req.params;

    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "firstName" | "lastName" | "createdAt",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : 0,
      take: req.query.take ? Number(req.query.take) : 100,
    };

    const { contributors, total } = await controller.getFundContributors(
      id,
      sort,
      pagination
    );

    res.status(200).json({ contributors, total });
  } catch (error) {
    console.error(error);

    let statusCode = 500;
    let errorMsg =
      "Failed to get contributors: " +
      (error instanceof Error ? error.message : "Unknown Error");

    if (error instanceof Error && error.message.includes("Fund not found")) {
      statusCode = 404;
    }

    const errorResponse: ErrorMessage = {
      error: errorMsg,
    };

    res.status(statusCode).json(errorResponse);
  }
});

// Placeholder route stubs
fundRouter.post("/", async (req, res) => {
  // Implementation for creating a new fund
});

fundRouter.put("/:id", async (req, res) => {
  // Implementation for updating a fund
});

fundRouter.delete("/:id", async (req, res) => {
  // Implementation for deleting a fund
});

export default fundRouter;
