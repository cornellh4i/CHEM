"use client";
import React from "react";
import Image from "next/image";
import { LoginForm } from "@/components";

const LoginFormCard = () => {
  return (
    <div className="bg-transparent w-96 p-6">
      <div className="mb-6 flex justify-center">
        <img src="/logo.png" alt="Logo" className="max-h-32 w-auto" />
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginFormCard;
