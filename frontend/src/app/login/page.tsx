"use client";

import React from "react";
import { LoginTemplate, LoginForm } from "@/components";

const LoginPage = () => {
  return (
    <LoginTemplate>
      <div className="mb-8 text-4xl">Log In</div>
      <LoginForm />
    </LoginTemplate>
  );
};

export default LoginPage;
