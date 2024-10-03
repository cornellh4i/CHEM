import Button from "@/components/atoms/Button";
import React, { ReactNode, forwardRef, Ref } from "react";

const Test = () => {
  return (
    <div className="flex gap-1">
      <Button variant="primary">Hifhghg s</Button>
      <Button variant="primary">Hifhghg s</Button>
      <Button variant="primary">Hifhghg s</Button>
      <Button variant="primary">Hifhghg s</Button>
    </div>
  );
};

export default forwardRef(Test);
