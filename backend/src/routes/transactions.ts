import { Router } from "express";
import controller from "../controllers/transactions";
import { ErrorMessage } from "../utils/types";
import { TransactionType } from "@prisma/client";
import { notify } from "../utils/helpers";

const transactionRouter = Router();

// TODO: Implement GET /transactions route

// TODO: Implement GET /transactions/:id route

// TODO: POST /transactions route
transactionRouter.post("/", async (req, res) => {
  try {
    const transactionData = req.body;

    // Basic validation
    if (
      !transactionData.organizationId ||
      !transactionData.contributorId ||
      !transactionData.type ||
      !transactionData.date ||
      !transactionData.units ||
      !transactionData.amount ||
      !transactionData.description
    ) {
      return res.status(400).json({
        error:
          "Transaction organiation ID, contributor ID, type, date, units, amount, and description are required",
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

// TODO: Implement PUT /transactions/:id route

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
