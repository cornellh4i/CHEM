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

// TODO: get all transactions by fund id
fundRouter.delete("/transactions/:id", async (req, res) => {
  // implement route here
});

/// TODO: get all contributors by fund id
fundRouter.delete("/contributors/:id", async (req, res) => {
  // implement route here
});

export default fundRouter;
