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
          type="email"
          placeholder="john.doe@company.com"
          required
          error={errors.email}
          {...register("email")}
        />
      </div>
      <div className="mb-6">
        <Input
          label="Password"
          type="password"
          placeholder="•••••••••"
          required
          error={errors.password}
          {...register("password")}
        />
      </div>
      <Button type="submit">Log in</Button>
    </form>
  );
};

export default LoginForm;
