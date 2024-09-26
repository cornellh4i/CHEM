import { Router } from "express";
import { Prisma, Role, User } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import { notify } from "../utils/helpers";
import controller from "../controllers/users";

const userRouter = Router();

//hi

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
  // TODO: Implement PUT /users/:userid route
  // - Extract userid from req.query and user data from req.body
  // - Call controller.updateUser with userid and user data
  // - Send updated user as response
  // - Call notify function with "/users/{userid}"
  // - Handle errors and send error response if necessary
});

userRouter.patch("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  // TODO: Implement PATCH /users/:userid route
  // - Extract userid from req.query and partial user data from req.body
  // - Call controller.updateUser with userid and partial user data
  // - Send updated user as response
  // - Call notify function with "/users/{userid}"
  // - Handle errors and send error response if necessary
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
