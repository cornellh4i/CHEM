import admin from "../utils/firebase";
import type { Request } from "express";
import userController from "./users";
import jwt from "jsonwebtoken";
import "../utils/firebase";
import prisma from "../utils/client";

/**
 * Shape of the payload expected from the auth routes when creating a user.
 * Extend as your sign-up flow evolves (e.g. invite codes, profile fields).
 */
export interface SignUpParams {
  idToken: string; // Firebase (or other IdP) token asserted by the client
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Shape of the payload expected from the auth routes when logging in. Include
 * whatever credentials or tokens your provider issues.
 */
export interface LoginParams {
  idToken: string;
}

/**
 * Normalised auth response the routes can hand back to the client. Add refresh
 * tokens or session metadata if your flow needs them.
 */
export interface AuthResult {
  userId: string;
  organizationId: string;
  token: string;
  refreshToken?: string;
}

/**
 * Persist a newly authenticated user and return the tokens/session info the
 * frontend needs. Implementation should verify the IdP token, create the user
 * row (scoped to the provided organization), and mint an API session/JWT.
 */
const signUp = async (_params: SignUpParams): Promise<AuthResult> => {
  const { idToken, organizationId, firstName, lastName, email } = _params;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUid },
    });
    if (user) {
      throw new Error("User already exists");
    } else {
      const { createUser } = userController;

      const newUser = await createUser({
        organizationId: organizationId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        firebaseUid: firebaseUid,
        role: "USER", //This is hardcoded, not sure how to address this
        // maybe add an extra field in SignUpParams?
      });
      //create jwt token
      const jwt_secret = process.env.JWT_SECRET;
      if (!jwt_secret) {
        throw new Error("JWT_SECRET not in .env");
      }
      const token = jwt.sign(newUser.id, jwt_secret);
      const result: AuthResult = {
        userId: newUser.id,
        organizationId: newUser.organizationId,
        token: token,
      };
      return result;
    }
  } catch (error) {
    console.error("Error during sign up:", error);
    throw new Error("Sign up failed. Please try again.");
  }
};

/**
 * Look up the authenticated user, ensure they belong to an organization, and
 * return a fresh API token/session. Verify the inbound IdP token first.
 */
const login = async (_params: LoginParams): Promise<AuthResult> => {
  throw new Error("login controller not implemented");
};

/**
 * Tear down the user's active session/token (if stored server-side). No-op if
 * you rely entirely on stateless JWTs.
 */
const logout = async (_req: Request): Promise<void> => {
  throw new Error("logout controller not implemented");
};

export default {
  signUp,
  login,
  logout,
};
