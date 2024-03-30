import React, { ReactNode } from "react";
import Image from "next/image";

interface LoginTemplateProps {
  children: ReactNode;
}

const LoginTemplate = ({ children }: LoginTemplateProps) => {
  return (
    <div className="flex min-h-screen dark:bg-gray-900 dark:text-gray-300">
      {/* Left */}
      <div className="flex overflow-auto w-full sm:max-w-2xl py-10 px-10 sm:px-20 items-center justify-center">
        <div className="w-full">{children}</div>
      </div>

      {/* Right */}
      <div className="flex-1 bg-gray-300 overflow-hidden relative">
        <img
          className="min-h-full min-w-full absolute object-cover"
          alt="splash"
          src="https://upload.wikimedia.org/wikipedia/commons/6/65/Adirondacks_in_May_2008.jpg"
        />
      </div>
    </div>
  );
};

export default LoginTemplate;
