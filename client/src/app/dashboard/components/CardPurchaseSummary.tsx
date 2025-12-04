import { PurchaseSummary } from "@/state/api";
import { formatCurrency } from "@/lib/currency";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CardPurchaseSummaryProps {
  summary: PurchaseSummary[];
  timeframe: string;
}

import { useTranslation } from "react-i18next";

const CardPurchaseSummary = ({ summary, timeframe }: CardPurchaseSummaryProps) => {
  const { t } = useTranslation();
  const totalPurchased = summary.reduce((acc, curr) => acc + curr.totalPurchased, 0) || 0;

  const tickFormatter = (value: string) => {
    const date = new Date(value);
    if (timeframe === 'daily') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl overflow-hidden h-full">
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
          {t("CardPurchaseSummary.title")} ({timeframe})
        </h2>
        <hr />
      </div>

      <div className="flex flex-col flex-1">
        <div className="mb-4 mt-7 px-7">
          <p className="text-xs text-gray-400">{t("CardPurchaseSummary.totalPurchased")}</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold">
              {formatCurrency(totalPurchased)}
            </p>
          </div>
        </div>

        <div className="h-56 md:h-auto md:flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={summary}
              margin={{ top: 5, right: 5, left: -50, bottom: 5 }}
            >
              <XAxis dataKey="date" tick={false} axisLine={false} tickFormatter={tickFormatter} />
              <YAxis tickLine={false} tick={false} axisLine={false} />
              <Tooltip
                formatter={(value: number) => [
                  formatCurrency(value),
                ]}
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
              <Area
                type="linear"
                dataKey="totalPurchased"
                stroke="#8884d8"
                fill="#8884d8"
                dot={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CardPurchaseSummary;