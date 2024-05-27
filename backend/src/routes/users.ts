import { Router } from "express";
import { Prisma, Role, User } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import { notify } from "../utils/helpers";
import controller from "../controllers/users";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  // #swagger.tags = ['Users']

  // Get params
  const filter = {
    email: req.query.email as string,
    firstName: req.query.firstName as string,
    lastName: req.query.lastName as string,
    company: req.query.company as string,
    phone: req.query.phone as string,
    website: req.query.website as string,
    location: req.query.location as string,
    role: req.query.role as Role,
  };
  const sortQuery = (req.query.sort as string)?.split(":");
  const sort = sortQuery && {
    key: sortQuery[0],
    order: sortQuery[1] as Prisma.SortOrder,
  };
  const pagination = {
    after: req.query.after as string,
    limit: req.query.limit as string,
  };

  // Get result
  try {
    const body: Users = await controller.getUsers(filter, sort, pagination);
    res.status(200).send(body);
  } catch (error) {
    const body: ErrorMessage = { error: (error as Error).message };
    res.status(500).send(body);
  }
});

userRouter.get("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']

  try {
    const body: User | null = await controller.getUser(req.params.userid);
    if (body) {
      res.status(200).send(body);
    } else {
      const error: ErrorMessage = { error: "No user found" };
      res.status(404).send(error);
    }
  } catch (error) {
    const body: ErrorMessage = { error: (error as Error).message };
    res.status(500).send(body);
  }
});

userRouter.post("/", async (req, res) => {
  // #swagger.tags = ['Users']
  const { password, ...rest } = req.body;

  try {
    const user = await controller.createUser(rest);
    res.status(201).send(user);
    notify("/users");
  } catch (error) {
    const body: ErrorMessage = { error: (error as Error).message };
    res.status(500).send(body);
  }
});

userRouter.put("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const user = await controller.updateUser(
      req.query.userid as string,
      req.body
    );
    res.status(200).send(user);
    notify(`/users/${req.query.userid}`);
  } catch (error) {
    const body: ErrorMessage = { error: (error as Error).message };
    res.status(500).send(body);
  }
});

userRouter.patch("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const user = await controller.updateUser(
      req.query.userid as string,
      req.body
    );
    res.status(200).send(user);
    notify(`/users/${req.query.userid}`);
  } catch (error) {
    const body: ErrorMessage = { error: (error as Error).message };
    res.status(500).send(body);
  }
});

userRouter.delete("/:userid", async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const user = await controller.deleteUser(req.query.userid as string);
    res.status(200).send(user);
    notify("/users");
  } catch (error) {
    const body: ErrorMessage = { error: (error as Error).message };
    res.status(500).send(body);
  }
});

export default userRouter;
