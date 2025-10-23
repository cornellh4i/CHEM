import { Router } from "express";
import controller from "../controllers/auth";
import { ErrorMessage } from "../utils/types";

const authRouter = Router();

// POST /auth/signup → verifies IdP token, provisions user, returns app token
authRouter.post("/signup", async (req, res) => {
  // TODO
});

// POST /auth/login → validates IdP token, returns refreshed app token/session
authRouter.post("/login", async (req, res) => {
  // TODO
});

// POST /auth/logout → invalidates server-side session if applicable
authRouter.post("/logout", async (req, res) => {
  // TODO
});

export default authRouter;
