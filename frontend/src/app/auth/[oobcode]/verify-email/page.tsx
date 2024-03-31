"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LoginTemplate, VerifyEmailConfirm } from "@/components";

const VerifyEmailConfirmPage = () => {
  const params = useParams();
  const oobcode = params.oobcode as string;

  return (
    <LoginTemplate>
      <VerifyEmailConfirm oobcode={oobcode} />
    </LoginTemplate>
  );
};

export default VerifyEmailConfirmPage;
