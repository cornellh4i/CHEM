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

const AddContributorModal: React.FC<AddContributorModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setError("");
  };

  const handleAddContributor = async () => {
    if (!name || !phone || !email || !address) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/contributors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, email, address }),
      });

      if (!response.ok) {
        throw new Error("Failed to add contributor");
      }

      handleClose();
      alert("Contributor added successfully!");
    } catch (err) {
      setError("Error adding contributor. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="name" className="text-black mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Naomi Rufian"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-black mb-1 block text-sm font-medium">
              Phone number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (718) 123-4567"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-black mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="123abc@gmail.com"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="address" className="text-black mb-1 block text-sm font-medium">
              Mailing address
            </label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 ABC Drive, Queens NY 11357"
              className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex justify-between space-x-4 pt-8">
            <Button
              className="border-gray-400 text-black hover:bg-gray-100 rounded-md border px-6 py-2 text-sm"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="border-gray-700 bg-gray-700 text-white hover:bg-gray-800 rounded-md border px-8 py-2 text-sm"
              onClick={handleAddContributor}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributorModal;
