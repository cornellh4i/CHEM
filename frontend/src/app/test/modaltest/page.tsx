import React from "react";
import Button from "@/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OpenContributorModal from "@/components/molecules/OpenContributorModal";

interface ModalProps {
  buttonText?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  buttonText = "Open Modal",
  title,
  description,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

const ExamplePage = () => {
  const donorInfo = {
    date: "January 25, 2024",
    fund: "Milstein Fund",
    amount: "$9,336.84"
  };
  const documents = [
    { name: "receipt.pdf", date: "Tue Mar 12 • 230 KB" },
    { name: "note.pdf", date: "Tue Mar 12 • 230 KB" },
  ];
  return (
    <div className="p-4">
      <OpenContributorModal
        buttonText="Open Donor Modal"
        title="Claire Lee"
        description="This is a repeated donor and this is her fifth donation."
        donorInfo={donorInfo}
        documents={documents}
      />
    </div>
  );
};

export default ExamplePage;
