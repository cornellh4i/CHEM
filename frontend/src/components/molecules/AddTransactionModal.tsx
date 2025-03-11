"use client";
import React, { ReactNode, useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Radio from "@/components/atoms/Radio";
import Select from "@/components/atoms/Select";
import { ScrollArea } from "@/components/ui/scroll";
import { DatePicker } from "@/components/atoms/DatePicker";
import { Calendar } from "@/components/ui/calendar";
import DragDrop from "@/components/molecules/DragDrop";

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

const TransactionModal: React.FC<TransactionModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleAdd = () => {
    // Add transaction logic here
    handleClose();
  };

  return (
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
          <div>
            <DatePicker></DatePicker>
          </div>
          <div className="mt-[32px] text-[22px]">Contributer</div>
          <Select
            placeholder="Select a Contributer"
            values={["Sarah Clay", "Theo Rumberg", "Brandon Wu"]}
            width="95%"
          ></Select>
          <div className="mt-[32px] text-[22px]">Fund</div>
          <Select
            placeholder="Select a Fund"
            values={["Robert Fund", "Sophie Fund", "Edward Fund"]}
            width="95%"
          ></Select>
          <div className="mb-2 mt-[32px] text-[22px]">Amount</div>
          <Input
            id="amount"
            defaultValue="$"
            className="border-black text-gray-900 placeholder-gray-500 hover:bg-gray-100 mr-4 block w-[95%] rounded-lg border px-2 py-3.5 text-sm"
          />
          <div className="mb-2 mt-[32px] text-[22px]">Units purchased</div>
          <Input
            id="units purchased"
            className="border-gray-900 bg-gray-200 text-gray-900 placeholder-gray-500 hover:bg-gray-100 mr-4 block w-[95%] rounded-lg border px-2 py-3.5 text-sm"
          />
          <div className="mt-[32px] grid grid-cols-2">
            <div className="justify-start">
              <div className="text-[22px]">Transaction</div>
              <div className="ml-2 mt-3 space-y-2 text-[22px]">
                <Radio label="Deposit"></Radio>
                <Radio label="Withdrawl"></Radio>
              </div>
            </div>
            <div className="justify-start">
              <div className="text-[22px]">Type</div>
              <div className="ml-2 mt-3 space-y-2 text-[22px]">
                <Radio label="Donation"></Radio>
                <Radio label="Endowment"></Radio>
              </div>
            </div>
          </div>
          <div className="relative mt-[32px]">
            <div className="absolute left-0 text-[22px]">Description</div>
            <div className="text-gray-300 absolute right-10 text-[22px] italic">
              Optional
            </div>
          </div>
          <textarea
            className="border-black ml-0.5 mt-[42px] h-[150px] w-[95%] rounded-2xl border"
            placeholder="Add a description"
            rows={4}
            cols={40}
          />
          <div className="mt-[32px] text-[22px]">Additional documents</div>
          <div className="relative mt-2">
            <div className="text-gray-300 absolute left-0 text-[18px]">
              Upload a file (5MB max)
            </div>
            <div className="text-gray-300 absolute right-10 text-[22px] italic">
              Optional
            </div>
          </div>
          <DragDrop></DragDrop>
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
  );
};

export default TransactionModal;
