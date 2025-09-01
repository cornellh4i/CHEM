import React from "react";
import Button from "@/components/atoms/Button";
import AddContributorModal from "@/components/molecules/AddContributorModal"; // make sure this import is correct

const ModalTestPage = () => {
  return (
    <div className="p-4">
      <AddContributorModal>
        <Button className="border-black bg-gray-800 text-white rounded-2xl border px-8 py-3 text-lg">
          Open Contributor Modal
        </Button>
      </AddContributorModal>
    </div>
  );
};

export default ModalTestPage;
