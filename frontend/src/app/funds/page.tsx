"use client";

import DashboardTemplate from "@/components/templates/DashboardTemplate";
import AddFundModal from "@/components/molecules/AddFundModal";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@/components/atoms/Button";

const FundsPage = () => {
  return (
    <DashboardTemplate>
      <div className="flex flex-col px-8 py-6">
        {/* Top section with heading and Add Fund button */}
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-3xl">Funds</h1>
          <AddFundModal>
            <Button
              variant="primary"
              style={{
                display: "flex",
                alignItems: "center",
                height: "40px",
                padding: "0 16px",
              }}
            >
              Add Fund
              <AddIcon style={{ marginLeft: "6px" }} />
            </Button>
          </AddFundModal>
        </div>

        {/* Placeholder for future fund table */}
        <div className="text-gray-500 pl-1 text-left text-lg">
          No funds to display yet.
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FundsPage;
