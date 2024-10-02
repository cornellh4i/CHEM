import { Router } from "express";
import { Prisma, Role, User } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import { notify } from "../utils/helpers";
import controller from "../controllers/users";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  // #swagger.tags = ['Users']
  // TODO: Implement GET /users route
  // - Extract filter, sort, and pagination parameters from req.query
  // - Call controller.getUsers with extracted parameters
  // - Send appropriate response based on the result
  // - Handle errors and send error response if necessary
});

userRouter.get("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  // TODO: Implement GET /users/:userid route
  // - Extract userid from req.params
  // - Call controller.getUser with userid
  // - Send appropriate response based on the result
  // - Handle case where no user is found (404 error)
  // - Handle other errors and send error response if necessary
});

userRouter.post("/", async (req, res) => {
  // #swagger.tags = ['Users']
  // TODO: Implement POST /users route
  // - Extract user data from req.body
  // - Call controller.createUser with extracted data
  // - Send created user as response
  // - Call notify function with "/users"
  // - Handle errors and send error response if necessary
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
