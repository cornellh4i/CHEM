import React, { ReactNode, forwardRef, Ref } from "react";

interface RadioProps {
  label?: ReactNode;
  error?: string;
  [key: string]: any;
}

const RadioButton = (
  { label, error, ...props }: RadioProps,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className="flex">
      <div className="grid h-5 place-items-center">
        <input
          ref={ref}
          type="radio"
          value=""
          className="peer col-start-1 row-start-1 h-3 w-3 cursor-pointer appearance-none rounded-full border-2 border-transparent bg-transparent text-black ring-2 ring-black ring-offset-2 checked:border-transparent checked:bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
          {...props}
        />
        <div className="pointer-events-none col-start-1 row-start-1 h-3 w-3 rounded-full peer-checked:bg-black" />
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

export default forwardRef(RadioButton);
