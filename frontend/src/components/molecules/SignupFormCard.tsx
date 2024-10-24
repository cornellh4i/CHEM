import React from "react";
import { Button, Input } from "@/components";

const SignupFormCard = () => {
  const space = " ";
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-8 w-96 font-serif text-4xl text-[#185F96]">
        Sign Up
      </div>
      <div>
        <form>
          <div className="mb-6">
            <Input label="Email address" placeholder="john.doe@company.com" />
          </div>
          <div className="mb-6">
            <Input label="Password" type="password" placeholder="•••••••••" />
          </div>
          <div className="mb-2">
            <Button
              type="submit"
              className="mb-2 me-2 w-full rounded-lg border bg-grey-light px-5 py-3 text-sm font-normal text-white hover:bg-grey-dark focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              style={{ backgroundColor: "#3E6DA6" }}
            >
              Create an Account
            </Button>
            <p className="text-medium mb-2 w-full text-xs text-gray-500">
              By signing up, you acknowledge that you have read and understood,
              and agree to our User&nbsp;
              <a
                href="#"
                className="text-medium text-gray-500 underline hover:no-underline"
              >
                Terms of Service
              </a>{" "}
              and&nbsp;
              <a
                href="#"
                className="text-medium text-gray-500 underline hover:no-underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupFormCard;
