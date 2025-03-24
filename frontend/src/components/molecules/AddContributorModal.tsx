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
import Select from "@/components/atoms/Select";

// Define types
type Organization = {
  id: string;
  name: string;
};

type ContributorData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  organizationId: string;
};

type AddContributorModalProps = {
  children: ReactNode;
};

// Function to fetch organizations
async function getOrganizations() {
  try {
    const response = await fetch("http://localhost:8000/organizations");
    if (!response.ok) {
      throw new Error("Failed to fetch organizations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

const AddContributorModal: React.FC<AddContributorModalProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Initial contributor state
  const initialContributorState: ContributorData = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    organizationId: "",
  };

  // State to store all form values
  const [contributor, setContributor] = useState<ContributorData>(
    initialContributorState
  );

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Effect to fetch organizations when modal opens
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err: any) {
        showError("Failed to load organizations.");
      }
    };

    fetchOrganizations();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof ContributorData, value: any) => {
    setContributor((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Parse name input into firstName and lastName
  const handleNameChange = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");
      handleInputChange("firstName", firstName);
      handleInputChange("lastName", lastName);
    } else if (parts.length === 1) {
      handleInputChange("firstName", parts[0]);
      handleInputChange("lastName", "");
    }
  };

  // Validate required fields
  const validateForm = () => {
    if (!contributor.firstName) {
      showError("Please enter a first name");
      return false;
    }
    if (!contributor.lastName) {
      showError("Please enter a last name");
      return false;
    }
    if (!contributor.organizationId) {
      showError("Please select an organization");
      return false;
    }
    if (!contributor.email) {
      showError("Please enter an email address");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contributor.email)) {
      showError("Please enter a valid email address");
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
        const response = await fetch("http://localhost:8000/contributors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contributor),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showError(errorData.error || "Failed to create contributor");
          return;
        }

        const newContributor = await response.json();
        console.log("Contributor successfully created:", newContributor);

        // Reset the contributor state to initial values
        setContributor(initialContributorState);

        // Close the modal
        handleClose();
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
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="organization"
                className="text-black mb-1 block text-sm font-medium"
              >
                Organization
              </label>
              <Select
                placeholder="Select an Organization"
                values={organizations.map((org) => ({
                  value: org.id,
                  label: org.name,
                }))}
                width="100%"
                onSelect={(value) => handleInputChange("organizationId", value)}
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
                value={contributor.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
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
                value={contributor.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                value={contributor.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
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
