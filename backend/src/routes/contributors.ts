// routes/contributors.ts
import { Router } from "express";
import controller from "../controllers/contributors";

const contributorRouter = Router();

// GET all contributors
contributorRouter.get("/", async (req, res) => {
  // TODO: Implement GET all contributors route
  // This should handle query parameters for filtering, sorting, and pagination
  res.status(501).json({ error: "GET all contributors route not implemented" });
});

// GET a single contributor by ID
contributorRouter.get("/:id", async (req, res) => {
  // TODO: Implement GET single contributor route
  res
    .status(501)
    .json({ error: "GET single contributor route not implemented" });
});

// POST a new contributor
contributorRouter.post("/", async (req, res) => {
  // TODO: Implement POST new contributor route
  try {
    //get contributor data from header
    const contributorData = req.body;

    //call createContributor with contributorData
    const newContributor = await controller.createContributor(contributorData);
    //return created contributor
    res.status(201).json(newContributor);
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message });
  }
});

// PUT (update) an existing contributor
contributorRouter.put("/:id", async (req, res) => {
  //get information from header
  const contributorId = req.params.id;
  const contributorData = req.body;

  try {
    //call updateContributor and put the header data
    const updatedContributor = await controller.updateContributor(
      contributorId,
      contributorData
    );
    //return updated contributor
    res.status(200).json(updatedContributor);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

// DELETE a contributor
contributorRouter.delete("/:id", async (req, res) => {
  // TODO: Implement DELETE contributor route
  res.status(501).json({ error: "DELETE contributor route not implemented" });
});

export default contributorRouter;
