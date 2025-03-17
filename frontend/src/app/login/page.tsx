"use client";
import LoginFormCard from "@/components/molecules/LoginFormCard";

const LoginPage = () => {
  return (
    // use flexbox - center content vertically and horizontally, full height of screen
    <div className="flex items-center justify-center h-screen">
      <LoginFormCard />
    </div>
  );
};

export default LoginPage;
