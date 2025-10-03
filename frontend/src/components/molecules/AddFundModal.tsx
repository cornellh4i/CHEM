"use client";

import React, { ReactNode, useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { ScrollArea } from "@/components/ui/scroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type AddFundModalProps = {
  children: ReactNode;
};

const AddFundModal: React.FC<AddFundModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("donation");
  const [restriction, setRestriction] = useState("restricted");
  const [description, setDescription] = useState("");

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleAdd = async () => {
    console.log({
      name,
      type,
      restriction,
      description,
    });

    const body: {
      name: string;
      type: string;
      description: string;
      organizationId: string;
      restriction?: boolean;
    } = {
      name,
      type: type.toUpperCase(),
      description,
      organizationId: "techcorp-id", //hardcoded ts, should add some extra arg
    };

    if (type === "endowment") {
      body.restriction = restriction === "restricted";
    }

    try {
      const response = await fetch("http://localhost:8000/funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add fund");
      }

      console.log("Fund added successfully");
    } catch (error: any) {
      console.error("Error adding fund, ", error);
    }
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="h-auto w-[700px] rounded-[40px] px-[80px] pb-[40px] pt-[60px]">
        <ScrollArea className="h-full w-full">
          <DialogHeader>
            <DialogTitle className="mb-[32px] text-[28px]">
              Add Fund
            </DialogTitle>
          </DialogHeader>

          {/* Name Field */}
          <div className="mb-6">
            <Label htmlFor="name" className="mb-2 block text-lg">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Add a name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>

          {/* Type Field (vertical layout) */}
          <div className="mb-6">
            <Label className="mb-2 block text-lg">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={setType}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="donation" id="donation" />
                <Label htmlFor="donation">Donation</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="endowment" id="endowment" />
                <Label htmlFor="endowment">Endowment</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Restriction Field (vertical layout) */}
          {type === "endowment" && (
            <div className="mb-6">
              <Label className="mb-2 block text-lg">Restriction</Label>
              <RadioGroup
                value={restriction}
                onValueChange={setRestriction}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <Label htmlFor="restricted">Restricted</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="unrestricted" id="unrestricted" />
                  <Label htmlFor="unrestricted">Unrestricted</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Description Field */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
              <span className="text-gray-300 text-sm">Optional</span>
            </div>
            <Input
              id="description"
              placeholder="Add a Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              className="border-gray-300 h-32 w-full resize-none rounded-lg border-[1px] px-4 py-2 text-left" // Ensures left-aligned text
              as="textarea"
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="mt-8 flex items-center justify-between">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "black", color: "white" }}
              onClick={handleAdd}
            >
              Add
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundModal;
