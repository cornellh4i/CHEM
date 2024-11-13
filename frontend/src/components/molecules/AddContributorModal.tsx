import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";

type AddContributorModalProps = {
  children: ReactNode;
};

const AddContributorModal: React.FC<AddContributorModalProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleAdd = () => {
    // Add contributor logic here
    handleClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        {children}
      </DialogTrigger>
      <DialogContent className="rounded-lg border border-gray-300 bg-white p-8 shadow-lg sm:min-h-[475px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-4 text-lg font-semibold">
            Add a Contributor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-black"
            >
              Name
            </label>
            <input
              id="name"
              placeholder="Naomi Rufian"
              className="w-full rounded-md border border-gray-400 p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-black"
            >
              Phone number
            </label>
            <input
              id="phone"
              placeholder="+1 (718) 123-4567"
              className="w-full rounded-md border border-gray-400 p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="123abc@gmail.com"
              className="w-full rounded-md border border-gray-400 p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-black"
            >
              Mailing address
            </label>
            <input
              id="address"
              placeholder="123 ABC Drive, Queens NY 11357"
              className="w-full rounded-md border border-gray-400 p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex justify-between space-x-4 pt-8">
            <Button
              variant="outline"
              className="rounded-md border border-gray-400 px-6 py-2 text-sm text-black hover:bg-gray-100"
              onClick={handleClose} // Close modal on Cancel
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="rounded-md border border-gray-700 bg-gray-700 px-8 py-2 text-sm text-white hover:bg-gray-800"
              onClick={handleAdd} // Close modal on Add
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
