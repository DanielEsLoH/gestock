"use client";
import { useState } from "react";
import { useGetDashboardMetricsQuery } from "@/state/api";
import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./components/CardExpenseSummary";
import CardPopularProducts from "./components/CardPopularProducts";
import CardPurchaseSummary from "./components/CardPurchaseSummary";
import CardSalesSummary from "./components/CardSalesSummary";
import StatCard from "./components/StatCard";

import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState("weekly");
  const { data, isLoading, isError } = useGetDashboardMetricsQuery(timeframe);

  if (isLoading) {
    return <div>{t("Dashboard.loading")}</div>;
  }

  if (isError || !data) {
    return <div>{t("Dashboard.error")}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex rounded-md bg-gray-200 p-1">
          <button
            key="daily"
            onClick={() => setTimeframe("daily")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "daily" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {t("Dashboard.daily")}
          </button>
          <button
            key="weekly"
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "weekly" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {t("Dashboard.weekly")}
          </button>
          <button
            key="monthly"
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              timeframe === "monthly" ? "bg-white shadow" : "text-gray-600"
            }`}
          >
            {t("Dashboard.monthly")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
        <CardPopularProducts
          key="popular-products"
          products={data.popularProducts}
        />
        <CardSalesSummary
          key="sales-summary"
          summary={data.salesSummary}
          timeframe={timeframe}
        />
        <CardPurchaseSummary
          key="purchase-summary"
          summary={data.purchaseSummary}
          timeframe={timeframe}
        />
        <CardExpenseSummary
          key="expense-summary"
          expenseSummary={data.expenseSummary}
          expenseByCategory={data.expenseByCategorySummary}
          timeframe={timeframe}
        />
        <StatCard
          key="customer-expenses"
          title={t("Dashboard.customerExpenses")}
          primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2024"
          details={[
            {
              title: t("Dashboard.customerGrowth"),
              amount: "175.00",
              changePercentage: 131,
              IconComponent: TrendingUp,
            },
            {
              title: t("Dashboard.expenses"),
              amount: "10.00",
              changePercentage: -56,
              IconComponent: TrendingDown,
            },
          ]}
        />
        <StatCard
          key="dues-pending-orders"
          title={t("Dashboard.duesPendingOrders")}
          primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2024"
          details={[
            {
              title: t("Dashboard.dues"),
              amount: "250.00",
              changePercentage: 131,
              IconComponent: TrendingUp,
            },
            {
              title: t("Dashboard.pendingOrders"),
              amount: "147",
              changePercentage: -56,
              IconComponent: TrendingDown,
            },
          ]}
        />
        <StatCard
          key="sales-discounts"
          title={t("Dashboard.salesDiscounts")}
          primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2024"
          details={[
            {
              title: t("Dashboard.sales"),
              amount: "1000.00",
              changePercentage: 20,
              IconComponent: TrendingUp,
            },
            {
              title: t("Dashboard.discount"),
              amount: "200.00",
              changePercentage: -10,
              IconComponent: TrendingDown,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
