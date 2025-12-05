
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";
import Toast from "@/components/atoms/Toast";
import api from "@/utils/api";

type ContributorData = {
  firstName: string;
  lastName: string;
};

type AddContributorModalProps = {
  children: ReactNode;
  onAdded?: () => void;
};

const AddContributorModal: React.FC<AddContributorModalProps> = ({
  children,
  onAdded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userOrgId, setUserOrgId] = useState<string | null>(null);

  // Initial contributor state
  const initialContributorState: ContributorData = {
    firstName: "",
    lastName: "",
  };

  // State to store all form values
  const [contributor, setContributor] = useState<ContributorData>(
    initialContributorState
  );

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Load the logged-in user's organization so new contributors can be attached automatically.
  useEffect(() => {
    const fetchUserOrg = async () => {
      try {
        const res = await api.get("/auth/login");
        const user = res.data?.user;
        const orgId = user?.organizationId || user?.organization?.id;
        if (!orgId) {
          throw new Error("No organization found for user.");
        }
        setUserOrgId(orgId);
      } catch (err: any) {
        console.error("Failed to load user org", err);
        showError("Failed to load your organization. Please try again.");
      }
    };

    fetchUserOrg();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof ContributorData, value: any) => {
    setContributor((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate required fields
  const validateForm = () => {
    if (!contributor.firstName.trim()) {
      showError("Please enter a first name");
      return false;
    }
    if (!contributor.lastName.trim()) {
      showError("Please enter a last name");
      return false;
    }
    if (!userOrgId) {
      showError("We could not determine your organization. Please refresh and try again.");
      return false;
    }
    return true;
  };

  // Show error toast
  const showError = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Handle form submission
  const handleAdd = async () => {
    if (validateForm()) {
      try {
        const payload = {
          ...contributor,
          organizationId: userOrgId,
        };
        const response = await api.post("/contributors", payload);

        console.log("Contributor successfully created:", response.data);

        // Reset the contributor state to initial values
        setContributor(initialContributorState);

        // Close the modal
        handleClose();
        onAdded?.();
      } catch (error: any) {
        const detailedError =
          error && error.message
            ? `Contributor creation failed. Details: ${error.message}`
            : "Contributor creation failed with an unknown error.";
        showError(detailedError);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={handleOpen}>
          {children}
        </DialogTrigger>
        <DialogContent className="border-gray-300 !bg-white !opacity-100 z-[1000] rounded-lg border p-8 shadow-lg sm:min-h-[475px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="mb-4 text-lg font-semibold">
              Add a Contributor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-black mb-1 block text-sm font-medium"
              >
                First Name
              </label>
              <input
                id="firstName"
                placeholder=""
                value={contributor.firstName}
                className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
            placeholder=""
            value={contributor.lastName}
            className="border-gray-400 text-black focus:ring-gray-500 w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2"
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>
        <div className="flex justify-between space-x-4 pt-8">
          <Button
            className="border-gray-400 text-black hover:bg-gray-100 rounded-md border px-6 py-2 text-sm"
            onClick={handleClose}
          >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="border-gray-700 bg-gray-700 text-white hover:bg-gray-800 rounded-md border px-8 py-2 text-sm"
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast component for displaying error messages */}
      <Toast open={showToast} onClose={() => setShowToast(false)}>
        {toastMessage}
      </Toast>
    </>
  );
};

export default AddContributorModal;
