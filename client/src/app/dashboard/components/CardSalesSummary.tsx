import { SalesSummary } from "@/state/api";
import { formatCurrency } from "@/lib/currency";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CardSalesSummaryProps {
  summary: SalesSummary[];
  timeframe: string;
}

import { useTranslation } from "react-i18next";

const CardSalesSummary = ({ summary, timeframe }: CardSalesSummaryProps) => {
  const { t } = useTranslation();
  const totalValueSum = summary.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

  const highestValueData = summary.reduce((acc, curr) => {
    return acc.totalValue > curr.totalValue ? acc : curr;
  }, summary[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  const tickFormatter = (value: string) => {
    const date = new Date(value);
    if (timeframe === 'daily') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between overflow-hidden h-full">
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
          {t("CardSalesSummary.title")} ({timeframe})
        </h2>
        <hr />
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 px-7 mt-5">
          <div className="text-lg font-medium">
            <p className="text-xs text-gray-400">{t("CardSalesSummary.totalValue")}</p>
            <span className="text-2xl font-extrabold">
              {formatCurrency(totalValueSum)}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={331} className="px-7">
          <BarChart
            data={summary}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value as number)}
              tick={{ fontSize: 12, dx: -1 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value)]}
              labelFormatter={(label) => {
                const date = new Date(label);
                if (timeframe === 'daily') {
                  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                }
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }}
            />
            <Bar
              dataKey="totalValue"
              fill="#3182ce"
              barSize={10}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <hr />
        <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
          <p>{summary.length || 0} {t("CardSalesSummary.dataPoints")}</p>
          <p className="text-sm">
            {t("CardSalesSummary.highestSalesDate")}:{" "}
            <span className="font-bold">{highestValueDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardSalesSummary;