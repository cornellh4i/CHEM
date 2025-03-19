"use client";
import React from "react";
import { Button, Input } from "@/components";
import { useRouter } from "next/navigation"; // Import Next.js router for navigation

const LoginFormCard = () => {
  const router = useRouter(); // Hook for navigation

  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-8 w-96 font-serif text-4xl text-[#185F96]">Log In</div>
      <div>
        <form>
          <div className="mb-6">
            <Input label="Email address" placeholder="john.doe@company.com" />
          </div>
          <div className="mb-6">
            <Input label="Password" type="password" placeholder="•••••••••" />
          </div>
          <div className="mb-2">
            <Button
              type="submit"
              className="bg-{#3E6DA6} mb-2 me-2 w-full rounded-lg border px-5 py-3 text-sm font-normal text-white hover:bg-grey-dark focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              style={{ backgroundColor: "#3E6DA6" }}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault(); // Prevents form submission
                router.push("/dashboard"); // Navigates to dashboard
              }}
            >
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginFormCard;
