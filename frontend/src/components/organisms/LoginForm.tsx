import React from "react";
import { useForm } from "react-hook-form";
import auth from "@/utils/firebase";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { Button, Input } from "@/components";

type FormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  /** Handles form submission */
  const onSubmit = async (data: FormInputs): Promise<void> => {
    await signInWithEmailAndPassword(data.email, data.password);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Firebase hooks */
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

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
      <Button type="submit">Log in</Button>
    </form>
  );
};

export default LoginForm;
