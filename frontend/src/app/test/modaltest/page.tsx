"use client"; // Add this line at the very top!

import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";

import AddContributorModal from "@/components/molecules/AddContributorModal"; // Make sure the path is correct

const ModalTestPage = () => {
  return (
    <div className="p-4">
      <AddContributorModal>
        <Button variant="primary">Open Contributor Modal</Button>
      </AddContributorModal>
    </div>
  );
};

export default ModalTestPage;
