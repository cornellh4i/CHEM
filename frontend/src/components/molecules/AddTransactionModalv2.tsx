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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import Toast from "@/components/atoms/Toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Dialog,
  DialogClose,
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
  const [step, setStep] = useState(1);
  const [transaction, setTransaction] = useState<TransactionData>({
    date: dayjs(),
    contributor: "",
    fund: "",
    amount: "",
    unitsPurchased: "",
    type: null,
    description: "",
    documents: [],
  });

  const handleInputChange = (field: keyof TransactionData, value: any) => {
    setTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setIsOpen(false); // Final submit action could go here
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex h-full flex-col">
            <DialogTitle className="mb-6 text-xl">
              Choose transaction type
            </DialogTitle>

            <div className="flex flex-grow flex-col gap-4">
              {[
                "Add multiple transactions",
                "Add by CSV",
                "Add a single transaction",
              ].map((label, index) => (
                <button
                  key={index}
                  className="border-gray-300 hover:border-black flex flex-1 items-center justify-center rounded-xl border-2 px-4 py-6 text-center text-lg transition-colors"
                  onClick={() => {
                    if (index === 2) setTransaction({ ...transaction });
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <DialogTitle className="mb-4 text-xl">
              Manually enter contribution
            </DialogTitle>
            <div>
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    First Name
                  </label>
                  <Input placeholder="Jane" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Last Name
                  </label>
                  <Input placeholder="Smith" />
                </div>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Amount of contribution
                  </label>
                  <Input placeholder="Smith" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Units purchased
                  </label>
                  <Input placeholder="----" className="bg-gray-100" disabled />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-base font-medium">
                  Description of transaction
                </label>
                <textarea
                  placeholder="Enter in a soft contributor..."
                  className="border-gray-300 h-15% w-full rounded border p-3"
                />
              </div>
              <div className="mb-3">
                <label className="block text-base font-medium">
                  Add additional documents
                </label>
                <DragDrop
                  onDrop={(files) => handleInputChange("documents", files)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-md px-4 text-sm font-light text-[#747474]"
                >
                  Add an additional document
                </button>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle className="mb-6 text-xl">
              Update market value
            </DialogTitle>
            <div>
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-base font-medium">
                    Update your market value
                  </label>
                  <Input />
                </div>
                <div>
                  <label className="mb-2 block text-base font-medium">
                    Total Units
                  </label>
                  <Input placeholder="----" className="bg-gray-100" disabled />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-base font-medium">Date</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={transaction.date}
                    onChange={(newValue) => handleInputChange("date", newValue)}
                    disableOpenPicker
                    className="border-gray-900 bg-gray-200 text-gray-900 placeholder-gray-500 hover:bg-gray-100 mr-4 block w-full rounded-lg px-2 py-3.5 text-sm"
                  />
                </LocalizationProvider>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          asChild
          onClick={() => {
            setIsOpen(true);
            setStep(1);
          }}
        >
          {children}
        </DialogTrigger>
        <DialogContent className="h-[678px] w-[800px] rounded-[8px] border-none p-0">
          <div className="flex h-full">
            {/* Sidebar Stepper */}
            <div
              dir="rtl"
              className="text-gray-500 flex w-1/4 flex-col justify-start space-y-4 border-s border-s-[#DFDFDE] px-4 py-6"
            >
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex space-x-4 space-x-reverse ${
                  step === s ? "text-black font-bold" : "" }`}
                >
                  <span className="w-full break-words pt-1 text-left text-sm leading-tight">
                    {s === 1
                      ? "Choose transaction type"
                      : s === 2
                        ? "Enter new data"
                        : "Update fund value"}
                  </span>
                  <div
                    className={`flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded bg-[#DFDFDE] ${
                    step === s ? "bg-black text-white" : "" }`}
                  >
                    {s}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Step Content */}
            <div className="flex w-3/4 flex-col justify-between px-6 py-8">
              <div className="h-full overflow-y-auto pr-2">{renderStep()}</div>

              <div className="mt-6 flex justify-between">
                {step > 1 && (
                  <Button onClick={handleBack} style={{ padding: "8px 32px" }}>
                    Back
                  </Button>
                )}
                {step === 1 && <div></div>}
                <Button onClick={handleNext} style={{ padding: "8px 32px" }}>
                  {step < 3 ? "Next" : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionModal;
