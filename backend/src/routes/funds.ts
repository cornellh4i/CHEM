import { Router } from "express";
import controller from "../controllers/funds";
import { ErrorMessage } from "../utils/types";
import auth from "../middleware/auth";
import express from "express";

const fundRouter = Router();

// GET all funds
fundRouter.get("/", auth, async (req, res) => {
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
fundRouter.get("/:id", auth, async (req, res) => {
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

// POST /funds
fundRouter.post("/", auth, async (req, res) => {
  try {
    const fundData = req.body;

    // Basic validation
    if (!fundData.organizationId || !fundData.type) {
      return res.status(400).json({ error: "organizationId and type are required" });
    }

    // Normalize type for safety
    if (typeof fundData.type === "string") {
      fundData.type = fundData.type.toUpperCase();
    }

    // If endowment and restricted, purpose is required
    if (fundData.type === "ENDOWMENT" && fundData.restriction === true) {
      if (!fundData.purpose || !String(fundData.purpose).trim()) {
        return res.status(400).json({ error: "Purpose is required for restricted endowment funds." });
      }
    }

    const newFund = await controller.createFund(fundData);
    return res.status(201).json(newFund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to create fund",
    };
    return res.status(400).json(errorResponse);
  }
});

// TODO: update new fund
fundRouter.put("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const fundData = req.body;
    const updatedFund = await controller.updateFund(id, fundData);
    res.status(200).json(updatedFund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to update fund",
    };
    // If fund not found
    if (errorResponse.error === "Fund not found") {
      res.status(404).json(errorResponse);
    } else {
      res.status(400).json(errorResponse);
    }
  }
});

fundRouter.delete("/:id", auth, async (req, res) => {
  try {
    const fund = await controller.deleteFundById(req.params.id);
    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }
    res.status(200).json({ message: "Fund deleted" });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to delete fund",
    };
    res.status(500).json(errorResponse);
  }
});

fundRouter.get("/:id/transactions", auth, async (req, res) => {
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

/// TODO: get all contributors by fund id, Krish & Johnny
fundRouter.get("/:id/contributors", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const sortBy = req.query.sortBy as string | undefined;
    const order = req.query.order as string | undefined;
    const validSortField = new Set(["firstName", "lastName"]);
    const validOrders = new Set(["asc", "desc"]);

    const sort =
      sortBy && validSortField.has(sortBy)
        ? {
          field: sortBy as "firstName" | "lastName",
          order: validOrders.has(order ?? "")
            ? (order as "asc" | "desc")
            : "asc",
        }
        : undefined;

    const pagination = {
      skip: req.query.skip ? Number(req.query.skip) : undefined,
      take: req.query.take ? Number(req.query.take) : undefined,
    };

    const { contributors, total } = await controller.getContributorsByFundId(
      id,
      sort,
      pagination
    );
    res.status(200).json({ contributors, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get fund contributors",
    };
    if (errorResponse.error == "Fund not found") {
      res.status(404).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
});

export default fundRouter;
