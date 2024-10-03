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
    <>
      <Input />
      <Select />
    </>
  );
};

export default forwardRef(Checkbox);
