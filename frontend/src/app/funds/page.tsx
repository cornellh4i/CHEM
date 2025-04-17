"use client";

import DashboardTemplate from "@/components/templates/DashboardTemplate";
import FundsTable from "@/components/molecules/FundsTable";

const FundsPage = () => {
  return (
    <DashboardTemplate>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Funds Page</h1>
        <FundsTable />
      </div>
    </DashboardTemplate>
  );
};

export default FundsPage;
