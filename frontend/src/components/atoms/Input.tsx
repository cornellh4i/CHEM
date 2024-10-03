import React, { forwardRef, Ref } from "react";

interface InputProps {
  label?: string;
  error?: string;
  [key: string]: any;
}

const Input = (
  { label, error, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  if (error) {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-red-700">
          {label}
        </label>
        <input
          ref={ref}
          className="block w-full border border-black p-2 text-sm text-gray-900 placeholder-gray-500"
          autoComplete="off"
          {...props}
        />
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        {label}
      </label>
      <input
        ref={ref}
        className="border-lg block w-full rounded-lg border border-black p-2 text-sm text-gray-900 placeholder-gray-500"
        autoComplete="off"
        {...props}
      />
    </div>
  );
};

export default forwardRef(Input);
