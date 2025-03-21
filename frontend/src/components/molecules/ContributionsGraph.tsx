"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
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

const API_URL = "http://localhost:8000";

const fetchTransactions = async () => {
  try {
    const response = await fetch(`${API_URL}/transactions`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const data = await response.json();
    if (!data.transactions) return [];

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    let cumulativeAmount = 0;

    return data.transactions
      .filter(
        (t) =>
          (t.type === "DONATION" || t.type === "INVESTMENT") &&
          new Date(t.date) >= lastMonthDate
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((transaction) => {
        cumulativeAmount += transaction.amount;
        return {
          month: new Date(transaction.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          desktop: cumulativeAmount,
        };
      });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export function ContributionsGraph() {
  const [chartData, setChartData] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);

  React.useEffect(() => {
    fetchTransactions().then((data) => {
      setChartData(data);
      setTotalAmount(data.length > 0 ? data[data.length - 1].desktop : 0);
    });
  }, []);

  const chartConfig = {
    desktop: {
      label: "Contribution",
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
    </Card>
  );
}

export default ContributionsGraph;
