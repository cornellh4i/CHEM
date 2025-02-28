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
      <DialogContent className="border-gray-300 bg-white rounded-lg border p-8 shadow-lg sm:min-h-[475px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-4 text-lg font-semibold">
            Add a Contributor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="text-black mb-1 block text-sm font-medium"
            >
              Name
            </label>
            <input
              id="name"
              placeholder="Naomi Rufian"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="text-black mb-1 block text-sm font-medium"
            >
              Phone number
            </label>
            <input
              id="phone"
              placeholder="+1 (718) 123-4567"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-black mb-1 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="123abc@gmail.com"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="text-black mb-1 block text-sm font-medium"
            >
              Mailing address
            </label>
            <input
              id="address"
              placeholder="123 ABC Drive, Queens NY 11357"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex justify-between space-x-4 pt-8">
            <Button
              // variant="outline"
              className="border-gray-400 text-black hover:bg-gray-100 rounded-md border px-6 py-2 text-sm"
              onClick={handleClose} // Close modal on Cancel
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="border-gray-700 bg-gray-700 text-white hover:bg-gray-800 rounded-md border px-8 py-2 text-sm"
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
