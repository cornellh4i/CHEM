"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import router from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignupFormCard = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    workType: "",
    companySize: "",
    role: "",
    usagePlan: "",
    referralSource: "",
    usedSimilar: "",
    usedSimilarProduct: "",
  });

  const handleSignUp = async () => {
    const requiredFields = ["usagePlan", "referralSource", "usedSimilar"];
    for (let field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert("Please fill in all required fields.");
        return;
      }
    }
    if (formData.usedSimilar === "Yes" && !formData.usedSimilarProduct) {
      alert("Please specify the product you've used.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUid = userCredential.user.uid;
      console.log("Firebase user created with UID:", firebaseUid);
      console.log(formData.role);

      // Get the ID token from the user
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          organizationName: "Placeholder Org Name",
          organizationDescription: "Placeholder Org Description",
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      console.log("Signup response:", data);
      //send user to dashboard after successful signup
      router.push("/dashboard");
    } catch (error) {
      console.error("Error during signup:", error);
      throw new Error("an error occurred, " + error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFieldsByStep: { [key: number]: string[] } = {
      1: ["email", "password"],
      2: ["firstName", "lastName", "email", "phone"],
      3: ["workType", "companySize", "role"],
      4: ["usagePlan", "referralSource", "usedSimilar"],
    };

    const requiredFields = requiredFieldsByStep[step];
    for (let field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert("Please fill in all required fields.");
        return;
      }
    }

    if (
      formData.usedSimilar === "Yes" &&
      !formData.usedSimilarProduct &&
      step === 4
    ) {
      alert("Please specify the product you've used.");
      return;
    }

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 w-[500px] rounded-lg p-6 shadow">
      <div className="mb-8 text-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="mx-auto mb-4 max-h-32 w-auto"
        />
        <div className="text-black text-left font-serif text-2xl font-bold">
          {step === 1 && "Create an Account"}
          {step === 2 && "Set up your profile"}
          {step === 3 && "Set up your workspace"}
          {step === 4 && "Set up your demographic"}
        </div>
      </div>

      <form onSubmit={handleNext}>
        {/* STEP 1 - Email/Password */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email..."
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password..."
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <Button
                type="submit"
                className="text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2 me-2 w-full rounded-lg border bg-grey-light px-5 py-3 text-sm font-normal hover:bg-grey-dark focus:outline-none focus:ring-4"
                style={{ backgroundColor: "#3E6DA6" }}
              >
                Create an Account
              </Button>
              <p className="text-medium text-gray-500 mb-2 w-full text-xs">
                By signing up, you acknowledge that you have read and
                understood, and agree to our User&nbsp;
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
          </>
        )}

        {/* STEP 2 - First/Last Name, Phone */}
        {step === 2 && (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Tell us a little bit about yourself
            </p>

            <Input
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-gray-300 mb-4 w-full rounded-lg border p-2"
            />
            <Input
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border-gray-300 mb-4 w-full rounded-lg border p-2"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-gray-300 mb-4 w-full rounded-lg border p-2"
            />
            <Input
              label="Phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border-gray-300 mb-6 w-full rounded-lg border p-2"
            />

            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                1 of 3
              </span>
              <Button
                type="submit"
                className="text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2 me-2 w-fit rounded-lg border px-5 py-3 text-sm font-normal hover:bg-[#2b537e] focus:outline-none focus:ring-4"
                style={{ backgroundColor: "#3E6DA6" }}
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Help us personalize your experience
            </p>

            <label className="text-gray-700 mb-1 block text-sm font-medium">
              What kind of work do you do?
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              required
              className="border-gray-100 mb-4 w-full rounded-lg border p-2"
            >
              <option value="">Select</option>
              <option value="Nonprofit">Nonprofit</option>
              <option value="Startup">Startup</option>
              <option value="Enterprise">Enterprise</option>
            </select>

            <label className="text-gray-700 mb-1 block text-sm font-medium">
              What is your company size?
            </label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              required
              className="border-gray-100 mb-4 w-full rounded-lg border p-2"
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2-50">2-50</option>
              <option value="50+">50+</option>
            </select>

            <label className="text-gray-700 mb-1 block text-sm font-medium">
              What is your role?
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="border-gray-100 mb-6 w-full rounded-lg border p-2"
            >
              <option value="">Select</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
            </select>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                2 of 3
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-800 mb-2 me-2 w-fit rounded-lg border px-5 py-3 text-sm font-normal"
                >
                  Go Back
                </Button>
                <Button
                  type="submit"
                  className="text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2 me-2 w-fit rounded-lg border px-5 py-3 text-sm font-normal hover:bg-[#2b537e] focus:outline-none focus:ring-4"
                  style={{ backgroundColor: "#3E6DA6" }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Tell us more about you
            </p>

            <label className="text-gray-700 mb-1 block text-sm font-medium">
              How are you planning to use this product?
            </label>
            <select
              name="usagePlan"
              value={formData.usagePlan}
              onChange={handleChange}
              required
              className="border-gray-100 mb-4 w-full rounded-lg border p-2"
            >
              <option value="">Choose an option</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Organization">Organization</option>
              <option value="Team">Other</option>
            </select>

            <label className="text-gray-700 mb-1 block text-sm font-medium">
              How did you hear about our product?
            </label>
            <select
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              required
              className="border-gray-100 mb-4 w-full rounded-lg border p-2"
            >
              <option value="">Choose an option</option>
              <option value="Hack4Impact">Hack4Impact</option>
              <option value="Social Media">Social Media</option>
              <option value="Friend/Colleague">Friends</option>
              <option value="Other">Other</option>
            </select>

            <label className="text-gray-700 mb-2 block text-sm font-medium">
              Have you used a similar product before?
            </label>
            <div className="mb-4 flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="usedSimilar"
                  value="Yes"
                  checked={formData.usedSimilar === "Yes"}
                  onChange={handleChange}
                  required
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="usedSimilar"
                  value="No"
                  checked={formData.usedSimilar === "No"}
                  onChange={handleChange}
                  required
                />
                No
              </label>
            </div>

            {formData.usedSimilar === "Yes" && (
              <Input
                name="usedSimilarProduct"
                placeholder="Write the product name"
                value={formData.usedSimilarProduct}
                onChange={handleChange}
                required
                className="border-gray-300 mb-6 w-full rounded-lg border p-2"
              />
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                3 of 3
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-800 mb-2 me-2 w-fit rounded-lg border px-5 py-3 text-sm font-normal"
                >
                  Go Back
                </Button>
                <Button
                  type="button"
                  className="text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-2 me-2 w-fit rounded-lg border px-5 py-3 text-sm font-normal hover:bg-[#2b537e] focus:outline-none focus:ring-4"
                  style={{ backgroundColor: "#3E6DA6" }}
                  onClick={handleSignUp}
                >
                  Create your workspace
                </Button>
              </div>
            </div>
          </>
        )}
      </form>

      {/* Back to Login button */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignupFormCard;
