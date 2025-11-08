"use client";
import { LoginForm } from "@/components";

const LoginPage = () => {
  return (
    // use flexbox - center content vertically and horizontally, full height of screen
    <div className="flex h-screen items-center justify-center bg-[#fefcfc]">
      <div className="bg-transparent w-96 p-6">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="Logo" className="max-h-32 w-auto" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
