import type { Request } from "express";
import jwt from "jsonwebtoken";
import admin from "../utils/firebase";
import prisma from "../utils/client";

/**
 * Shape of the payload expected from the auth routes when creating a user.
 * Extend as your sign-up flow evolves (e.g. invite codes, profile fields).
 */
export interface SignUpParams {
  idToken: string; // Firebase (or other IdP) token asserted by the client
  organizationId: string;
  profile?: {
    email?: string;
    displayName?: string;
  };
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
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Persist a newly authenticated user and return the tokens/session info the
 * frontend needs. Implementation should verify the IdP token, create the user
 * row (scoped to the provided organization), and mint an API session/JWT.
 */
const signUp = async (_params: SignUpParams): Promise<AuthResult> => {
  throw new Error("signUp controller not implemented");
};

/**
 * Look up the authenticated user, ensure they belong to an organization, and
 * return a fresh API token/session. Verify the inbound IdP token first.
 */
const login = async (_params: LoginParams): Promise<AuthResult> => {
  try {
    // throw error if bad/expired token
    const decodedToken = await admin.auth().verifyIdToken(_params.idToken);

    // look up user in db
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      select: {
        id: true,
        organizationId: true,
        firebaseUid: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // generate JWT token for API access - 30 day expiry
    const token = jwt.sign(
      {
        userId: user.id,
        firebaseUid: user.firebaseUid,
        organizationId: user.organizationId,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    const result: AuthResult = {
      userId: user.id,
      organizationId: user.organizationId,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };

    return result;
  } catch (error) {
    throw new Error(
      `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

/**
 * Tear down the user's active session/token (if stored server-side). No-op if
 * you rely entirely on stateless JWTs.
 */
const logout = async (_req: Request): Promise<void> => {
  // stateless JWTs logout is handled client-side by deleting the token
  // frontend should call Firebase auth directly, no server-side cleanup needed
  console.log("User logged out successfully");
  return Promise.resolve();
};

export default {
  signUp,
  login,
  logout,
};
