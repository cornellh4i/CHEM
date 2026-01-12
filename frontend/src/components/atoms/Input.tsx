import React, { forwardRef, Ref } from "react";

interface InputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  [key: string]: any;
  width?: string;
}

const Input = (
  { label, error, disabled, width, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div>
      {label && (
        <label
          className={`mb-2 mt-4 block text-sm font-normal ${error ? "text-red-700" : "text-black"}`}
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        className={`block w-full rounded-lg border p-2 text-sm text-gray-900 placeholder-gray-500 hover:bg-gray-100 ${error ? "border-red-500" : "border-black"} ${
          disabled
            ? `cursor-not-allowed bg-gray-200 text-gray-500 placeholder-transparent`
            : "bg-white"
        } ${props.className ?? ""}`}
        autoComplete="off"
        disabled={disabled}
        placeholder={disabled ? "" : props.placeholder}
        {...props}
        style={{
          width: width,
        }}
      />

      {error && <p className="mt-1 text-xs" style={{ color: "#dc2626" }}>{error}</p>}
    </div>
  );
};

export default forwardRef(Input);
