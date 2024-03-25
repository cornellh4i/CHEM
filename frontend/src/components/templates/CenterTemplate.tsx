import React, { ReactNode } from "react";
import { Navbar } from "@/components";

interface CenterTemplateProps {
  children: ReactNode;
}

const CenterTemplate = ({ children }: CenterTemplateProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="px-6 sm:px-12 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default CenterTemplate;
