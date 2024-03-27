import { Router, Request, Response } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello from a subrouter");
});

userRouter.post("/", (req, res) => {
  res.send(req.body);
});

export default userRouter;
