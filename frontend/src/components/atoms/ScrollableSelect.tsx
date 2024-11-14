"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScrollSelectProps {
  placeholder?: string;
  values?: string[];
  width?: string;
}

const ScrollableSelect = ({
  placeholder,
  values = [],
  width,
}: ScrollSelectProps) => {
  return (
    <Select>
      <SelectTrigger className={width}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {values.map((value, index) => (
          <SelectItem key={`${value}-${index}`} value={`${value}-${index}`}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ScrollableSelect;
