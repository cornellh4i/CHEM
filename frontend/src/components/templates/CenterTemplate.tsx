import React, { ReactNode } from "react";
import { Navbar } from "@/components";

interface CenterTemplateProps {
  children: ReactNode;
}

const CenterTemplate = ({ children }: CenterTemplateProps) => {
  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-300">
      <Navbar />
      <div className="max-w-2xl mx-auto sm:mt-8 p-4">{children}</div>
    </div>
  );
};

export default CenterTemplate;
