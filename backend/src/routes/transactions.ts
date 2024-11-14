import { Router } from "express";
import controller from "../controllers/transactions";
import { ErrorMessage } from "../utils/types";
import { TransactionType } from "@prisma/client";

const transactionRouter = Router();

// TODO: Implement GET /transactions route

// TODO: Implement GET /transactions/:id route

// TODO: Implement POST /transactions route

// TODO: Implement PUT /transactions/:id route

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
