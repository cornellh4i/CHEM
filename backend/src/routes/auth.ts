"use client";

import { Router, Request, Response, NextFunction } from "express";
import { signUp, login, logout } from "../controllers/auth";
import admin from "../utils/firebase-admin";

declare module "express" {
  interface Request {
    auth?: admin.auth.DecodedIdToken;
  }
}

const router = Router();

function extractBearer(header?: string): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractBearer(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: "Empty Token" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.auth = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid Token" });
  }
}

// TODO: replace with middleware functions
router.post("/signup", requireAuth, signUp);
router.get("/login", requireAuth, login);
router.post("/logout", requireAuth, logout);

export default router;
