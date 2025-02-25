import { Router } from "express";
import controller from "../controllers/transactions";
import { ErrorMessage } from "../utils/types";

const transactionRouter = Router();

/**
 * GET /transactions
 * Supports query parameters for filtering by:
 *  - type (e.g. DONATION, WITHDRAWAL, etc)
 *  - organizationId
 *  - startDate and endDate (for date range filtering)
 * Also supports sorting by date or amount and pagination (skip, take).
 */
transactionRouter.get("/", async (req, res) => {
  try {
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
        error instanceof Error
          ? error.message
          : "Failed to get transactions",
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * GET /transactions/:id
 * Retrieves a single transaction by its ID.
 */
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
        error instanceof Error
          ? error.message
          : "Failed to get transaction",
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * PUT /transactions/:id
 * Updates an existing transaction with the data provided in the request body.
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
        error instanceof Error
          ? error.message
          : "Failed to update transaction",
    };
    res.status(400).json(errorResponse);
  }
});

export default transactionRouter;