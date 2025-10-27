import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const customers = await prisma.customer.findMany({
      where: { accountId },
    });
    res.json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving customers",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
