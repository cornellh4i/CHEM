import React from "react";
import auth from "@/utils/firebase";
import { useVerifyActionCode } from "@/utils/hooks";

interface VerifyEmailConfirmationProps {
  oobcode: string;
}

const VerifyEmailConfirm = ({ oobcode }: VerifyEmailConfirmationProps) => {
  /** Custom verify action code hooks */
  const { error } = useVerifyActionCode(auth, oobcode);

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
