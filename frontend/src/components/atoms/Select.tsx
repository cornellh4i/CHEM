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
        <label
          className="mb-2 block text-sm font-medium text-red-700
            dark:text-red-500"
        >
          {label}
        </label>
        <select
          ref={ref}
          className="block w-full cursor-pointer rounded-lg border
            border-red-500 bg-red-50 p-2.5 text-sm text-red-900
            placeholder-red-700 focus:border-red-500 focus:ring-red-500
            dark:border-red-500 dark:bg-gray-700 dark:text-red-500
            dark:placeholder-red-500"
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
      <label
        className="mb-2 block text-sm font-medium text-gray-900
          dark:text-gray-300"
      >
        {label}
      </label>
      <select
        ref={ref}
        className="block w-full cursor-pointer rounded-lg border border-gray-300
          bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500
          focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
          dark:text-gray-300 dark:placeholder-gray-400
          dark:focus:border-blue-500 dark:focus:ring-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default forwardRef(Select);
