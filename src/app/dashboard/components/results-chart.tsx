"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart";

type ResultsChartProps = {
  requested: number;
  approved: number;
};

export default function ResultsChart({ requested, approved }: ResultsChartProps) {
  const chartData = [
    { name: "Requested", amount: requested, fill: "var(--color-chart-2)" },
    { name: "Approved", amount: approved, fill: "var(--color-chart-1)" },
  ];
  
  const chartConfig = {
    amount: {
      label: "Amount",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${Number(value) / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={<ChartTooltipContent 
                formatter={(value) => `$${Number(value).toLocaleString()}`}
                hideLabel
            />}
          />
          <Bar dataKey="amount" radius={8} />
        </BarChart>
      </ChartContainer>
  );
}
