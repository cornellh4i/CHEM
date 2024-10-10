// routes/organizations.ts
import { Router } from "express";
import controller from "../controllers/organizations";

const organizationRouter = Router();

// GET all organizations
organizationRouter.get("/", async (req, res) => {
  try {
    // Extract filters, sort, and pagination from query parameters. Features allow the client to filter, sort, and paginate the results.
    const filters = {
      name: req.query.name as string,
      restriction: req.query.restriction as string,
      type: req.query.type as string,
    };
    // Extract sort parameters from query parameters- allows sorting by specified field and order.
    const sort = {
      field:
        (req.query.sortBy as "name" | "createdAt" | "units" | "amount") ||
        "name",
      order: (req.query.order as "asc" | "desc") || "asc",
    };
    //Extract pagination parameters from query parameters
    const pagination = {
      skip: Number(req.query.skip) || 0,
      take: Number(req.query.take) || 10,
    };

    // Call getOrganizations with filters, sort, and pagination (fetches organizations from database using filters, sort and pagination)
    const organizations = await controller.getOrganizations(
      filters,
      sort,
      pagination
    );

    //Return organizations
    res.status(501).json(organizations);
  } catch (error) {
    //Handle any errors that occur during fetch process. Respond with status code of 400 if there is error. 
    res.status(400).json({ error: "Failed to get organizations" });
  }
});

// GET a single organization by ID
organizationRouter.get("/:id", async (req, res) => {
  try {
    // Try to extract `id` parameter from the request URL
    const { id } = req.params;
    // Call controller method, which fetches a specific organization by its unique id.
    const organization = await controller.getOrganizationById(id);
    //Check if organization exists. If so, return it in the response with a status code of 200 (OK).
    if (organization) {
      res.status(200).json(organization);
    } else {
      //If not found, return a 404 status code with error message. 
      res.status(404).json({ error: "Organization not found" });
    }
  } catch (error) {
    //Handle any errors that occur during the fetching process and respond with a status code of 400 (Bad Request).
    res.status(400).json({ error: "Failed to get organization" });
  }
});

// POST a new organization
organizationRouter.post("/", async (req, res) => {
  try {
    // Extract organization data
    const organizationData = req.body;

    // Call createOrganization with organizationData
    const newOrganization =
      await controller.createOrganization(organizationData);

    // Return created organization
    res.status(201).json(newOrganization);
  } catch (error) {
    if (error instanceof Error) {
      // Catch and return errors if any
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT (update) an existing organization
organizationRouter.put("/:id", async (req, res) => {
  // Exract information from header
  const orgId = req.params.id;
  const partialOrgData = req.body;

  try {
    // Call updateUser with partial user data
    const updatedOrg = await controller.updateOrganization(
      orgId,
      partialOrgData
    );

    // Return updated user
    res.status(200).json(updatedOrg);
  } catch (error) {
    if (error instanceof Error) {
      // Catch and return errors if any
      res.status(404).json({ error: error.message });
    }
  }
});

// DELETE an organization
organizationRouter.delete("/:id", async (req, res) => {
  // Try to extract the `id` parameter from the request URL
  try {
    // id is captured from the route as a URL parameter (`req.params.id`).
    const { id } = req.params;

    // Call deleteOrganization function from controller
    // Communicates with the database and attempts to delete organization with the given `id`.
    await controller.deleteOrganization(id);

    // Responds with a 204 No Content status if there is successful deletion
    // Means the request was successful but there is no content to return in the response.
    // send() is used to end the response without a message body.
    res.status(204).send();
  } catch (error) {
    // If an error occurs, catch the error here and respond with an HTTP status 400 (Bad Request)
    res.status(400).json({ error: "Failed to delete organization" });
  }
});


export default organizationRouter;
