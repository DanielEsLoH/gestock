import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const getPurchases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const purchases = await prisma.purchases.findMany({
      where: { accountId },
      include: {
        product: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    res.json(purchases);
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving purchases",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const createPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const { productId, quantity, unitCost, timestamp } = req.body;

    // Validate required fields
    if (!productId || !quantity || !unitCost) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: productId, quantity, unitCost",
      });
      return;
    }

    // Validate quantity is positive
    if (quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
      return;
    }

    // Check if product exists and belongs to this account
    const product = await prisma.products.findFirst({
      where: {
        productId,
        accountId,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found or does not belong to your account",
      });
      return;
    }

    // Calculate total cost
    const totalCost = quantity * unitCost;

    // Create purchase and update stock in a transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Create the purchase
      const newPurchase = await tx.purchases.create({
        data: {
          purchaseId: uuidv4(),
          accountId,
          productId,
          quantity,
          unitCost,
          totalCost,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
        include: {
          product: true,
        },
      });

      // Update product stock quantity (increase)
      await tx.products.update({
        where: { productId },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });

      return newPurchase;
    });

    res.status(201).json(purchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({
      success: false,
      message: "Error creating purchase",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
