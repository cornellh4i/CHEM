import React from "react";
import Button from "@/components/atoms/Button";
import TransactionModal from "@/components/molecules/AddTransactionModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ModalTestPage = () => {
  return (
    <div className="p-4">
      <TransactionModal></TransactionModal>
    </div>
  );
};

export default ModalTestPage;
