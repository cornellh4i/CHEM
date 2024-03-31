import React, { useState, useEffect } from "react";
import auth from "@/utils/firebase";
import { applyActionCode } from "firebase/auth";

interface VerifyEmailConfirmationProps {
  oobcode: string;
}

const VerifyEmailConfirm = ({ oobcode }: VerifyEmailConfirmationProps) => {
  /** Attempts to verify the oobcode */
  const verifyCode = async (oobcode: string) => {
    try {
      await applyActionCode(auth, oobcode);
    } catch (error) {
      setError(error as Error);
    }
  };

  /** Error state */
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    verifyCode(oobcode);
  }, [oobcode]);

  // Show errors
  if (error) {
    return (
      <div className="text-center">
        <p>Your link may be expired or invalid. Please try again.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      Your account has been verified! You can close this page.
    </div>
  );
};

export default VerifyEmailConfirm;
