import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getExpensesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        where: { accountId },
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

    res.json(expenseByCategorySummary);
  } catch (error) {
    console.error("Error retrieving expenses by category:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving expenses by category",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
