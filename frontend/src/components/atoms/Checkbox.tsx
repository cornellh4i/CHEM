import React, { ReactNode, forwardRef, Ref } from "react";

interface CheckboxProps {
  label: ReactNode;
  error: string;
  [key: string]: any;
}

const Checkbox = (
  { label, error, ...props }: CheckboxProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className="flex items-center h-5">
      <input
        ref={ref}
        type="checkbox"
        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
        required
        {...props}
      />
      <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </label>
      <div className="ml-3 text-xs text-red-500">{error}</div>
    </div>
  );
};

export default forwardRef(Checkbox);
