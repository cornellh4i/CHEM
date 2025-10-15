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
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "idToken is required" });
  }

  try {
    const authResult = await controller.login({ idToken });
    return res.status(200).json(authResult);
  } catch (error) {
    // error
    console.error("login error: ", error);
    return res
      .status(401)
      .json({ error: error instanceof Error ? error.message : "Login failed" });
  }
});

// POST /auth/logout → invalidates server-side session if applicable
authRouter.post("/logout", (req, res) => {
  // do nothing as firebase frontend deletes JWT from client
  res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;
