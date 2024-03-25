import React, { ReactNode } from "react";
import Image from "next/image";

interface LoginTemplateProps {
  children: ReactNode;
}

const LoginTemplate = ({ children }: LoginTemplateProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="flex overflow-auto w-full sm:max-w-lg p-10 sm:p-20 items-center justify-center">
        <div className="w-full">{children}</div>
      </div>

      {/* Right */}
      <div className="flex-1 bg-gray-300 overflow-hidden relative">
        <img
          className="min-h-full absolute"
          alt="splash"
          src="https://upload.wikimedia.org/wikipedia/commons/6/65/Adirondacks_in_May_2008.jpg"
        />
      </div>
    </div>
  );
};

export default LoginTemplate;
