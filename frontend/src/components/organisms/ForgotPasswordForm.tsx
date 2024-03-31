import React from "react";
import auth from "@/utils/firebase";
import { useForm } from "react-hook-form";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { Button, Input } from "@/components";

interface FormInputs {
  email: string;
}

const ForgotPasswordForm = () => {
  /** Handles form submission */
  const onSubmit = async (data: FormInputs): Promise<void> => {
    await sendPasswordResetEmail(data.email);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Firebase hooks */
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  // Show errors
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <Input
          label="Email address"
          placeholder="john.doe@company.com"
          error={errors.email?.message}
          {...register("email", {
            required: { value: true, message: "Required" },
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
              message: "Invalid email address",
            },
          })}
        />
      </div>
      <Button type="submit">Email me a link</Button>
    </form>
  );
};

export default ForgotPasswordForm;
