"use client";
import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Radio from "@/components/atoms/Radio";
import Select from "@/components/atoms/Select";
import { ScrollArea } from "@/components/ui/scroll";
import { DatePicker } from "@/components/atoms/DatePicker";
import { Calendar } from "@/components/ui/calendar";

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
            values={["Robert Fund", "Sophie Fund", "Edward Fund"]}
            width="95%"
          ></Select>
          <div className="mt-[32px] text-[22px]">Fund</div>
          <Select
            placeholder="Select a Fund"
            values={["Sarah Clay", "Theo Rumberg", "Brandon Wu"]}
            width="95%"
          ></Select>
          <div className="mb-2 mt-[32px] text-[22px]">Amount</div>
          <Input
            id="amount"
            defaultValue="$"
            className="mr-4 block w-[95%] rounded-lg border border-black px-2 py-3.5 text-sm text-gray-900 placeholder-gray-500 hover:bg-gray-100"
          />
          <div className="mb-2 mt-[32px] text-[22px]">Units purchased</div>
          <Input
            id="units purchased"
            className="mr-4 block w-[95%] rounded-lg border border-gray-900 bg-gray-200 px-2 py-3.5 text-sm text-gray-900 placeholder-gray-500 hover:bg-gray-100"
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
                <Radio label="Deposit"></Radio>
                <Radio label="Withdrawl"></Radio>
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
            className="ml-0.5 mt-[42px] h-[150px] w-[95%] rounded-2xl border border-black"
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
          <div className="mt-[46px] h-[51px] w-[95%] rounded-lg bg-gray-200"></div>
          <div className="relative mt-[100px]">
            <Button className="absolute left-0 mb-2 me-2 rounded-2xl border border-black px-16 py-3 text-lg text-black hover:bg-grey-dark focus:outline-none focus:ring-4 focus:ring-gray-300">
              Cancel
            </Button>
            <Button className="absolute right-5 mb-2 me-2 rounded-2xl border border-black bg-gray-800 px-20 py-3 text-lg text-white hover:bg-grey-dark focus:outline-none focus:ring-4 focus:ring-gray-300">
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
