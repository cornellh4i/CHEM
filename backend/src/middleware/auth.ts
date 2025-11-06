import type { Request, Response, NextFunction } from "express";
import admin from "../utils/firebase-admin";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.split(" ")[1]
    : undefined;

  if (!token) {
    return res.status(401).json({ error: "Empty Token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Standardize: controllers expect req.auth; keep req.user for backwards compat
    (req as any).auth = decodedToken;
    (req as any).user = decodedToken;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

export default auth;
