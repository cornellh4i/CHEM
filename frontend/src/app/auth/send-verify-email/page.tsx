"use client";

import React from "react";
import { LoginTemplate, VerifyEmailForm } from "@/components";

const SendVerifyEmailPage = () => {
  return (
    <LoginTemplate>
      <div className="mb-8 text-4xl">Verify Email</div>
      <p className="mb-3">
        We have sent a verification email to your email address. Please check
        your inbox and click on the verification link to verify your email
        address.
      </p>
      <p className="mb-8">
        If you have not received the email within a few minutes, please check
        your spam folder.
      </p>
      <VerifyEmailForm />
    </LoginTemplate>
  );
};

export default SendVerifyEmailPage;
