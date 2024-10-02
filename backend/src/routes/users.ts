import { Router } from "express";
import { Prisma, Role, User } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import controller from "../controllers/users";

const userRouter = Router();

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
