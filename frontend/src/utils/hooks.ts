import { Auth } from "firebase/auth";
import { useState, useEffect } from "react";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
} from "firebase/auth";

/**
 * Hook for using a toast to display messages on state changes. Every time
 * `state` is changed, the hook checks to see if the state is `true` and pings
 * the toast to open if necessary.
 * @param state is the variable to watch; it can be any type, but the toast will
 *     open as long as `if (state) { ... }` evaluates to `true`
 * @returns hooks
 * @example const { open, closeToast } = useToast(error) // react-firebase-hooks
 * @example const { open, closeToast } = useToast(isSuccess) // custom boolean
 */
export const useToast = (state: any) => {
  const [open, setOpen] = useState(false);

  /** Closes the toast */
  const closeToast = () => {
    setOpen(!open);
  };

  // Check if modal should be opened
  useEffect(() => {
    if (state) {
      setOpen(true);
    }
  }, [state]);

  return { open, closeToast };
};

/**
 * Custom Firebase hook for confirming a password reset
 * @param auth is the Firebase Auth instance
 * @returns hooks
 */
export const useResetPassword = (auth: Auth) => {
  const [error, setError] = useState<Error | null>(null);

  /**
   * Resets the password
   * @param oobcode is the Firebase out of band code
   * @param password is the new password
   * @returns void
   */
  const resetPassword = async (oobcode: string, password: string) => {
    try {
      await verifyPasswordResetCode(auth, oobcode);
      await confirmPasswordReset(auth, oobcode, password);
    } catch (error) {
      setError(error as Error);
    }
  };

  return { error, resetPassword };
};

/**
 * Custom Firebase hook for applying an oob code
 * @param auth is the Firebase Auth instance
 * @returns hooks
 */
export const useVerifyActionCode = (auth: Auth, oobcode: string) => {
  const [error, setError] = useState<Error | null>(null);

  // Verify the oobcode
  useEffect(() => {
    /**
     * Resets the password
     * @param oobcode is the Firebase out of band code
     * @param password is the new password
     * @returns void
     */
    const verifyCode = async () => {
      try {
        await applyActionCode(auth, oobcode);
      } catch (error) {
        setError(error as Error);
      }
    };
    verifyCode();
  }, [auth, oobcode]);

  return { error };
};
