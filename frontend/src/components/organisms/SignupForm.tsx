import React from "react";
import api from "@/utils/api";
import auth from "@/utils/firebase";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, Checkbox, Select, Toast } from "@/components";
import { useToast } from "@/utils/hooks";

interface FormInputs {
  firstName: string;
  lastName: string;
  company: string;
  phone: number;
  website: string;
  location: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const SignupForm = () => {
  /** Handles form submission */
  const onSubmit = async (data: FormInputs): Promise<void> => {
    console.log(data);
    await signupMutation.mutateAsync(data);
    await createUserWithEmailAndPassword(data.email, data.password);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  /** Tanstack mutation for signing up a user */
  const signupMutation = useMutation({
    mutationFn: async (form: FormInputs) => {
      const data = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        company: form.company,
        phone: form.phone,
        website: form.website,
        location: form.location,
      };
      const response = await api.post("/users", data);
      return response;
    },
    retry: false,
  });

  /** Firebase hooks */
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  /** Toast visibility hooks */
  const { open, closeToast } = useToast(error && signupMutation.isError);

  return (
    <div>
      <Toast open={open} onClose={closeToast}>
        {error?.message}
        {signupMutation.error?.message}
      </Toast>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <Input
            label="First name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName", {
              required: { value: true, message: "Required" },
            })}
          />
          <Input
            label="Last name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName", {
              required: { value: true, message: "Required" },
            })}
          />
          <Input
            label="Company"
            placeholder="Flowbite"
            error={errors.company?.message}
            {...register("company", {
              required: { value: true, message: "Required" },
            })}
          />
          <Input
            label="Phone number"
            placeholder="123-456-7890"
            error={errors.phone?.message}
            {...register("phone", {
              required: { value: true, message: "Required" },
              pattern: {
                value: /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
                message: "Invalid phone number",
              },
            })}
          />
          <Input
            label="Website URL"
            placeholder="flowbite.com"
            error={errors.website?.message}
            {...register("website", {
              required: { value: true, message: "Required" },
              pattern: {
                value:
                  /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
                message: "Invalid URL",
              },
            })}
          />
          <Select
            label="Location"
            defaultValue=""
            error={errors.location?.message}
            {...register("location", {
              required: { value: true, message: "Required" },
            })}
          >
            <option value="">Choose a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </Select>
        </div>
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
        <div className="mb-6 flex items-start">
          <Checkbox
            label={
              <>
                I agree with the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-500"
                >
                  terms and conditions
                </a>
                .
              </>
            }
            error={errors.agree?.message}
            {...register("agree", {
              required: { value: true, message: "Required" },
            })}
          />
        </div>
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
};

export default SignupForm;
