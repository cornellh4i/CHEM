import { Router } from "express";
import controller from "../controllers/transactions";
import { ErrorMessage } from "../utils/types";
import { TransactionType } from "@prisma/client";

const transactionRouter = Router();

// GET /transactions - Get all transactions with filters, sorting, and pagination
transactionRouter.get("/", async (req, res) => {
  try {
    // Parse filters from query parameters
    const filters = {
      type: req.query.type as TransactionType | undefined,
      dateFrom: req.query.dateFrom
        ? new Date(req.query.dateFrom as string)
        : undefined,
      dateTo: req.query.dateTo
        ? new Date(req.query.dateTo as string)
        : undefined,
      organizationId: req.query.organizationId as string | undefined,
    };

    // Parse sorting parameters
    const sort = req.query.sortBy
      ? {
          field: req.query.sortBy as "date" | "amount",
          order: (req.query.order as "asc" | "desc") || "asc",
        }
      : undefined;

    // Parse pagination parameters
    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    // Fetch transactions using the controller
    const { transactions, total } = await controller.getTransactions(
      filters,
      sort,
      pagination
    );

    // Return the transactions and total count
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

// GET /transactions/:id - Get a single transaction by ID
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

// TODO: Implement POST /transactions route

// PUT /transactions/:id - Update an existing transaction
transactionRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const transactionData = req.body;

  try {
    const updatedTransaction = await controller.updateTransaction(
      id,
      transactionData
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error ? error.message : "Failed to update transaction",
    };
    res.status(404).json(errorResponse);
  }
});

// TODO: Implement DELETE /transactions/:id route

/* TODO: Implement GET /organizations/:id/transactions route
 * Support query parameters for:
 *  - type filter (DONATION, WITHDRAWAL, etc)
 *  - date range filter (startDate, endDate)
 *  - contributorId filter
 * Support sorting query params:
 *  - sortBy (date, amount)
 *  - order (asc, desc)
 * Support pagination query params:
 *  - skip (default 0)
 *  - take (default 100)
 * Handle error cases:
 *  - 404 if organization not found
 *  - 400 for invalid query params
 *  - 500 for server errors
 * Return {transactions: Transaction[], total: number}
 */

/* TODO: Implement GET /contributors/:id/transactions route
 * Support query parameters for:
 *  - type filter (DONATION, WITHDRAWAL, etc)
 *  - date range filter (startDate, endDate)
 *  - organizationId filter
 * Support sorting query params:
 *  - sortBy (date, amount)
 *  - order (asc, desc)
 * Support pagination query params:
 *  - skip (default 0)
 *  - take (default 100)
 * Handle error cases:
 *  - 404 if contributor not found
 *  - 400 for invalid query params
 *  - 500 for server errors
 * Return {transactions: Transaction[], total: number}
 */

export default transactionRouter;
