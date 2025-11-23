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
import api from "@/utils/api";

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
  onTransactionAdded?: () => void; // Callback to refresh parent data
};

// Define a type for our transaction data
type TransactionData = {
  date: Dayjs | null;
  contributor: string;
  fund: string;
  organizationId: string;
  amount: string;
  unitsPurchased: string;
  type: "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE" | null; // Update to match backend enum (uppercase)
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

type Fund = {
  id: string;
  name: string;
};

// add funcs to load relevant details so user can create transaction
const getContributors = async (): Promise<Contributor[]> => {
  try {
    const response = await api.get("/contributors");
    const responseData = response.data;

    if (responseData && Array.isArray(responseData.contributors)) {
      return responseData.contributors;
    } else if (Array.isArray(responseData)) {
      return responseData;
    } else {
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching contributors:", error);
    throw error;
  }
};
const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get("/organizations");
    const responseData = response.data;

    if (responseData && Array.isArray(responseData.organizations)) {
      return responseData.organizations;
    } else if (Array.isArray(responseData)) {
      return responseData;
    } else {
      return [];
    }
  } catch (error: any) {
    throw error;
  }
};
const getFunds = async (): Promise<Fund[]> => {
  try {
    const response = await api.get("/funds");
    const responseData = response.data;

    if (
      responseData &&
      responseData.funds &&
      Array.isArray(responseData.funds.funds)
    ) {
      return responseData.funds.funds;
    } else if (responseData && Array.isArray(responseData.funds)) {
      return responseData.funds;
    } else if (Array.isArray(responseData)) {
      return responseData;
    } else {
      console.error("Unexpected funds API response structure:", responseData);
      return [];
    }
  } catch (error: any) {
    throw error;
  }
};

