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
      <div className="flex h-5 items-center">
        <input
          ref={ref}
          type="checkbox"
          value=""
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600
            focus:ring-2 focus:ring-blue-500 dark:border-gray-600
            dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
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
