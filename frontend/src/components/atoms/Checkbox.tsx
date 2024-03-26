import React, { ReactNode, forwardRef, Ref } from "react";

interface CheckboxProps {
  label?: ReactNode;
  error?: string;
  [key: string]: any;
}

const Checkbox = (
  { label, error, ...props }: CheckboxProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className="flex">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          {...props}
        />
      </div>
      <div className="ms-2 text-sm">
        <label className="font-medium text-gray-900 dark:text-gray-300">
          {label}
        </label>
        <p className="text-xs font-normal text-red-600 dark:text-red-500">
          {error}
        </p>
      </div>
    </div>
  );
};

export default forwardRef(Checkbox);
