import { Router } from "express";
import { Prisma, Role, User } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import controller from "../controllers/users";
import { notify } from "../utils/helpers";

const userRouter = Router();

// GET all users
userRouter.get("/", async (req, res) => {
  try {
    const filter = {
      email: req.query.email as string | undefined,
      firstName: req.query.firstName as string | undefined,
      lastName: req.query.lastName as string | undefined,
      role: req.query.role as Role | undefined,
    };

    const sort = req.query.sortKey
      ? {
          key: req.query.sortKey as keyof User,
          order: (req.query.sortOrder as "asc" | "desc") || "asc",
        }
      : undefined;

    const pagination = {
      after: req.query.after as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const users: Users = await controller.getUsers(filter, sort, pagination);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "An error occurred while fetching users",
    };
    res.status(500).json(errorResponse);
  }
});

// GET a single user
userRouter.get("/:userid", async (req, res) => {
  const userid = req.params.userid;

  try {
    const user = await controller.getUser(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "An error occurred while fetching user",
    };
    res.status(500).json(errorResponse);
  }
});

// POST a new user
userRouter.post("/", async (req, res) => {
  try {
    const newUser = await controller.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Error creating user",
    };
    res.status(400).json(errorResponse);
  }
});

// PUT (full update) a user
userRouter.put("/:userid", async (req, res) => {
  const userid = req.params.userid;
  const userData = req.body;

  try {
    const updatedUser = await controller.updateUser(userid, userData);
    res.status(200).json(updatedUser);
    notify(`/users/${userid}`);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Error updating user",
    };
    res.status(404).json(errorResponse);
  }
});

// PATCH (partial update) a user
userRouter.patch("/:userid", async (req, res) => {
  const userid = req.params.userid;
  const partialUserData = req.body;

  try {
    const updatedUser = await controller.updateUser(userid, partialUserData);
    res.status(200).json(updatedUser);
    notify(`/users/${userid}`);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Error updating user",
    };
    res.status(404).json(errorResponse);
  }
});

// DELETE a user
userRouter.delete("/:userid", async (req, res) => {
  const userid = req.params.userid;

  try {
    const deletedUser = await controller.deleteUser(userid);
    res.status(200).json(deletedUser);
    notify(`/users/${userid}`);
  } catch (error) {
    console.error(error);
    const errorResponse: ErrorMessage = {
      error: error instanceof Error ? error.message : "Error deleting user",
    };
    res.status(404).json(errorResponse);
  }
});

export default userRouter;