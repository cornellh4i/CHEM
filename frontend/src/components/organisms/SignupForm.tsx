import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Checkbox } from "@/components";

type FormInputs = {
  firstName: string;
  lastName: string;
  company: string;
  phone: number;
  website: string;
  visitors: number;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

const SignupForm = () => {
  /** Handles form submission */
  const onSubmit = (data: FormInputs) => {
    console.log(data);
  };

  /** React hook form */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 mb-6 sm:grid-cols-2">
        <Input
          label="First name"
          type="text"
          placeholder="John"
          required
          error={errors.firstName}
          {...register("firstName")}
        />
        <Input
          label="Last name"
          type="text"
          placeholder="Doe"
          required
          error={errors.lastName}
          {...register("lastName")}
        />
        <Input
          label="Company"
          type="text"
          placeholder="Flowbite"
          required
          error={errors.company}
          {...register("company")}
        />
        <Input
          label="Phone number"
          type="tel"
          placeholder="123-456-7890"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
          error={errors.phone}
          {...register("phone")}
        />
        <Input
          label="Website URL"
          type="url"
          placeholder="flowbite.com"
          required
          error={errors.website}
          {...register("website")}
        />
        <Input
          label="Visitors"
          type="number"
          required
          error={errors.visitors}
          {...register("visitors")}
        />
      </div>
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
      <div className="mb-6">
        <Input
          label="Confirm password"
          type="password"
          placeholder="•••••••••"
          required
          error={errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </div>
      <div className="flex items-start mb-6">
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
          error={errors.agree}
          {...register("agree")}
        />
      </div>
      <Button type="submit">Sign up</Button>
    </form>
  );
};

export default SignupForm;
