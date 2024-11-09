"use client";
import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Radio from "@/components/atoms/Radio";
import Select from "@/components/atoms/Select";
import ScrollableSelect from "@/components/atoms/ScrollableSelect";
import { ScrollArea } from "@/components/ui/scroll";
// import { DatePicker } from "@/components/atoms/DatePicker";
import { Calendar } from "@/components/ui/calendar";
import DragDrop from "@/components/molecules/DragDrop";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radiogroup";
import { ShadInput } from "@/components/ui/input";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TransactionModal = ({}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="h-[800px] w-[810px] justify-center rounded-[40px] px-[100px] pt-[100px] [&>button]:hidden">
        <ScrollArea className="h-full w-[600px]">
          <DialogHeader>
            <DialogTitle className="mb-[48px] text-[32px]">
              Add Transaction
            </DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-[22px]">Date</div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker />
            </LocalizationProvider>
            {/* <DatePicker></DatePicker> */}
          </div>
          <div className="mb-2 mt-[32px] text-[22px]">Contributer</div>
          <ScrollableSelect
            placeholder="Select a Contributer"
            values={[
              "Sarah Clay",
              "Theo Rumberg",
              "Brandon Wu",
              "Sarah Clay",
              "Theo Rumberg",
              "Brandon Wu",
              "Sarah Clay",
              "Theo Rumberg",
              "Brandon Wu",
              "Sarah Clay",
              "Theo Rumberg",
              "Brandon Wu",
              "Sarah Clay",
              "Theo Rumberg",
              "Brandon Wu",
            ]}
            width="w-[580px]"
          ></ScrollableSelect>
          <div className="mb-2 mt-[32px] text-[22px]">Fund</div>
          <ScrollableSelect
            placeholder="Select a Fund"
            values={["Robert Fund", "Sophie Fund", "Edward Fund"]}
            width="w-[580px]"
          ></ScrollableSelect>
          <div className="mb-2 mt-[32px] text-[22px]">Amount</div>
          <Input
            type="text"
            placeholder="Enter an Amount"
            className="flex h-9 w-[95%] rounded-md border border-black bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-black focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="mb-2 mt-[32px] text-[22px]">Units purchased</div>
          <Input
            type="text"
            placeholder=""
            className="flex h-9 w-[95%] rounded-md border border-black bg-gray-100 px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-black focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
          <div className="mt-[32px] grid grid-cols-2">
            <div className="justify-start">
              <div className="text-[22px]">Transaction</div>
              <div className="ml-2 mt-4 space-y-2 text-[22px]">
                <RadioGroup defaultValue="comfortable">
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="default" id="r1" />
                    <div className="text-[18px]">Deposit</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="compact" id="r2" />
                    <div className="text-[18px]">Withdrawl</div>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="justify-start">
              <div className="text-[22px]">Type</div>
              <div className="ml-2 mt-4 space-y-2 text-[22px]">
                <RadioGroup defaultValue="comfortable">
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="default" id="r1" />
                    <div className="text-[18px]">Donation</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="compact" id="r2" />
                    <div className="text-[18px]">Endowment</div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="relative mt-[32px]">
            <div className="absolute left-0 text-[22px]">Description</div>
            <div className="absolute right-10 text-[22px] italic text-gray-300">
              Optional
            </div>
          </div>
          <textarea
            className="ml-0.5 mt-[42px] h-[150px] w-[95%] rounded-2xl border border-black focus:border-black focus:ring-0"
            placeholder="Add a description"
            rows={4}
            cols={40}
          />
          <div className="mt-[32px] text-[22px]">Additional documents</div>
          <div className="relative mt-2">
            <div className="absolute left-0 text-[18px] text-gray-300">
              Upload a file (5MB max)
            </div>
            <div className="absolute right-10 text-[22px] italic text-gray-300">
              Optional
            </div>
          </div>
          <DragDrop></DragDrop>
          <div className="relative mb-2 mt-[100px]">
            <Button className="absolute left-0 mb-2 me-2 rounded-2xl border border-black px-16 py-3 text-lg text-black hover:bg-grey-dark focus:outline-none">
              Cancel
            </Button>
            <Button className="absolute right-5 mb-2 me-2 rounded-2xl border bg-gray-600 px-20 py-3 text-lg text-white hover:bg-grey-dark focus:outline-none">
              Add
            </Button>
          </div>
          <DialogFooter></DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
