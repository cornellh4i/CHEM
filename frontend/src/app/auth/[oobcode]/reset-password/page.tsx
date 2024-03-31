"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LoginTemplate, ResetPasswordForm } from "@/components";

const ResetPasswordPage = () => {
  const params = useParams();
  const oobcode = params.oobcode as string;

  return (
    <LoginTemplate>
      <div className="mb-8 text-4xl">Reset Password</div>
      <ResetPasswordForm oobcode={oobcode} />
    </LoginTemplate>
  );
};

export default ResetPasswordPage;
