import React, { ReactNode } from "react";
import Navbar from "../organisms/Navbar";

interface DefaultTemplateProps {
  children: ReactNode;
}

const DefaultTemplate = ({ children }: DefaultTemplateProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default DefaultTemplate;
