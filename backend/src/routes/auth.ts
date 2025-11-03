"use client";

import { Router } from "express";
import { signUp, login, logout } from "../controllers/auth";
import auth from "../middleware/auth";

const router = Router();

// middleware
router.post("/signup", auth, signUp);
router.get("/login", auth, login);
router.post("/logout", auth, logout);

export default router;
