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
      <Input label="Name" placeholder="Enter a name" width="200px" />
      {/* Error Input */}
      <Input label="Error" error="Amount is negative" />
      {/* Disabled Input */}
      <Input label="Disabled" value="Cannot enter value" disabled />
      {/* Normal Select */}
      <Select
        label="Choose a fund"
        placeholder="Select fund"
        values={["A", "B", "C"]}
      />
      {/* Error Select */}
      <Select
        label="Choose a fund"
        placeholder="Select fund"
        values={["A", "B", "C"]}
      />
      {/* Disabled Select */}
      <Select
        label="Choose a fund"
        placeholder="Select fund"
        values={["A", "B", "C"]}
        width="200px"
      />
    </div>
  );
};

export default forwardRef(Checkbox);
