import { Router } from "express";
import controller from "../controllers/transactions";
import { ErrorMessage } from "../utils/types";
import { TransactionType } from "@prisma/client";
import { notify } from "../utils/helpers";
import transactions from "../controllers/transactions";
import auth from "../middleware/auth";
import prisma from "../utils/client";

const transactionRouter = Router();

/**
 * GET /transactions Supports query parameters for filtering by:
 *
 * - Type (e.g. DONATION, WITHDRAWAL, etc)
 * - StartDate and endDate (for date range filtering) Also supports sorting by
 *   date or amount and pagination (skip, take).
 * - Automatically filters by logged-in user's organization
 */
transactionRouter.get("/", auth, async (req, res) => {
  try {
    if (!(req as any).auth) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user's organizationId from database
    const firebaseUid = (req as any).auth.uid;
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { organizationId: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const filters = {
      type: req.query.type as string | undefined,
      organizationId: user.organizationId, // Use logged-in user's organizationId
      fundId: req.query.fundId as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "date" | "amount",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    const { transactions, total } = await controller.getTransactions(
      filters,
      sort,
      pagination
    );
    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get transactions",
    };
    res.status(500).json(errorResponse);
  }
});

/** GET /transactions/:id Retrieves a single transaction by its ID. */
transactionRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await controller.getTransactionById(id);

    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to get transaction",
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * PUT /transactions/:id Updates an existing transaction with the data provided
 * in the request body.
 */
transactionRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTransaction = await controller.updateTransaction(
      id,
      updateData
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to update transaction",
    };
    res.status(400).json(errorResponse);
  }
});

// POST /transactions route
transactionRouter.post("/", async (req, res) => {
  try {
    const transactionData = req.body;

    // Basic validation (units and description are optional)
    if (
      !transactionData.organizationId ||
      !transactionData.contributorId ||
      !transactionData.fundId ||
      !transactionData.type ||
      !transactionData.date ||
      !transactionData.amount
    ) {
      return res.status(400).json({
        error:
          "Transaction organization ID, contributor ID, fund ID, type, date, and amount are required",
      });
    }

    const newTransaction = await controller.createTransaction(transactionData);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
    };
    res.status(400).json(errorResponse);
  }
});

// DELETE /transactions/:id route
transactionRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTransaction = await controller.deleteTransaction(id);
    res.status(200).json(deletedTransaction);
    notify(`/transactions/${id}`);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Error deleting transaction",
    };
    res.status(404).json(errorResponse);
  }
});

/* GET /transactions/:id/organizations route. Retrieves all transactions of an 
organization with organizationId [id] */
transactionRouter.get("/organizations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const filters = {
      type: req.query.type as TransactionType | undefined,
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
          field: req.query.sortBy as "date" | "amount",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : 0,
      take: req.query.take ? Number(req.query.take) : 100,
    };

    const { transactions, total } =
      await controller.getOrganizationTransactions(
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
      if (error.message.includes("Organization not found")) {
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

/* GET /transactions/contributors/:id route. Retrieves all transactions of
a contributor with contributorId [id] */
transactionRouter.get("/contributors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filters = {
      type: req.query.type as string | undefined,
      organizationId: req.query.organizationId as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "date" | "amount",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : 0,
      take: req.query.take ? Number(req.query.take) : 100,
    };

    const { transactions, total } = await controller.getContributorTransactions(
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
      if (error.message.includes("Contributor not found")) {
        statusCode = 404;
      } else if (error.message.includes("Organization not found")) {
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

/* TODO: GET /transactions/funds/:id route. Retrieves all transactions of
a fund with fundId [id] */

export default transactionRouter;
