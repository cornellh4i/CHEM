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
  const userid = req.params.userid;
  const userData = req.body;

  try {
    const updatedUser = await controller.updateUser(userid, userData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
});

userRouter.patch("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  const userid = req.params.userid;
  const partialUserData = req.body;

  try {
    const updatedUser = await controller.updateUser(userid, partialUserData);

    res.status(200).json(updatedUser);

    notify(`/users/${userid}`);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
});

userRouter.delete("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  // TODO: Implement DELETE /users/:userid route
  // - Extract userid from req.query
  // - Call controller.deleteUser with userid
  // - Send deleted user as response
  // - Call notify function with "/users"
  // - Handle errors and send error response if necessary
});

export default userRouter;
