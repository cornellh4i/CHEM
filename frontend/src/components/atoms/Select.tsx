"use client";
import React, { ReactNode, forwardRef, Ref, useState } from "react";

interface SelectProps {
  children: ReactNode;
  label?: string;
  error?: string;
  placeholder?: string;
  values?: string[];
  [key: string]: any;
}

const Select = (
  { children, label, error, placeholder, values, ...props }: SelectProps,
  ref: Ref<HTMLSelectElement>
) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (error) {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-red-700 dark:text-red-500">
          {label}
        </label>
        <select
          ref={ref}
          className="block w-full cursor-pointer rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-white dark:text-red-500 dark:placeholder-red-500"
          defaultValue={placeholder ? "" : undefined}
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
      <label className="ml-2 block text-sm font-normal text-gray-900 dark:text-gray-600">
        {label}
      </label>
      <div onClick={handleToggleDropdown}>
        <select
          ref={ref}
          className="block w-full cursor-pointer rounded-lg border border-gray-300 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500"
          style={{ backgroundColor: "#F5F5F5" }}
          defaultValue={placeholder ? "" : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-600">
              {placeholder}
            </option>
          )}

          {values &&
            values.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          {children}
        </select>
      </div>
    </div>
  );
};

export default forwardRef(Select);
