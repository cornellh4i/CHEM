import React, { useState, useEffect } from "react";
import auth from "@/utils/firebase";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { Button, Toast } from "@/components";

const LoginForm = () => {
  /** Handles form submission */
  const onSubmit = async (): Promise<void> => {
    await sendEmailVerification();
  };

  /** Firebase hooks */
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  /** Toast visibility state */
  const [open, setOpen] = useState(false);

  // Show errors
  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  return (
    <div>
      <Toast open={open} onClose={() => setOpen(false)}>
        {error?.message}
      </Toast>
      <Button>Resend verification email</Button>
      <Button variant="secondary">Sign out</Button>
    </div>
  );
};

export default LoginForm;
