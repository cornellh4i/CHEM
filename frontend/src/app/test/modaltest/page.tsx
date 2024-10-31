import React from "react";
import Button from "@/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalProps {
  buttonText?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  buttonText = "Open Modal",
  title,
  description,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

// Example usage:
const ExamplePage = () => {
  return (
    <div className="p-4">
      <Modal
        buttonText="Click me!"
        title="Welcome"
        description="This is a sample modal dialog"
      >
        <div className="space-y-4">
          <p>This is the modal content.</p>
          <p>You can put anything you want in here!</p>
        </div>
      </Modal>
    </div>
  );
};

export default ExamplePage;
