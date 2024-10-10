// routes/contributors.ts
import { Router } from "express";
import controller from "../controllers/contributors";
import prisma from "../utils/client";

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

  // get id from req body
  const { id } = req.params;
  try {
    // try controller function getContributorById
    const contributor = await controller.getContributorById(id);

    // if not found return 404 not found error
    if (!contributor) {
      res.status(404).json({ error: "Contributor not found" });

      // else return the response json
    } else {
      res.json(contributor);
    }

    // catch the error
  } catch (error) {
    res.status(500).json({ error: "Error fetching contributor by ID" });
  }
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
  const { id } = req.params;
  try {
    const contributor = await controller.deleteContributor(id);
    return res.status(200).json(contributor);
  } catch (error) {
    //this allows us to get the propagated Prisma error message
    if (error instanceof Error) {
      return res.status(400).json(error.message);
    } else {
      return res.status(400).json("Couldn't delete user");
    }
  }
});

export default contributorRouter;
