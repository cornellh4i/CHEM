"use client";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import api from "@/utils/api";

type TransactionType = "DONATION" | "WITHDRAWAL" | "INVESTMENT" | "EXPENSE";

interface Transaction {
  id: string;
  organizationId: string;
  contributorId?: string;
  type: TransactionType;
  date: string;
  units?: number;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  contributor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  organization: {
    id: string;
    name: string;
    type: string;
    restriction: string;
  };
}


const fetchTransactions = async () => {
  try {
    const response = await api.get(`/transactions`);
    const data = response.data;
    if (!data.transactions) return [];

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    let cumulativeAmount = 0;

    return (data.transactions as Transaction[])
      .filter(
        (t) =>
          (t.type === "DONATION" || t.type === "INVESTMENT") &&
          new Date(t.date) >= lastMonthDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((transaction: { amount: number; date: string | number | Date }) => {
        cumulativeAmount += transaction.amount;
        return {
          month: new Date(transaction.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          date: new Date(transaction.date),
          desktop: cumulativeAmount,
        };
      });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

// Format a date to "MMM d" format (e.g., "Mar 3")
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export function ContributionsGraph() {
  const [chartData, setChartData] = React.useState<{ month: string; date: Date; desktop: number }[]>([]);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [xAxisTicks, setXAxisTicks] = React.useState<number[]>([]);
  const [formattedTicks, setFormattedTicks] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    fetchTransactions().then((data) => {
      if (data.length === 0) return;

      setChartData(data);
      setTotalAmount(data.length > 0 ? data[data.length - 1].desktop : 0);

      // Generate 5 evenly spaced dates between the earliest and latest data point
      const firstDate = data[0].date.getTime();
      const lastDate = data[data.length - 1].date.getTime();
      let tickTimestamps: number[] = [];

      if (firstDate === lastDate) { //only 1 point
        const offset = 1000 * 60 * 60 * 24; // 1 day in milliseconds
        tickTimestamps = [firstDate - offset, firstDate, firstDate + offset];
      } else { // > 2 points
        const timeRange = lastDate - firstDate;
        for (let i = 0; i < 5; i++) {
          const timestamp = Math.round(firstDate + (timeRange * i) / 4);
          tickTimestamps.push(timestamp);
        }
      }
      
      // Convert timestamps to formatted date strings
      const ticksObj: Record<number, string> = {};
      tickTimestamps.forEach((timestamp) => {
        const date = new Date(timestamp);
        ticksObj[date.getTime()] = formatDate(date);
      });

      setFormattedTicks(ticksObj);
      setXAxisTicks(tickTimestamps);
    });
  }, []);

  // Custom tick formatter function for the X axis
  const formatXAxisTick = (timestamp: string | number) => {
    return formattedTicks[Number(timestamp)] || "";
  };

  const chartConfig = {
    desktop: {
      label: "Amount $",
      color: "black",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Contributions</CardTitle>
        <CardDescription>
          ${totalAmount ? totalAmount.toLocaleString() : "0"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12, top: 12 }}
          >
            <CartesianGrid vertical={false} horizontal={false} />
            <YAxis dataKey="desktop" tickLine={false} axisLine={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={xAxisTicks}
              tickFormatter={formatXAxisTick}
              type="number"
              domain={[
                chartData[0]?.date?.getTime(),
                chartData[chartData.length - 1]?.date?.getTime(),
              ]}
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
    </Card>
  );
}

export default ContributionsGraph;
