import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";

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

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = (req as any).accountId;
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
      return;
    }

    const newCustomer = await prisma.customer.create({
      data: {
        customerId: uuidv4(),
        accountId,
        name,
        email,
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      success: false,
      message: "Error creating customer",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
