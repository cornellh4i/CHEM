import React, { ReactNode } from "react";
import Image from "next/image";

interface LoginTemplateProps {
  children: ReactNode;
}

const LoginTemplate = ({ children }: LoginTemplateProps) => {
  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      {/* Left */}
      <div
        className="flex w-full items-center justify-center overflow-auto px-10
          py-10 sm:max-w-2xl sm:px-20"
      >
        <div className="w-full">{children}</div>
      </div>

      {/* Right */}
      <div className="relative flex-1 overflow-hidden bg-gray-300">
        <img
          className="absolute min-h-full min-w-full object-cover"
          alt="splash"
          src="https://upload.wikimedia.org/wikipedia/commons/6/65/Adirondacks_in_May_2008.jpg"
        />
      </div>
    </div>
  );
};

export default LoginTemplate;
