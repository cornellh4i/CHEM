import React, { forwardRef, Ref } from "react";

interface InputProps {
  label: string;
  error: string;
  [key: string]: any;
}

const Input = (
  { label, error, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <input
        ref={ref}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...props}
      />
      <div className="mt-1 text-xs text-red-500">{error}</div>
    </div>
  );
};

export default forwardRef(Input);
