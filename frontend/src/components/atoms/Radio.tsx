import React, { ReactNode, forwardRef, Ref } from "react";

interface RadioProps {
  label?: ReactNode;
  error?: string;
  checked?: boolean;
  value: string; // Make value required instead of optional
  name?: string;
  onSelect?: (value: string) => void;
  [key: string]: any;
}

const RadioButton = (
  { label, checked, value, onSelect, ...props }: RadioProps,
  ref: Ref<HTMLInputElement>
) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className="flex items-center">
      <div className="grid h-5 place-items-center">
        <input
          ref={ref}
          type="radio"
          checked={checked}
          onChange={handleChange}
          value={value}
          className="border-transparent bg-transparent text-black ring-black checked:border-transparent checked:bg-black hover:bg-gray-700 focus:ring-black peer col-start-1 row-start-1 h-3 w-3 cursor-pointer appearance-none rounded-full border-2 ring-2 ring-offset-2 focus:outline-none focus:ring-2"
          {...props}
        />
        <div className="peer-checked:bg-black pointer-events-none col-start-1 row-start-1 h-3 w-3 rounded-full" />
      </div>
      <div className="ms-5">
        <label className="text-md text-black dark:text-gray-300 font-normal">
          {label}
        </label>
      </div>
    </div>
  );
};

export default forwardRef(RadioButton);
