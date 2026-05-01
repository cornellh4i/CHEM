"use client";

import React, { ReactNode, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import api from "@/utils/api";

type AddFundModalProps = { children: ReactNode };

const AddFundModal: React.FC<AddFundModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userOrgId, setUserOrgId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"donation" | "endowment">("donation");
  const [restriction, setRestriction] = useState<"restricted" | "unrestricted">("restricted");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    api.get("/auth/login").then((res) => {
      const user = res.data?.user;
      const orgId = user?.organizationId || user?.organization?.id;
      if (orgId) setUserOrgId(orgId);
    }).catch((err) => console.error("Failed to load user org", err));
  }, []);

  const handleCancel = () => {
    setIsOpen(false);
    setErrorMsg(null);
    setSubmitting(false);
  };

  const isRestrictedEndowment = type === "endowment" && restriction === "restricted";

  const handleAdd = async () => {
    setErrorMsg(null);

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
      type: type.toUpperCase(),
      description: description.trim(),
      organizationId: userOrgId ?? "",
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
      <DialogContent className="w-[480px] rounded-2xl p-8">
        <VisuallyHidden.Root>
          <DialogTitle>Add fund</DialogTitle>
        </VisuallyHidden.Root>

        {/* Title */}
        <h2 className="mb-6 text-2xl font-bold">Add fund</h2>

        {/* Name */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>

        {/* Type */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Type<span className="text-red-500">*</span>
          </label>
          <RadioGroup
            value={type}
            onValueChange={(v) => setType(v as "donation" | "endowment")}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="donation" id="donation" />
              <Label htmlFor="donation" className="text-sm font-normal">Donation</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="endowment" id="endowment" />
              <Label htmlFor="endowment" className="text-sm font-normal">Endowment</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Restriction — always shown */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Restriction<span className="text-red-500">*</span>
          </label>
          <RadioGroup
            value={restriction}
            onValueChange={(v) => setRestriction(v as "restricted" | "unrestricted")}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="restricted" id="restricted" />
              <Label htmlFor="restricted" className="text-sm font-normal">Restricted</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="unrestricted" id="unrestricted" />
              <Label htmlFor="unrestricted" className="text-sm font-normal">Unrestricted</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Purpose — only for restricted endowments */}
        {isRestrictedEndowment && (
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium">
              Purpose<span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe the restriction purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Description</label>
            <span className="text-xs text-gray-400">Optional</span>
          </div>
          <textarea
            placeholder="Add a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 text-sm text-red-600">{errorMsg}</div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="text-sm underline text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={submitting}
            className="rounded-full px-6 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#3E6DA6" }}
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundModal;
