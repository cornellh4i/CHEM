import React, { useState } from "react";
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
import { TrendingUp } from "lucide-react";

type ChartData = {
  month: string;
  desktop: number;
};

type LineChartComponentProps = {
  title: string;
  description: string;
  data: { [key: string]: ChartData[] };
  xAxisKey: string;
  yAxisKey: string;
  config: ChartConfig;
};

const timeFrames = ["Last Month", "Last Year", "All"];

export function LineChartComponent({
  title,
  description,
  data,
  xAxisKey,
  yAxisKey,
  config,
}: LineChartComponentProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[1]); //Last year by default

  //Runs when we click button to change time frame
  const handleTimeFrameChange = (timeFrame: string) => {
    setSelectedTimeFrame(timeFrame);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Div for the time frame buttons */}
        <div className="mb-4 flex gap-4">
          {timeFrames.map((timeFrame) => (
            <button
              key={timeFrame}
              className={`rounded px-4 py-2 ${
              selectedTimeFrame === timeFrame
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleTimeFrameChange(timeFrame)}
            >
              {timeFrame}
            </button>
          ))}
        </div>

        <ChartContainer config={config}>
          <LineChart
            width={300}
            height={200}
            data={data[selectedTimeFrame]} // Use the selected time frame's data
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={yAxisKey}
              type="linear"
              stroke={config.desktop.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total contributions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
