"use client";

import React from "react";
import { LoginForm, LoginFormCard } from "@/components";

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-700">
      <div>
        <LoginFormCard />
      </div>
    </div>
  );
};

export default LoginPage;
