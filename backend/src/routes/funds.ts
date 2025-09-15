import { Router } from "express";
import controller from "../controllers/funds";
import { ErrorMessage } from "../utils/types";
import express from "express";

const fundRouter = Router();

// GET all funds
fundRouter.get("/", async (req, res) => {
  try {
    const funds = await controller.getFunds();
    res.status(200).json({ funds });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to get funds",
    };
    res.status(500).json(errorResponse);
  }
});

// GET a single fund by id
fundRouter.get("/:id", async (req, res) => {
  try {
    const fund = await controller.getFundById(req.params.id);
    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }
    res.status(200).json(fund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to get fund",
    };
    res.status(500).json(errorResponse);
  }
});

// TODO: create new fund
fundRouter.post("/", async (req, res) => {
  // implement route here
});

// TODO: update new fund
fundRouter.put("/:id", async (req, res) => {
  // implement route here
});

// TODO: delete new fund
fundRouter.delete("/:id", async (req, res) => {
  try {
    const fund = await controller.deleteFundById(req.params.id);
    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }
    res.status(200).json({ message : "Fund deleted"});
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to delete fund",
    };
    res.status(500).json(errorResponse);
  }
});


// TODO: get all transactions by fund id
fundRouter.get("/:id/transactions", async (req, res) => {
  try {
    // Get inputs
    const sortBy = req.query.sortBy as string;
    const order = req.query.order as string;
    const { id } = req.params;
    // Validate inputs
    const validSortField = new Set(["date", "amount"]);
    const validOrders = new Set(["asc", "desc"]);

    // Extract sort, and pagination from query parameters
    const sort =
      sortBy && validSortField.has(sortBy)
        ? {
            field: sortBy as "date" | "amount",
            order: validOrders.has(order) ? (order as "asc" | "desc") : "asc",
          }
        : undefined;
    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    // Fetch contributors from database using sort and pagination
    const { transactions, total } = await controller.getTransactionsByFundId(
      id,
      sort,
      pagination
    );

    // Return contributors with total count
    res.status(200).json({ transactions, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get funds's transactions",
    };
    // 404 org not found
    if (errorResponse.error == "Fund not found") {
      res.status(404).json(errorResponse);
    } else {
      // all other errors
      res.status(500).json(errorResponse);
    }
  }
});

/// TODO: get all contributors by fund id

export default fundRouter;
