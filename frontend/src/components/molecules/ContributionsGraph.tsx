"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "Oct 1", desktop: 10000 },
  { month: "Oct 4", desktop: 30000 },
  { month: "Oct 7", desktop: 20000 },
  { month: "Oct 10", desktop: 25000 },
  { month: "Oct 13", desktop: 5000 },
  { month: "Oct 16", desktop: 13000 },
  { month: "Oct 19", desktop: 18000 },
  { month: "Oct 22", desktop: 25000 },
  { month: "Oct 25", desktop: 18000 },
  { month: "Oct 28", desktop: 30000 },
];

const chartConfig = {
  desktop: {
    label: "Contribution",
    color: "black",
  },
} satisfies ChartConfig;

export function ContributionsGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Contributions</CardTitle>
        <CardDescription>$60,578.04</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} horizontal={false} />
            <YAxis dataKey="desktop" tickLine={false} axisLine={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="black"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
export default ContributionsGraph;