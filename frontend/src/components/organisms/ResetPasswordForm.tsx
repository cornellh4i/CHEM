import React from "react";
import auth from "@/utils/firebase";
import { useForm } from "react-hook-form";
import { Button, Input, Toast } from "@/components";
import { useToast, useResetPassword } from "@/utils/hooks";

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
    await resetPassword(oobcode, data.password);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Custom Firebase hook */
  const { error, resetPassword } = useResetPassword(auth);

  /** Toast visibility hooks */
  const { open, closeToast } = useToast(error);

  return (
    <div>
      <Toast open={open} onClose={closeToast}>
        {error?.message}
      </Toast>
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
    </div>
  );
};

export default ResetPasswordForm;
