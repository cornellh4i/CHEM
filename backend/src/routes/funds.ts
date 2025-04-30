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

// POST - create a new fund
fundRouter.post("/", async (req, res) => {
  try {
    const fundData = req.body;
    if (!fundData.name) {
      return res.status(400).json({ error: "Fund name is required" });
    }
    const newFund = await controller.createFund(fundData);
    res.status(201).json(newFund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to create fund",
    };
    res.status(400).json(errorResponse);
  }
});

// PUT - update new fund
fundRouter.put("/:id", async (req, res) => {
  try {
    const updatedFund = await controller.updateFund(req.params.id, req.body);
    res.status(200).json(updatedFund);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Failed to update fund",
    };
    res.status(404).json(errorResponse);
  }
});

// TODO: delete new fund
fundRouter.delete("/:id", async (req, res) => {
  // implement route here
});

// TODO: get all transactions by fund id
fundRouter.delete("/transactions/:id", async (req, res) => {
  // implement route here
});

/// TODO: get all contributors by fund id
fundRouter.delete("/contributors/:id", async (req, res) => {
  // implement route here
});

export default fundRouter;
