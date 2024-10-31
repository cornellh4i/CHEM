"use client";
import { LineChartComponent } from "@/components/molecules/LineChart";
import React from "react";

const LineChart = () => {
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <LineChartComponent
      title="Line Chart - Linear"
      description="January - June 2024"
      data={chartData}
      xAxisKey="month"
      yAxisKey="desktop"
      config={chartConfig}
    />
  );
};

export default LineChart;
