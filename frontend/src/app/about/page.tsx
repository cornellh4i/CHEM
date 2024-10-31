"use client";

import React from "react";
import { DefaultTemplate } from "@/components";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import DummyTable from "@/components/molecules/DummyTable";

const AboutPage = () => {
  return (
    <DashboardTemplate>
      <DummyTable></DummyTable>
    </DashboardTemplate>
  );
};

export default AboutPage;
