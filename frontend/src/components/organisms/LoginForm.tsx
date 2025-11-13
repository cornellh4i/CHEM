import React, { useState } from "react";
import auth from "@/utils/firebase-client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button, Input, Toast } from "@/components";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

interface FormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  /** React hook form */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Router */
  const router = useRouter();

  /** Simple inline alert for backend failures */
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const friendlyFirebaseMessage = (code?: string, fallback?: string) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      default:
        return fallback || "Login failed. Please try again.";
    }
  };

  /** Handles form submission */
  const onSubmit = async (data: FormInputs): Promise<void> => {
    setAlert(null);
    // Idempotency: ignore if a login attempt is already in-flight
    if (loading) return;
    setLoading(true);
    try {
      // Firebase sign-in to obtain ID token
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // Validate user exists in DB and fetch profile
      await api.get("/auth/login");

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        setAlert(friendlyFirebaseMessage(e.code, e.message));
      } else {
        const msg = (e as any)?.message || "Login failed";
        if (
          typeof msg === "string" &&
          msg.toLowerCase().includes("user not found")
        ) {
          router.push("/signup");
        } else {
          setAlert(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Popup toast for errors */}
      <Toast open={!!alert} onClose={() => setAlert(null)} variant="error">
        {alert}
      </Toast>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <Input
            label="Email address"
            placeholder="Enter your email..."
            error={errors.email?.message}
            {...register("email", {
              required: { value: true, message: "Required" },
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                message: "Invalid email address",
              },
            })}
          />
        </div>
        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password..."
            error={errors.password?.message}
            {...register("password", {
              required: { value: true, message: "Required" },
            })}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-4 me-2 w-full rounded-lg border bg-grey-light px-5 py-3 text-sm font-normal hover:bg-grey-dark focus:outline-none focus:ring-4"
          style={{ backgroundColor: "#3E6DA6" }}
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>
        <div className="text-gray-600 dark:text-gray-300 text-center text-sm">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#3E6DA6] underline hover:text-[#2b537e]"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
