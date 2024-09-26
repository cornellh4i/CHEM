"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components";

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [catFact, setCatFact] = useState<string>("");

  // TODO 1: Implement fetching and displaying a random cat fact
  const fetchCatFact = async () => {
    try{
      const response = await fetch("https://catfact.ninja/fact");
      const data = await response.json();
      setCatFact(data.fact);
    }
    catch (error){
      console.error("error", error);
    }
  };

  // TODO 2: Implement the button to navigate to auth/secret
  const handleClick = () => {
    router.push("/auth/secret");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6">
          <p className="mb-2 text-lg">Cat Fact: {catFact}</p>
          <Button
            onClick={fetchCatFact}
            className="w-full rounded bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Get Random Cat Fact
          </Button>
        </div>
        {/* TODO 2: Add a button here that when pressed does handleClick */}
        <Button onClick={handleClick}
        className="w-full rounded bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Go to page
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
