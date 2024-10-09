import React, { ReactNode, forwardRef, Ref } from "react";
import Select from "../../components/atoms/Select";
import Input from "../../components/atoms/Input";

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
    <div className="p-2">
      {/* Normal Input */}
      <Input label="Name" placeholder="Enter a name" width="300px" />
      {/* Error Input */}
      <Input label="Error" error="Amount is negative" width="300px" />
      {/* Disabled Input */}
      <Input
        label="Disabled"
        value="Cannot enter value"
        width="300px"
        disabled
      />
      {/* Normal Select */}
      <Select
        label="Choose a fund"
        placeholder="Select fund"
        values={["A", "B", "C"]}
        width="300px"
      />
      {/* Error Select */}
      <Select
        label="Choose a fund"
        placeholder="Select fund"
        values={["A", "B", "C"]}
        width="300px"
      />
      {/* Disabled Select */}
      <Select
        label="Choose a fund"
        placeholder="Select fund"
        values={["A", "B", "C"]}
        width="300px"
        disabled
      />
    </div>
  );
};

export default forwardRef(Checkbox);
