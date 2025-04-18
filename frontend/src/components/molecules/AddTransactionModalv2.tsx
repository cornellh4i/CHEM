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
          <>
            <DialogTitle className="mb-4 text-2xl">
              Choose transaction type
            </DialogTitle>
            <div className="space-y-4">
              <Button className="w-full">Add multiple transactions</Button>
              <Button className="w-full">Add by CSV</Button>
              <Button className="w-full">Add a single transaction</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <DialogTitle className="mb-4 text-2xl">
              Manually enter contribution
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
              <Input placeholder="Amount of contribution" />
              <Input placeholder="Units purchased" />
            </div>
            <textarea
              placeholder="Description of transaction"
              className="mt-4 w-full rounded border p-2"
              rows={3}
            />
            <div className="mt-4">
              <DragDrop
                onDrop={(files) => handleInputChange("documents", files)}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <DialogTitle className="mb-4 text-2xl">
              Update market value
            </DialogTitle>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Update your market value" />
              <Input placeholder="Total units" disabled />
            </div>
            <div className="mt-4">
              <Input placeholder="Date" />
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
        <DialogContent
          className="w-[800px] h-[678px] rounded-[8px] p-0 border-none"
        >
          <div className="flex h-full">
            {/* Sidebar Stepper */}
            <div dir="rtl" className="text-gray-500 flex w-1/4 flex-col justify-start space-y-4 py-6 px-4 border-s border-s-[#DFDFDE]">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex space-x-4 space-x-reverse ${
                    step === s ? "text-black font-bold" : ""
                  }`}
                >
                  <span className="text-sm leading-tight w-full break-words text-left pt-1">
                    {s === 1
                      ? "Choose transaction type"
                      : s === 2
                        ? "Enter new data"
                        : "Update fund value"}
                  </span>
                  <div
                    className={`flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded bg-[#DFDFDE] ${
                    step === s
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {s}
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Main Step Content */}
            <div className="flex w-3/4 flex-col justify-between pl-6">
              <div className="max-h-[650px] overflow-y-auto pr-2">
                {renderStep()}
              </div>

              <div className="mt-6 flex justify-between">
                <Button onClick={handleBack} disabled={step === 1}>
                  Back
                </Button>
                <Button onClick={handleNext}>
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
