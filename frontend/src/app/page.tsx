"use client";
import type { NextPage } from "next";
import LoginFormCard from "@/components/molecules/LoginFormCard";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoginFormCard />
    </div>
  );
};

export default Home;
