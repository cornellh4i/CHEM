import React from "react";
import auth from "@/utils/firebase";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { Button, Toast } from "@/components";
import { useToast } from "@/utils/hooks";

const VerifyEmailForm = () => {
  /** Sends email verification */
  const onClick = async (): Promise<void> => {
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
      <Button onClick={onClick}>Resend verification email</Button>
      <Button variant="secondary">Sign out</Button>
    </div>
  );
};

export default VerifyEmailForm;
