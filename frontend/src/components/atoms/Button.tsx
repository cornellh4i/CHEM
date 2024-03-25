import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  [key: string]: any;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
