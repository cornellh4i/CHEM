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
  // implement route here
});

export default fundRouter;
