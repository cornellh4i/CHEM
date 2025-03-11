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
  organizationId?: string;
};

const AddContributorModal: React.FC<AddContributorModalProps> = ({
  children,
  organizationId = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    // Reset form fields
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setError("");
  };

  const handleAdd = async () => {
    // Validation code remains the same
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contributorData = {
        firstName,
        lastName,
        organizationId,
      };

      // Remove the no-cors mode
      // In your AddContributorModal.tsx
      const response = await fetch("http://localhost:8000/api/contributors", {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contributorData),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text(); // Try to get text instead of JSON first
        let errorMessage;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message ||
            `Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          // If it's not valid JSON, use the status text
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Only try to parse JSON if the response was successful
      const result = await response.json();
      console.log("Contributor added:", result);

      handleClose();
      alert("Contributor added successfully!");
    } catch (err) {
      console.error("Error adding contributor:", err);
      setError(err instanceof Error ? err.message : "Error adding contributor");
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-black mb-1 block text-sm font-medium"
              >
                First Name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="text-black mb-1 block text-sm font-medium"
              >
                Last Name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
              />
            </div>
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
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
              onClick={handleAdd}
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
