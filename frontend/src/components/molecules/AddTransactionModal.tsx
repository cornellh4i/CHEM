"use client";
import React, { ReactNode, useState, useRef, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Radio from "@/components/atoms/Radio";
import Select from "@/components/atoms/Select";
import { ScrollArea } from "@/components/ui/scroll";
import { Calendar } from "@/components/ui/calendar";
import DragDrop from "@/components/molecules/DragDrop";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Toast from "@/components/atoms/Toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type TransactionModalProps = {
  children: ReactNode;
};

// Define a type for our transaction data
type TransactionData = {
  date: Dayjs | null;
  contributor: string;
  fund: string;
  amount: string;
  unitsPurchased: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE" | null; // Update to match backend enum (uppercase)
  description: string;
  documents: File[];
};

type Contributor = {
  id: string;
  firstName: string;
  lastName: string;
  organizationId: string;
};

type Organization = {
  id: string;
  name: string;
};
const getContributors = async (): Promise<Contributor[]> => {
  try {
    const response = await fetch("http://localhost:8000/contributors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Attempt to extract the error message from the response
      const errorData = await response.json();
    }

    // Parse the JSON response to retrieve the list of contributor objects
    const responseData = await response.json();
    if (responseData && Array.isArray(responseData.contributors)) {
      return responseData.contributors;
    } else if (Array.isArray(responseData)) {
      // If the response is already an array, return it directly
      return responseData;
    } else {
      return []; // Return empty array as fallback
    }
  } catch (error: any) {
    console.error("Error fetching contributors:", error);
    throw error;
  }
};
const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await fetch("http://localhost:8000/organizations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Attempt to extract the error message from the response
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch organizations");
    }

    // Parse the JSON response to retrieve the list of contributor objects
    const responseData = await response.json();
    if (responseData && Array.isArray(responseData.organizations)) {
      return responseData.organizations;
    } else if (Array.isArray(responseData)) {
      // If the response is already an array, return it directly
      return responseData;
    } else {
      return []; // Return empty array as fallback
    }
  } catch (error: any) {
    throw error;
  }
};
const TransactionModal: React.FC<TransactionModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Initial transaction state
  const initialTransactionState: TransactionData = {
    date: dayjs(),
    contributor: "",
    fund: "",
    amount: "",
    unitsPurchased: "",
    type: null,
    description: "",
    documents: [],
  };

  // State to store all form values
  const [transaction, setTransaction] = useState<TransactionData>(
    initialTransactionState
  );

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Effect to update state from refs when needed
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getContributors();
        setContributors(data);
      } catch (err: any) {
        showError("Failed to load contributors.");
      }
    };

    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (err: any) {
        showError("Failed to load organizations.");
      }
    };

    fetchContributors();
    fetchOrganizations();
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof TransactionData, value: any) => {
    setTransaction((prev) => {
      const newState = {
        ...prev,
        [field]: value,
      };
      return newState;
    });
  };

  // Validate required fields
  const validateForm = () => {
    if (!transaction.date) {
      showError("Please select a date");
      return false;
    }
    if (!transaction.contributor) {
      showError("Please select a contributor");
      return false;
    }
    if (!transaction.fund) {
      showError("Please select a fund");
      return false;
    }
    if (!transaction.amount || transaction.amount === "$") {
      showError("Please enter an amount");
      return false;
    }
    if (!transaction.unitsPurchased) {
      showError("Please enter units purchased");
      return false;
    }
    if (!transaction.type) {
      showError("Please select transaction type");
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
    const amountValue = parseFloat(transaction.amount.replace(/[^0-9.]/g, ""));
    const unitValue = parseFloat(
      transaction.unitsPurchased.replace(/[^0-9.]/g, "")
    );
    if (isNaN(amountValue) || amountValue <= 0) {
      showError("Amount must be a positive number");
      return;
    }

    if (isNaN(unitValue) || unitValue <= 0) {
      showError("Units must be a positive number");
      return;
    }
    if (validateForm()) {
      console.log(transaction.fund);
      const transactionPayload = {
        organizationId: transaction.fund,
        contributorId: transaction.contributor,
        type: transaction.type,
        date: transaction.date, // format the date as needed
        units: unitValue,
        amount: amountValue,
        description: transaction.description || "No description",
        fund: transaction.fund,
      };

      try {
        const response = await fetch("http://localhost:8000/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showError(errorData.error || "Failed to create transaction");
          return;
        }

        const newTransaction = await response.json();
        console.log("Transaction successfully created:", newTransaction);

        // Reset the transaction state to initial values
        setTransaction(initialTransactionState);

        // Close the modal
        handleClose();
      } catch (error: any) {
        const detailedError =
          error && error.message
            ? `Transaction creation failed. Details: ${error.message}`
            : "Transaction creation failed with an unknown error.";
        showError(detailedError);
      }

      setTransaction(initialTransactionState);

      // Close the modal
      handleClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={handleOpen}>
          {children}
        </DialogTrigger>
        <DialogContent className="h-[800px] w-[810px] justify-center rounded-[40px] px-[100px] pt-[100px]">
          <ScrollArea className="h-full w-[600px]">
            <DialogHeader>
              <DialogTitle className="mb-[48px] text-[32px]">
                Add Transaction
              </DialogTitle>
            </DialogHeader>
            <div className="mb-2 text-[22px]">Date</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={transaction.date}
                onChange={(newValue) => handleInputChange("date", newValue)}
                disableOpenPicker
                className="border-gray-900 bg-gray-200 text-gray-900 placeholder-gray-500 hover:bg-gray-100 mr-4 block w-full rounded-lg px-2 py-3.5 text-sm"
              />
            </LocalizationProvider>

            <div className="mt-[32px] text-[22px]">Contributer</div>
            <Select
              placeholder="Select a Contributor"
              values={contributors.map((contributor) => ({
                value: contributor.id,
                org: contributor.organizationId,
                label: `${contributor.firstName} ${contributor.lastName}`,
              }))}
              width="95%"
              onSelect={(value) => handleInputChange("contributor", value)}
            ></Select>

            <div className="mt-[32px] text-[22px]">Fund</div>
            <Select
              placeholder="Select a Fund"
              values={organizations.map((organization) => ({
                value: organization.id,
                label: organization.name,
              }))}
              width="95%"
              onSelect={(value) => handleInputChange("fund", value)}
            ></Select>

            <div className="mb-2 mt-[32px] text-[22px]">Amount</div>
            <Input
              id="amount"
              defaultValue=""
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("amount", e.target.value)
              }
              className="border-black text-gray-900 placeholder-gray-500 hover:bg-gray-100 mr-4 block w-[95%] rounded-lg border px-2 py-3.5 text-sm"
            />

            <div className="mb-2 mt-[32px] text-[22px]">Units purchased</div>
            <Input
              id="units purchased"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("unitsPurchased", e.target.value)
              }
              className="border-gray-900 bg-gray-200 text-gray-900 placeholder-gray-500 hover:bg-gray-100 mr-4 block w-[95%] rounded-lg border px-2 py-3.5 text-sm"
            />

            <div className="mt-[32px] grid grid-cols-2">
              <div className="justify-start">
                <div className="mb-2 text-[22px]">Transaction Type</div>
                <RadioGroup
                  className="lg-2 space-y-1"
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DONATION" id="donation" />
                    <label htmlFor="donation" className="text-[18px]">
                      Donation
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="WITHDRAWAL" id="withdrawal" />
                    <label htmlFor="withdrawal" className="text-[18px]">
                      Withdrawl
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INVESTMENT" id="investment" />
                    <label htmlFor="investment" className="text-[18px]">
                      Investment
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="EXPENSE" id="expense" />
                    <label htmlFor="expense" className="text-[18px]">
                      Expense
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="relative mt-[32px]">
              <div className="absolute left-0 text-[22px]">Description</div>
              <div
                className="text-gray-300 absolute right-10 text-[22px] italic"
              >
                Optional
              </div>
            </div>
            <textarea
              className="border-black ml-0.5 mt-[42px] h-[150px] w-[95%] rounded-2xl border"
              placeholder="Add a description"
              value={transaction.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              cols={40}
            />

            <div className="mt-[32px] text-[22px]">Additional documents</div>
            <div className="relative mt-2">
              <div className="text-gray-300 absolute left-0 text-[18px]">
                Upload a file (5MB max)
              </div>
              <div
                className="text-gray-300 absolute right-10 text-[22px] italic"
              >
                Optional
              </div>
            </div>
            <DragDrop
              onDrop={(files: File[]) => handleInputChange("documents", files)}
            ></DragDrop>

            <div className="relative mb-2 mt-[100px]">
              <Button
                className="border-black text-black absolute left-0 mb-2 me-2 rounded-2xl border px-16 py-3 text-lg hover:bg-grey-dark focus:outline-none"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="border-black bg-gray-800 text-white absolute right-5 mb-2 me-2 rounded-2xl border px-20 py-3 text-lg hover:bg-grey-dark focus:outline-none"
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
            <DialogFooter></DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Toast component for displaying error messages */}
      <Toast open={showToast} onClose={() => setShowToast(false)}>
        {toastMessage}
      </Toast>
    </>
  );
};

export default TransactionModal;
