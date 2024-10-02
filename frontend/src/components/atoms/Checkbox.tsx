import React, { ReactNode, forwardRef, Ref } from "react";

interface CheckboxProps {
  label?: ReactNode;
  error?: string;
  [key: string]: any;
}

const Checkbox = (
  { defaultChecked, label, error, ...props }: CheckboxProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className="flex">
      <div className="grid h-5 place-items-center">
        <input
          ref={ref}
          type="checkbox"
          defaultChecked={defaultChecked}
          value=""
          className="peer col-start-1 row-start-1 h-6 w-6 shrink-0 appearance-none rounded-full border-2 border-black focus:shadow-none focus:outline-none focus:ring-0"
          {...props}
        />
        <div className="pointer-events-none col-start-1 row-start-1 h-3.5 w-3.5 rounded-full focus:shadow-none focus:outline-none focus:ring-0 peer-checked:bg-black" />
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
