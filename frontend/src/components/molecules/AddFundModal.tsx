"use client";

import React, { ReactNode, useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { ScrollArea } from "@/components/ui/scroll";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import api from "@/utils/api";

type AddFundModalProps = { children: ReactNode; organizationId: string };

const AddFundModal: React.FC<AddFundModalProps> = ({
  children,
  organizationId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"donation" | "endowment">("donation");
  const [restriction, setRestriction] = useState<"restricted" | "unrestricted">(
    "restricted"
  );
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState(""); // NEW
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCancel = () => {
    setIsOpen(false);
    setErrorMsg(null);
    setSubmitting(false);
    // optional: reset fields on cancel
    // setName(""); setType("donation"); setRestriction("restricted"); setDescription(""); setPurpose("");
  };

  const isRestrictedEndowment =
    type === "endowment" && restriction === "restricted";

  const handleAdd = async () => {
    setErrorMsg(null);

    // Frontend required-field checks
    if (!name.trim()) return setErrorMsg("Name is required.");
    if (!type) return setErrorMsg("Type is required.");
    if (isRestrictedEndowment && !purpose.trim())
      return setErrorMsg("Purpose is required for restricted endowments.");

    const body: {
      name: string;
      type: string;
      description: string;
      organizationId: string;
      restriction?: boolean;
      purpose?: string;
      units: number;
    } = {
      name: name.trim(),
      type: type.toUpperCase(), // server expects FundType (e.g., ENDOWMENT or DONATION)
      description: description.trim(),
      organizationId,
      units: 0,
    };

    if (type === "endowment") {
      body.restriction = restriction === "restricted";
      if (restriction === "restricted") {
        body.purpose = purpose.trim();
      }
    }

    try {
      setSubmitting(true);
      await api.post("/funds", body);
      setIsOpen(false);
    } catch (error: any) {
      setErrorMsg(error?.message || "Failed to add fund");
      console.error("Error adding fund:", error);
    } finally {
      setSubmitting(false);
    }
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

          {/* Name */}
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

          {/* Type */}
          <div className="mb-6">
            <Label className="mb-2 block text-lg">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "donation" | "endowment")}
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

          {/* Restriction (only for endowment) */}
          {type === "endowment" && (
            <div className="mb-6">
              <Label className="mb-2 block text-lg">Restriction</Label>
              <RadioGroup
                value={restriction}
                onValueChange={(v) =>
                  setRestriction(v as "restricted" | "unrestricted")
                }
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

          {/* Purpose (required when restricted endowment) */}
          {isRestrictedEndowment && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="purpose" className="text-lg">
                  Purpose
                </Label>
                <span className="text-red-500 text-sm">Required</span>
              </div>
              <Input
                id="purpose"
                placeholder="Describe the restriction purpose"
                value={purpose}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPurpose(e.target.value)
                }
                className="border-gray-300 h-32 w-full resize-none rounded-lg border-[1px] px-4 py-2 text-left"
                as="textarea"
              />
            </div>
          )}

          {/* Description (optional) */}
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
              className="border-gray-300 h-32 w-full resize-none rounded-lg border-[1px] px-4 py-2 text-left"
              as="textarea"
            />
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="text-red-600 mb-4 text-sm">{errorMsg}</div>
          )}

          {/* Footer */}
          <DialogFooter className="mt-8 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "black", color: "white" }}
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundModal;
