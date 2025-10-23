"use client";

import { useState } from "react";
import { signUpThenLoginFlow } from "./test_auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import auth, { __authMarker } from "@/utils/firebase-client";

const apiBase =
  process.env.NEXT_PUBLIC_BASE_URL_SERVER ?? "http://localhost:8000";

export default function AuthFlowDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function run() {
    setLoading(true);
    setResult("");
    try {
      const data = await signUpThenLoginFlow(apiBase, {
        email: `test-${Date.now()}@example.com`,
        password: "StrongPass123!",
        firstName: "Test",
        lastName: "User",
        organizationName: "Test Org",
      });
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <button
        onClick={() => {
          run();
        }}
        disabled={loading}
      >
        {loading ? "Running…" : "Run signup/login flow"}
      </button>
      {result && (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{result}</pre>
      )}
    </main>
  );
}
