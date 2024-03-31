import React, { useState, useEffect } from "react";
import auth from "@/utils/firebase";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { Button, Toast } from "@/components";
import { useToast } from "@/utils/hooks";

const VerifyEmailForm = () => {
  /** Handles form submission */
  const onSubmit = async (): Promise<void> => {
    await sendEmailVerification();
  };

  /** Firebase hooks */
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  /** Toast visibility hooks */
  const { open, closeToast } = useToast(error);

  return (
    <div>
      <Toast open={open} onClose={closeToast}>
        {error?.message}
      </Toast>
      <Button>Resend verification email</Button>
      <Button variant="secondary">Sign out</Button>
    </div>
  );
};

export default VerifyEmailForm;
