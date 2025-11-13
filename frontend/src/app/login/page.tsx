"use client";
import LoginFormCard from "@/components/molecules/LoginFormCard";

const LoginPage = () => {
  return (
    // use flexbox - center content vertically and horizontally, full height of screen
    <div className="flex h-screen items-center justify-center bg-[#fefcfc]">
      <LoginFormCard />
    </div>
  );
};

export default LoginPage;
