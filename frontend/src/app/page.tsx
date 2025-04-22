"use client";
import { Button } from "@/components";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-center text-6xl font-bold">CHEM</h1>
      <div className="flex flex-row gap-4">
        <Button onClick={() => (window.location.href = "/dashboard")}>
          Enter Dashboard
        </Button>
        <Button onClick={() => (window.location.href = "/login")}>
          Login or Signup
        </Button>
      </div>
    </div>
  );
};

export default Home;
