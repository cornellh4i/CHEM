import React from "react";
import Button from "@/components/atoms/Button";
import AddTransactionModal from "@/components/molecules/AddTransactionModal";
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
      <AddTransactionModal>
        <Button className="border-black bg-gray-800 text-white rounded-2xl border px-8 py-3 text-lg">
          Open Transaction Modal
        </Button>
      </AddTransactionModal>
    </div>
  );
};

export default ModalTestPage;
