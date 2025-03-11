"use client";

import React, { ReactNode, useState } from "react";
import Button from "@/components/atoms/Button";
import { ScrollArea } from "@/components/ui/scroll";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [orgID, setOrgID] = useState(organizationId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    // Reset form fields
    setFirstName("");
    setLastName("");
    setOrgID(organizationId); // Reset to default or empty
    setError("");
  };

  const handleAdd = async () => {
    // Basic validation
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
        organizationId: orgID,
      };

      const response = await fetch("http://localhost:8000/api/contributors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contributorData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message ||
            `Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Contributor added:", result);

      alert("Contributor added successfully!");
      handleClose();
    } catch (err) {
      console.error("HELLO Error adding contributor:", err);
      console.log(err);
      // setError(
      //   err instanceof Error ? err.message : "HELLO Error adding contributor"
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button/Element */}
      <DialogTrigger asChild onClick={handleOpen}>
        {children}
      </DialogTrigger>

      <DialogContent className="h-[800px] w-[810px] justify-center rounded-[40px] px-[100px] pt-[100px]">
        <ScrollArea className="h-full w-[600px]">
          <DialogHeader>
            <DialogTitle className="mb-[48px] text-[32px]">
              Add Contributor
            </DialogTitle>
          </DialogHeader>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          {/* First Name */}
          <div className="mb-2 text-[22px]">First Name</div>
          <input
            className="border-black text-gray-900 placeholder-gray-500 mb-[32px] w-[95%] rounded-lg border px-2 py-3.5 text-sm"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          {/* Last Name */}
          <div className="mb-2 text-[22px]">Last Name</div>
          <input
            className="border-black text-gray-900 placeholder-gray-500 mb-[32px] w-[95%] rounded-lg border px-2 py-3.5 text-sm"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          {/* Organization ID (if needed) */}
          <div className="mb-2 text-[22px]">Organization ID</div>
          <input
            className="border-black text-gray-900 placeholder-gray-500 mb-[32px] w-[95%] rounded-lg border px-2 py-3.5 text-sm"
            placeholder="Optional org ID"
            value={orgID}
            onChange={(e) => setOrgID(e.target.value)}
          />

          {/* Footer buttons */}
          <div className="relative mt-[50px]">
            <Button
              className="border-black text-black hover:bg-gray-100 absolute left-0 mb-2 me-2 rounded-2xl border px-16 py-3 text-lg"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="border-black bg-gray-800 text-white hover:bg-gray-600 absolute right-5 mb-2 me-2 rounded-2xl border px-20 py-3 text-lg"
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>

          <DialogFooter />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributorModal;
