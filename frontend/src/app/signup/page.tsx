"use client";

import React from "react";
import { LoginTemplate, SignupForm } from "@/components";

const SignupPage = () => {
  return (
    <LoginTemplate>
      <div className="mb-8 text-4xl">Sign Up</div>
      <SignupForm />
    </LoginTemplate>
  );
};

export default SignupPage;
