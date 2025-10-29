import { ExpenseSummary, ExpenseByCategorySummary } from "@/state/api";
import { formatCurrency } from "@/lib/currency";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const colors = ["#00C49F", "#0088FE", "#FFBB28"];

interface CardExpenseSummaryProps {
  expenseSummary: ExpenseSummary[];
  expenseByCategory: ExpenseByCategorySummary[];
  timeframe: string;
}

import { useTranslation } from "react-i18next";

const CardExpenseSummary = ({ expenseSummary, expenseByCategory, timeframe }: CardExpenseSummaryProps) => {
  const { t } = useTranslation();
  const totalExpenses = expenseSummary.reduce((acc, curr) => acc + curr.totalExpenses, 0) || 0;

  return (
    <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
          {t("CardExpenseSummary.title")} ({timeframe})
        </h2>
        <hr />
      </div>
      <div className="xl:flex justify-between pr-7">
        <div className="relative basis-3/5">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                innerRadius={50}
                outerRadius={60}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
              >
                {expenseByCategory.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={colors[expenseByCategory.indexOf(entry) % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
            <span className="font-bold text-xl">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
        <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
          {expenseByCategory.map((entry) => (
            <li
              key={entry.category}
              className="flex items-center text-xs"
            >
              <span
                className="mr-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[expenseByCategory.indexOf(entry) % colors.length] }}
              ></span>
              {entry.category}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <hr />
        <div className="mt-3 flex justify-between items-center px-7 mb-4">
          <p className="text-sm">{t("CardExpenseSummary.totalExpenses")} ({timeframe})</p>
          <p className="text-sm font-semibold">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default CardExpenseSummary;