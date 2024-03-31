import React, { useState } from "react";
import auth from "@/utils/firebase";
import { useForm } from "react-hook-form";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { Button, Input } from "@/components";

interface ResetPasswordFormProps {
  oobcode: string;
}

interface FormInputs {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = ({ oobcode }: ResetPasswordFormProps) => {
  /** Handles form submission */
  const onSubmit = async (data: FormInputs): Promise<void> => {
    try {
      await verifyPasswordResetCode(auth, oobcode);
      await confirmPasswordReset(auth, oobcode, data.password);
    } catch (error) {
      setError(error as Error);
    }
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Error state */
  const [error, setError] = useState<Error | null>(null);

  // Show errors
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <Input
          label="Password"
          type="password"
          placeholder="•••••••••"
          error={errors.password?.message}
          {...register("password", {
            required: { value: true, message: "Required" },
          })}
        />
      </div>
      <div className="mb-6">
        <Input
          label="Confirm password"
          type="password"
          placeholder="•••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: { value: true, message: "Required" },
            validate: {
              matchPassword: (value) =>
                value === watch("password") || "Passwords do not match",
            },
          })}
        />
      </div>
      <Button type="submit">Reset password</Button>
    </form>
  );
};

export default ResetPasswordForm;
