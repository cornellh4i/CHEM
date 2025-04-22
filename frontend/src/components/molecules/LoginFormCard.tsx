"use client";
import React from "react";
import Image from "next/image";
import { Button, Input } from "@/components";
import { useRouter } from "next/navigation";

const LoginFormCard = () => {
  const router = useRouter();

  return (
    <div className="bg-transparent w-96 p-6">
      <div className="mb-6 flex justify-center">
        <img src="/logo.png" alt="Logo" className="max-h-32 w-auto" />
      </div>
      <form>
        <div className="mb-6">
          <Input label="Email address" placeholder="Enter your email..." />
        </div>
        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password..."
          />
        </div>
        <div className="mb-2">
          <Button
            type="submit"
            className="text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2 me-2 w-full rounded-lg border bg-grey-light px-5 py-3 text-sm font-normal hover:bg-grey-dark focus:outline-none focus:ring-4"
            style={{ backgroundColor: "#3E6DA6" }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              router.push("/dashboard");
            }}
          >
            Log in
          </Button>
        </div>

        <div className="text-gray-600 dark:text-gray-300 text-center text-sm">
          Don’t have an account?{" "}
          <Button
            type="button"
            className="text-[#3E6DA6] underline hover:text-[#2b537e]"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginFormCard;
