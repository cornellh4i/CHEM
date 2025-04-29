import { Router } from "express";
import controller from "../controllers/funds";
import { ErrorMessage } from "../utils/types";
import express from "express";

const fundRouter = Router();

// TODO: get all funds
fundRouter.get("/", async (req, res) => {
  // implement route here
});

// TODO: get fund by id
fundRouter.get("/:id", async (req, res) => {
  // implement route here
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
  // implement route here
});

// GET all transactions by fund id
fundRouter.get("/:id/transactions", async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await controller.getFundTransactions(id);

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this fund" });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch fund transactions",
    };
    res.status(500).json(errorResponse);
  }
});

// GET all contributors by fund id
fundRouter.get("/:id/contributors", async (req, res) => {
  try {
    const { id } = req.params;
    const { contributors, total } = await controller.getFundContributors(id);

    res.status(200).json({ contributors, total });
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error:
        error instanceof Error
          ? error.message
          : "Failed to get fund's contributors",
    };

    if (errorResponse.error.includes("Fund not found")) {
      res.status(404).json(errorResponse);
    } else {
      res.status(500).json(errorResponse);
    }
  }
});

export default fundRouter;
