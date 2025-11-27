import type { Request, Response, NextFunction } from "express";
import admin from "../utils/firebase-admin";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  // Try session cookie first
  const sessionCookie = req.cookies?.session;

  if (sessionCookie) {
    try {
      const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
      (req as any).auth = decodedToken;
      (req as any).user = decodedToken;
      return next();
    } catch (error) {
      // Session cookie invalid, try Bearer token
    }
  }

  // Fallback to Bearer token
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.split(" ")[1]
    : undefined;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).auth = decodedToken;
    (req as any).user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

export default auth;
