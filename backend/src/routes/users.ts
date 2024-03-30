import { Router } from "express";
import { Prisma, Role } from "@prisma/client";
import { ErrorMessage, Users } from "../utils/types";
import controller from "../controllers/users";
import { notify } from "../utils/helpers";

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
  const sort = {
    key: sortQuery ? sortQuery[0] : "default",
    order: (sortQuery ? sortQuery[1] : "asc") as Prisma.SortOrder,
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

userRouter.post("/", (req, res) => {
  res.send(req.body);
});

export default userRouter;
