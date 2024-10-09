// routes/users.ts
import { Router } from "express";
import { Prisma, Role, User } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import controller from "../controllers/users";
import { notify } from "../utils/helpers";

const userRouter = Router();

// GET all users
userRouter.get("/", async (req, res) => {
  try {
    // get the flter, sort, and pagination parameters from the req.query object
    const filter = {
      email: req.query.email as string,
      firstName: req.query.firstName as string,
      lastName: req.query.lastName as string,
      role: req.query.role as Role,
    };

    // extract variables for sort and pagination
    const sort = {
      key: req.query.sortKey as string,
      order: req.query.sortOrder
        ? (req.query.sortOrder as Prisma.SortOrder)
        : Prisma.SortOrder.asc,
    };

    const pagination = {
      after: req.query.after as string,
      limit: req.query.limit as string,
    };

    // call the get users function from controller with the parameters
    const users: Users = await controller.getUsers(filter, sort, pagination);

    // send the users as a success json response
    res.status(200).json(users);
  } catch (error) {
    // caught error in process
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: "An error occurred while fetching users",
    };
    res.status(500).json(errorResponse);
  }
});

userRouter.get("/:userid", async (req, res) => {
  // get the userid
  const userid = req.params.userid;

  try {
    // call the getuser function from controller
    const user = await controller.getUser(userid);

    // user not found
    if (!user) {
      const errorResponse: ErrorMessage = { error: "User not found" };
      return res.status(404).json(errorResponse);
    }

    // else return success json response
    res.status(200).json(user);
  } catch (error) {
    // error in process
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: "An error occurred while fetching user",
    };
  }
});

// POST a new user
userRouter.post("/", async (req, res) => {
  // #swagger.tags = ['Users']
  // TODO: Implement POST /users route
  // - Extract user data from req.body

  try {
    const newUser = controller.createUser(req.body);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: "Error creating user" });
  }
});

userRouter.put("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  // Extract information from header
  const userid = req.params.userid;
  const userData = req.body;

  try {
    // Call the updateUser controller function to update the user with the given id
    const updatedUser = await controller.updateUser(userid, userData);

    if (!updatedUser) {
      // If no user is found, return 404 Not Found
      return res.status(404).json({ error: "User not found" });
    }
    // Send the updated user as the response
    res.status(200).json(updatedUser);

    // Call notify function
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      // Return error message if error
      res.status(404).json({ error: error.message });
    }
  }
});

userRouter.patch("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  // Exract information from header
  const userid = req.params.userid;
  const partialUserData = req.body;

  try {
    // Call updateUser with partial user data
    const updatedUser = await controller.updateUser(userid, partialUserData);

    // Return updated user
    res.status(200).json(updatedUser);

    // Call notify
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      // Catch and return errors if any
      res.status(404).json({ error: error.message });
    }
  }
});

userRouter.delete("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  // Extract userid from req.query
  const userid = req.params.userid;

  try {
    // Call controller.deleteUser to delete the user with userid
    const deletedUser = await controller.deleteUser(userid);

    // Send deleted user as the response
    res.status(200).json(deletedUser);

    // Call notify function with "/users"
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      // Handle errors and send error response
      res.status(404).json({ error: error.message });
    }
  }
});

export default userRouter;
