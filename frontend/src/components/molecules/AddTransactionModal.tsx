import React from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Radio from "@/components/atoms/Radio";
import { ScrollArea } from "@/components/ui/scroll"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/atoms/DatePicker";

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
        <Button >Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="pt-[100px] px-[100px] w-[810px] h-[800px] justify-center rounded-[40px]">
      <ScrollArea className="w-full h-full">
        <DialogHeader>
          <DialogTitle className="text-[32px] mb-[48px]">Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="text-[22px] mb-2">Date</div>
        <div className="h-[51px] w-[268px] rounded-lg bg-gray-200">
        {/* <DatePicker/> */}
        </div>
        <div className="text-[22px] mt-[32px]">Contributer</div>

        <div className="text-[22px] mt-[32px]">Fund</div>

        <div className="text-[22px] mt-[32px]">Amount</div>
        <div className="grid grid-cols-4 ">
        <Input
                id="amount"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
        </div>

        <div className="text-[22px] mt-[32px]">Units purchased</div>
        <Input
                id="fund"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />

        <div className="grid grid-cols-2 mt-[32px]">
            <div className="justify-start">
                <div className="text-[22px]">Transaction</div>
                <div className="ml-2"><Radio label="Deposit" ></Radio>
                <Radio label="Withdrawl"></Radio></div>
            </div>
            <div className="justify-start">
                <div className="text-[22px]">Type</div>
                <div className="ml-2"><Radio label="Deposit"></Radio>
                <Radio label="Withdrawl"></Radio></div>
            </div>
        </div>

            
        <DialogFooter>
            <Button variant = "primary">
              Add
              </Button>
          </DialogFooter>
          </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;