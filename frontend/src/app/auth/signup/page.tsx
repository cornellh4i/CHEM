"use client";

import React from "react";
import { LoginTemplate, SignupFormCard } from "@/components";

const SignupPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-700">
      <div>
        <SignupFormCard />
      </div>
    </div>
  );
};

export default SignupPage;
