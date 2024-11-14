"use client";
import { Button } from "@/components";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-center text-6xl font-bold">CHEM</h1>
      <Button
        onClick={() => (window.location.href = "/dashboard")}
        className=""
      >
        Enter Dashboard
      </Button>
    </div>
  );
};

export default Home;
