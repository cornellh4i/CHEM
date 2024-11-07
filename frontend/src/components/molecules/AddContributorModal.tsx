import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";

// Input component definitions
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border border-gray-400 p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`} // Adjusted border and focus styles for a cleaner look
      {...props}
    />
  );
});
Input.displayName = "Input";

// Label component definition
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <label
      className={`mb-1 block text-sm font-medium text-black ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

const AddContributorModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-black text-black">
          Add Contributor
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg border border-gray-300 bg-white p-8 shadow-lg sm:min-h-[475px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-4 text-lg font-semibold">
            Add a Contributor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Naomi Rufian" />
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" placeholder="+1 (718) 123-4567" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="123abc@gmail.com" />
          </div>
          <div>
            <Label htmlFor="address">Mailing address</Label>
            <Input id="address" placeholder="123 ABC Drive, Queens NY 11357" />
          </div>
          <div className="flex justify-between space-x-4 pt-8">
            <Button
              variant="outline"
              className="rounded-md border border-gray-400 px-6 py-2 text-sm text-black hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="rounded-md border border-gray-700 bg-gray-700 px-8 py-2 text-sm text-white hover:bg-gray-800"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributorModal;
