import { Router } from "express";
import { signUp, login, session, logout, checkEmail } from "../controllers/auth";
import auth from "../middleware/auth";

const router = Router();

router.post("/session", session);

// middleware
router.post("/signup", auth, signUp);
router.get("/login", auth, login);

// public existence check by email
router.get("/check-email", checkEmail);
router.post("/logout", auth, logout);

export default router;
