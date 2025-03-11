"use client";

import React from "react";
import { DefaultTemplate } from "@/components";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import TransactionsTable from "@/components/molecules/TransactionsTable";

const AboutPage = () => {
  return (
    <DashboardTemplate>
      <TransactionsTable />
    </DashboardTemplate>
  );
};

export default AboutPage;
