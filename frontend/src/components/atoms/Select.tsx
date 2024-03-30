import React, { ReactNode, forwardRef, Ref } from "react";

interface SelectProps {
  children: ReactNode;
  label?: string;
  error?: string;
  [key: string]: any;
}

const Select = (
  { children, label, error, ...props }: SelectProps,
  ref: Ref<HTMLSelectElement>
) => {
  if (error) {
    return (
      <div>
        <label className="block mb-2 text-sm font-medium text-red-700 dark:text-red-500">
          {label}
        </label>
        <select
          ref={ref}
          className="cursor-pointer bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
          {...props}
        >
          {children}
        </select>
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </label>
      <select
        ref={ref}
        className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default forwardRef(Select);
