"use client";
import { LineChartComponent } from "@/components/molecules/LineChart";
import React from "react";

const calculateTrend = (data: { month: string; desktop: number }[]) => {
  if (data.length < 2) return 0;
  const firstValue = data[0].desktop;
  const lastValue = data[data.length - 1].desktop;
  return ((lastValue - firstValue) / firstValue) * 100;
};

const calculateMostRecentEarnings = (
  data: { month: string; desktop: number }[]
) => {
  if (data.length === 0) return 0;
  return data[data.length - 1].desktop;
};

const calculateOverallEarnings = (
  data: { month: string; desktop: number }[]
) => {
  return data.reduce((acc, point) => acc + point.desktop, 0);
};

const LineChart = () => {
  const chartData = {
    "Last Month": [
      { month: "Week 1", desktop: 120 },
      { month: "Week 2", desktop: 150 },
      { month: "Week 3", desktop: 180 },
      { month: "Week 4", desktop: 200 },
    ],
    "Last Year": [
      { month: "January", desktop: 186 },
      { month: "February", desktop: 305 },
      { month: "March", desktop: 237 },
      { month: "April", desktop: 73 },
      { month: "May", desktop: 209 },
      { month: "June", desktop: 214 },
      { month: "July", desktop: 195 },
      { month: "August", desktop: 180 },
      { month: "September", desktop: 160 },
      { month: "October", desktop: 190 },
      { month: "November", desktop: 230 },
      { month: "December", desktop: 250 },
    ],
    All: [
      { month: "January", desktop: 186 },
      { month: "February", desktop: 305 },
      { month: "March", desktop: 237 },
      { month: "April", desktop: 73 },
      { month: "May", desktop: 209 },
      { month: "June", desktop: 214 },
      { month: "July", desktop: 195 },
      { month: "August", desktop: 180 },
      { month: "September", desktop: 160 },
      { month: "October", desktop: 190 },
      { month: "November", desktop: 230 },
      { month: "December", desktop: 250 },
      { month: "January (next year)", desktop: 210 },
      { month: "February (next year)", desktop: 190 },
      { month: "March (next year)", desktop: 220 },
      { month: "April (next year)", desktop: 240 },
      { month: "May (next year)", desktop: 230 },
      { month: "June (next year)", desktop: 250 },
    ],
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  };

  const currentData = chartData["Last Year"]; // Change this to switch between "Last Month", "Last Year", and "All"

  const trend = calculateTrend(currentData);
  const mostRecentEarnings = calculateMostRecentEarnings(currentData);
  const overallEarnings = calculateOverallEarnings(currentData);

  return (
    <>
      <div className="container mx-auto">
        <LineChartComponent
          title="Line Chart - Linear"
          description="January - June 2024"
          data={chartData}
          xAxisKey="month"
          yAxisKey="desktop"
          config={chartConfig}
        />
        <div className="mt-4">
          <h3>Statistics</h3>
          <p>Trend: {trend.toFixed(2)}%</p>
          <p>Most Recent Earnings: {mostRecentEarnings}</p>
          <p>Overall Earnings: {overallEarnings}</p>
        </div>
      </div>
    </>
  );
};

export default LineChart;
