import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = (req as any).accountId;
    const timeframe = req.query.timeframe || 'weekly'; // daily, weekly, monthly

    let startDate: Date;
    let groupBy: 'hour' | 'day' = 'day';

    const now = new Date();
    if (timeframe === 'daily') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      groupBy = 'hour';
    } else if (timeframe === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else { // weekly
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Popular products (not affected by timeframe)
    const popularProductSales = await prisma.saleItem.groupBy({
      by: ["productId"],
      where: { saleOrder: { accountId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });
    const popularProducts = await prisma.products.findMany({
      where: {
        productId: {
          in: popularProductSales.map((p) => p.productId),
        },
      },
    });

    const popularProductsWithSales = popularProducts.map(product => {
      const saleInfo = popularProductSales.find(p => p.productId === product.productId);
      return {
        ...product,
        quantitySold: saleInfo?._sum.quantity || 0
      }
    }).sort((a, b) => b.quantitySold - a.quantitySold);

    // Sales summary
    let salesSummary: { date: Date, totalValue: number }[];
    if (groupBy === 'hour') {
      salesSummary = await prisma.$queryRaw`
        SELECT DATE_TRUNC('hour', "createdAt") as date, SUM("totalAmount") as "totalValue"
        FROM "SaleOrder"
        WHERE "accountId" = ${accountId} AND "createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('hour', "createdAt")
        ORDER BY date ASC
      `;
    } else {
      salesSummary = await prisma.$queryRaw`
        SELECT DATE_TRUNC('day', "createdAt") as date, SUM("totalAmount") as "totalValue"
        FROM "SaleOrder"
        WHERE "accountId" = ${accountId} AND "createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
      `;
    }

    // Purchase summary
    let purchaseSummary: { date: Date, totalPurchased: number }[];
    if (groupBy === 'hour') {
      purchaseSummary = await prisma.$queryRaw`
        SELECT DATE_TRUNC('hour', timestamp) as date, SUM("totalCost") as "totalPurchased"
        FROM "Purchases"
        WHERE "accountId" = ${accountId} AND timestamp >= ${startDate}
        GROUP BY DATE_TRUNC('hour', timestamp)
        ORDER BY date ASC
      `;
    } else {
      purchaseSummary = await prisma.$queryRaw`
        SELECT DATE_TRUNC('day', timestamp) as date, SUM("totalCost") as "totalPurchased"
        FROM "Purchases"
        WHERE "accountId" = ${accountId} AND timestamp >= ${startDate}
        GROUP BY DATE_TRUNC('day', timestamp)
        ORDER BY date ASC
      `;
    }

    // Expense summary
    let expenseSummary: { date: Date, totalExpenses: number }[];
    if (groupBy === 'hour') {
      expenseSummary = await prisma.$queryRaw`
        SELECT DATE_TRUNC('hour', timestamp) as date, SUM(amount) as "totalExpenses"
        FROM "Expenses"
        WHERE "accountId" = ${accountId} AND timestamp >= ${startDate}
        GROUP BY DATE_TRUNC('hour', timestamp)
        ORDER BY date ASC
      `;
    } else {
      expenseSummary = await prisma.$queryRaw`
        SELECT DATE_TRUNC('day', timestamp) as date, SUM(amount) as "totalExpenses"
        FROM "Expenses"
        WHERE "accountId" = ${accountId} AND timestamp >= ${startDate}
        GROUP BY DATE_TRUNC('day', timestamp)
        ORDER BY date ASC
      `;
    }

    // Expense by category (last 30 days, not affected by timeframe)
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const expenseByCategorySummary = await prisma.expenses.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where: { accountId, timestamp: { gte: thirtyDaysAgo } },
      orderBy: { _sum: { amount: "desc" } },
    });

    res.json({
      popularProducts: popularProductsWithSales,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary: expenseByCategorySummary.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0
      })),
    });
  } catch (error) {
    console.error("Error retrieving dashboard metrics:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving dashboard metrics",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