const TransactionModal: React.FC<TransactionModalProps> = ({
  children,
  onTransactionAdded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  // transaction we're gonna send to db
  const [transaction, setTransaction] = useState<TransactionData>({
    date: dayjs(),
    contributor: "",
    fund: "",
    organizationId: "",
    amount: "",
    unitsPurchased: "",
    type: null,
    description: "",
    documents: [],
  });

  // state variables
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);
          const [contributorsData, organizationsData, fundsData] =
            await Promise.all([
              getContributors(),
              getOrganizations(),
              getFunds(),
            ]);
          setContributors(contributorsData);
          setOrganizations(organizationsData);
          setFunds(fundsData);
        } catch (err: any) {
          setError("Failed to load data. Please try again.");
          console.error("Error loading data:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen]);

  // Create transaction API call
  const createTransaction = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (
        !transaction.contributor ||
        !transaction.fund ||
        !transaction.amount ||
        !transaction.type ||
        !transaction.unitsPurchased
      ) {
        throw new Error(
          "Please fill in all required fields including units purchased"
        );
      }

      // Get organizationId from selected contributor
      const selectedContributor = contributors.find(
        (c) => c.id === transaction.contributor
      );
      if (!selectedContributor) {
        throw new Error("Please select a valid contributor");
      }

      const payload = {
        date:
          transaction.date?.format("YYYY-MM-DD") ||
          dayjs().format("YYYY-MM-DD"),
        contributorId: transaction.contributor,
        fundId: transaction.fund,
        organizationId: selectedContributor.organizationId,
        amount: parseFloat(transaction.amount),
        units: parseFloat(transaction.unitsPurchased) || 1, // Backend validation requires non-zero value
        type: transaction.type,
        description: transaction.description || "No description provided",
      };

      // Debug: Log the payload to see what we're sending
      console.log("Payload being sent:", payload);
      console.log("Transaction state:", transaction);
      console.log("Selected contributor:", selectedContributor);

      // Additional validation - check for empty strings and undefined values
      const requiredFields = {
        organizationId: payload.organizationId,
        contributorId: payload.contributorId,
        fundId: payload.fundId,
        type: payload.type,
        date: payload.date,
        units: payload.units,
        amount: payload.amount,
        description: payload.description,
      };

      console.log("Required fields check:", requiredFields);

      // Check if any required field is missing or empty
      for (const [key, value] of Object.entries(requiredFields)) {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (typeof value === "number" && isNaN(value))
        ) {
          throw new Error(`${key} is missing or invalid: ${value}`);
        }
      }

      await api.post("/transactions", payload);

      // Success - reset form and close modal
      setTransaction({
        date: dayjs(),
        contributor: "",
        fund: "",
        organizationId: "",
        amount: "",
        unitsPurchased: "",
        type: null,
        description: "",
        documents: [],
      });
      setStep(1);
      setIsOpen(false);

      // Call callback to refresh parent data
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransactionData, value: any) => {
    // Validate numeric fields to prevent negative values
    if (field === "amount" || field === "unitsPurchased") {
      const numericValue = parseFloat(value);
      if (numericValue < 0) {
        return; // Don't update if negative
      }
    }
    setTransaction((prev) => ({ ...prev, [field]: value }));
  };

  // Validation function to check if all required fields are filled
  const validateForm = (): boolean => {
    if (step === 1) {
      return true; // Step 1 just requires selecting transaction type
    }

    if (step === 2) {
      // Check required fields for step 2
      const isContributorSelected = transaction.contributor.trim() !== "";
      const isFundSelected = transaction.fund.trim() !== "";
      const isAmountValid =
        transaction.amount.trim() !== "" && parseFloat(transaction.amount) > 0;
      const isTypeSelected = transaction.type !== null;

      // Units validation depends on transaction type
      let isUnitsValid = true;
      if (
        transaction.type === "WITHDRAWAL" ||
        transaction.type === "INVESTMENT" ||
        transaction.type === "EXPENSE"
      ) {
        // These types require units > 0
        isUnitsValid =
          transaction.unitsPurchased.trim() !== "" &&
          parseFloat(transaction.unitsPurchased) > 0;
      } else if (transaction.type === "DONATION") {
        // DONATION can have units = 1, but field should not be empty
        isUnitsValid =
          transaction.unitsPurchased.trim() !== "" &&
          parseFloat(transaction.unitsPurchased) > 0;
      }

      return (
        isContributorSelected &&
        isFundSelected &&
        isAmountValid &&
        isTypeSelected &&
        isUnitsValid
      );
    }

    if (step === 3) {
      // Step 3 validation (if needed)
      return true;
    }

    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final submit - create transaction
      createTransaction();
    }
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
                    if (index === 2) {
                      setStep(2); // Go to Step 2 for "Add a single transaction"
                    }
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
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Select Contributor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Select
                    values={contributors.map((c) => ({
                      value: c.id,
                      label: `${c.firstName} ${c.lastName}`,
                    }))}
                    onSelect={(value: string) => {
                      const selectedContributor = contributors.find(
                        (c) => c.id === value
                      );
                      handleInputChange("contributor", value);
                      if (selectedContributor) {
                        handleInputChange(
                          "organizationId",
                          selectedContributor.organizationId
                        );
                      }
                    }}
                    placeholder="Choose a contributor"
                    disabled={loading}
                  />
                  <div className="border-gray-300 pointer-events-none absolute inset-0 rounded-lg border" />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Select Fund <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Select
                    values={funds.map((f) => ({ value: f.id, label: f.name }))}
                    onSelect={(value: string) =>
                      handleInputChange("fund", value)
                    }
                    placeholder={
                      funds.length > 0 ? "Choose a fund" : "Loading funds..."
                    }
                    disabled={loading || funds.length === 0}
                  />
                  <div className="border-gray-300 pointer-events-none absolute inset-0 rounded-lg border" />
                </div>
                {funds.length === 0 && !loading && (
                  <p className="text-gray-500 mt-1 text-sm">
                    No funds available
                  </p>
                )}
              </div>
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Amount of contribution{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    value={transaction.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("amount", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Units purchased <span className="text-red-500">*</span>
                    {transaction.type === "DONATION" && (
                      <span className="text-gray-500 ml-1 text-xs"></span>
                    )}
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={transaction.unitsPurchased}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("unitsPurchased", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-base font-medium">
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <RadioGroup
                  value={transaction.type || ""}
                  onValueChange={(value) =>
                    handleInputChange("type", value as TransactionData["type"])
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DONATION" id="donation" />
                    <label htmlFor="donation">Donation</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="WITHDRAWAL" id="withdrawal" />
                    <label htmlFor="withdrawal">Withdrawal</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INVESTMENT" id="investment" />
                    <label htmlFor="investment">Investment</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="EXPENSE" id="expense" />
                    <label htmlFor="expense">Expense</label>
                  </div>
                </RadioGroup>
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-base font-medium">
                  Description of transaction
                </label>
                <textarea
                  placeholder="Enter transaction description..."
                  className="border-gray-300 h-20 w-full rounded border p-3"
                  value={transaction.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label className="block text-base font-medium">
                  Add additional documents
                </label>
                <div className="relative z-0">
                  <DragDrop
                    onDrop={(files) => handleInputChange("documents", files)}
                  />
                </div>
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
        <DialogContent className="h-[678px] w-[800px] rounded-[8px] border-none p-0 shadow-2xl">
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
            <div className="relative w-3/4">
              {/* Fixed Header - Status Messages */}
              <div className="bg-white absolute left-0 right-0 top-0 z-10 px-6 pt-6">
                {error && (
                  <div className="bg-red-100 border-red-300 text-red-700 mb-4 rounded border p-3">
                    {error}
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => setError(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
                {loading && (
                  <div className="text-gray-500 mb-4 text-center">
                    <div className="border-gray-900 inline-block h-4 w-4 animate-spin rounded-full border-b-2"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                )}
              </div>

              {/* Scrollable Content Area */}
              <div
                className="absolute bottom-20 left-0 right-0 top-20 overflow-y-scroll px-6"
                style={{
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="py-4">{renderStep()}</div>
              </div>

              {/* Fixed Footer - Navigation Buttons */}
              <div className="border-gray-200 bg-white absolute bottom-0 left-0 right-0 z-10 border-t px-6 py-4">
                <div className="flex justify-between">
                  {step > 1 && (
                    <Button
                      onClick={handleBack}
                      style={{ padding: "8px 32px" }}
                    >
                      Back
                    </Button>
                  )}
                  {step === 1 && <div></div>}
                  <Button
                    onClick={handleNext}
                    style={{ padding: "8px 32px" }}
                    disabled={loading || !validateForm()}
                  >
                    {loading ? "Processing..." : step < 3 ? "Next" : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionModal;
