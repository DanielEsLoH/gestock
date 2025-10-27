import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const popularProducts = await prisma.products.findMany({
      where: { accountId },
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    const salesSummary = await prisma.salesSummary.findMany({
      where: { accountId },
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    const purchaseSummary = await prisma.purchaseSummary.findMany({
      where: { accountId },
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    const expenseSummary = await prisma.expenseSummary.findMany({
      where: { accountId },
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        where: { accountId },
        take: 5,
        orderBy: {
          date: "desc",
        },
      }
    );
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
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
