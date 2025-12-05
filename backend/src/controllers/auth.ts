import type { Request, Response } from "express";
import admin from "../utils/firebase-admin";
import prisma from "../utils/client";
// validates JSONs
import { z } from "zod";
import { Role } from "@prisma/client";

declare module "express" {
  interface Request {
    auth?: admin.auth.DecodedIdToken;
  }
}

// --- validation ---
const signUpBody = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.nativeEnum(Role).default(Role.USER),
  organizationName: z.string().min(1),
  organizationDescription: z.string().optional(),
});

// sign up controller, creates new user and new org in database
export const signUp = async (req: Request, res: Response) => {
  if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
  const { uid: firebaseUid, email } = req.auth;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email missing on Firebase token" });
    }

    const parsed = signUpBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const {
      firstName,
      lastName,
      role,
      organizationName,
      organizationDescription,
    } = parsed.data;

    // Prevent duplicate signup
    const existing = await prisma.user.findUnique({ where: { firebaseUid } });
    if (existing) {
      return res
        .status(409)
        .json({ error: "User already exists. Use /auth/login." });
    }

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          description: organizationDescription,
          // units/amount have defaults
        },
      });

      const user = await tx.user.create({
        data: {
          firebaseUid,
          email,
          firstName,
          lastName,
          role,
          organizationId: organization.id,
        },
        include: { organization: true },
      });

      return { user, organization };
    });

    return res.status(201).json(result);
  } catch (e: any) {
    const status = e?.status ?? 500;
    return res.status(status).json({ error: e?.message ?? "Sign up failed" });
  }
};

// login controller that takes in firebaseUid, finds corresponding user in database and returns the corresponding user
export const login = async (req: Request, res: Response) => {
  if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
  const { uid: firebaseUid } = req.auth;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: { organization: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Complete /auth/signup first." });
    }

    return res.json({ user });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return res.status(status).json({ error: e?.message ?? "Login failed" });
  }
};

// check if a user exists in the database by email (public endpoint)
export const checkEmail = async (req: Request, res: Response) => {
  const email = (req.query.email as string) || (req.body && req.body.email);
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ exists: true });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return res.status(status).json({ error: e?.message ?? "Check failed" });
  }
};

// logout controller: revokes user's refresh tokens, logout on all devices
export const logout = async (req: Request, res: Response) => {
  if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
  const { uid } = req.auth;
  try {
    await admin.auth().revokeRefreshTokens(uid);
    // clear session cookie during logout
    res.clearCookie("session");
    return res
      .status(200)
      .json({ success: true, message: "Logged out (tokens revoked)" });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return res.status(status).json({ error: e?.message ?? "Logout failed" });
  }
};

export const session = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "idToken is required" });

  try {
    // verify the ID token
    await admin.auth().verifyIdToken(idToken);

    // create session cookie
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // in 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // set cookie as HttpOnly
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(401).json({ error: e?.message ?? "Invalid ID token" });
  }
};