import React from "react";
import auth from "@/utils/firebase";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { Button } from "@/components";

const LoginForm = () => {
  /** Handles form submission */
  const onSubmit = async (): Promise<void> => {
    await sendEmailVerification();
  };

  /** Firebase hooks */
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  // Show errors
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <Button>Resend verification email</Button>
      <Button variant="secondary">Sign out</Button>
    </div>
  );
};

export default LoginForm;
