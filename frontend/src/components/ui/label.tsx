// path: /components/ui/label.tsx
import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ className = "", ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={`block mb-2 text-lg font-medium text-gray-900 ${className}`}
    />
  );
};

export { Label };
