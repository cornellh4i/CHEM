"use client";

import React from "react";
import { LoginTemplate, ForgotPasswordForm } from "@/components";

const ForgotPasswordPage = () => {
  return (
    <LoginTemplate>
      <div className="mb-8 text-4xl">Forgot Password</div>
      <p className="mb-8">
        After verifying your email, you will receive instructions on how to
        reset your password. If you continue to experience issues, please
        contact our support team for assistance.
      </p>
      <ForgotPasswordForm />
    </LoginTemplate>
  );
};

export default ForgotPasswordPage;
