"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import auth from "@/utils/firebase-client";

type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "USER" | "ADMIN";
  organizationName: string;
  organizationDescription?: string;
};

export async function signUpThenLoginFlow(apiBase: string, input: SignUpInput) {
  const {
    email,
    password,
    firstName,
    lastName,
    role = "USER",
    organizationName,
    organizationDescription,
  } = input;

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken();

  const signupResp = await fetch(`${apiBase}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      firstName,
      lastName,
      role,
      organizationName,
      organizationDescription,
    }),
  });
  if (!signupResp.ok) {
    const err = await signupResp.json().catch(() => ({}));
    throw new Error(
      `Signup failed: ${signupResp.status} ${JSON.stringify(err)}`
    );
  }
  const signup = await signupResp.json();

  const loginUser = await signInWithEmailAndPassword(auth, email, password);
  const loginToken = await loginUser.user.getIdToken();

  // 4) Call backend login (fetch the profile)
  const loginResp = await fetch(`${apiBase}/auth/login`, {
    headers: { Authorization: `Bearer ${loginToken}` },
  });
  if (!loginResp.ok) {
    const err = await loginResp.json().catch(() => ({}));
    throw new Error(`Login failed: ${loginResp.status} ${JSON.stringify(err)}`);
  }
  const login = await loginResp.json(); // { user }

  return { signup, login };
}
