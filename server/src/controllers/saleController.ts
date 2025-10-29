import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Generate invoice number using counter table (must be called within a transaction)
const generateInvoiceNumber = async (
  tx: any,
  accountId: string
): Promise<string> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 1-12

  // Atomically increment the counter and get the new value
  const counter = await tx.invoiceCounter.upsert({
    where: {
      accountId_year_month: {
        accountId,
        year,
        month,
      },
    },
    create: {
      accountId,
      year,
      month,
      currentNumber: 1,
    },
    update: {
      currentNumber: {
        increment: 1,
      },
    },
  });

  const nextNumber = counter.currentNumber;

  // Format: INV-YYYYMM-NNNN
  const monthStr = String(month).padStart(2, '0');
  return `INV-${year}${monthStr}-${String(nextNumber).padStart(4, '0')}`;
};

export const getSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const sales = await prisma.sales.findMany({
      where: { accountId },
      include: {
        product: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    res.json(sales);
  } catch (error) {
    console.error("Error retrieving sales:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving sales",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const createSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const { productId, quantity, unitPrice, timestamp } = req.body;

    // Validate required fields
    if (!productId || !quantity || !unitPrice) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: productId, quantity, unitPrice",
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

    // Check if sufficient stock is available
    if (product.stockQuantity < quantity) {
      res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}`,
      });
      return;
    }

    // Calculate total amount
    const totalAmount = quantity * unitPrice;

    // Create sale and update stock in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create the sale
      const newSale = await tx.sales.create({
        data: {
          saleId: uuidv4(),
          accountId,
          productId,
          quantity,
          unitPrice,
          totalAmount,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
        include: {
          product: true,
        },
      });

      // Update product stock quantity
      await tx.products.update({
        where: { productId },
        data: {
          stockQuantity: {
            decrement: quantity,
          },
        },
      });

      return newSale;
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({
      success: false,
      message: "Error creating sale",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

// Get all sale orders (invoices)
export const getSaleOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = (req as any).accountId;

    const saleOrders = await prisma.saleOrder.findMany({
      where: { accountId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(saleOrders);
  } catch (error) {
    console.error("Error retrieving sale orders:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving sale orders",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

// Get single sale order by ID (for invoice view)
export const getSaleOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = (req as any).accountId;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Sale order ID is required",
      });
      return;
    }

    const saleOrder = await prisma.saleOrder.findFirst({
      where: {
        saleOrderId: id,
        accountId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!saleOrder) {
      res.status(404).json({
        success: false,
        message: "Sale order not found",
      });
      return;
    }

    res.json(saleOrder);
  } catch (error) {
    console.error("Error retrieving sale order:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving sale order",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

// Create sale order with multiple items (shopping cart)
export const createSaleOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = (req as any).accountId;
    const {
      items,
      customerId,
      tax,
      discount,
      paymentMethod,
      notes
    } = req.body;

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Items array is required and must not be empty",
      });
      return;
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.unitPrice) {
        res.status(400).json({
          success: false,
          message: "Each item must have productId, quantity, and unitPrice",
        });
        return;
      }

      if (item.quantity <= 0) {
        res.status(400).json({
          success: false,
          message: "Quantity must be greater than 0",
        });
        return;
      }
    }

    // Create sale order with items in a transaction
    const saleOrder = await prisma.$transaction(async (tx) => {
      // Generate invoice number within transaction to avoid race conditions
      const invoiceNumber = await generateInvoiceNumber(tx, accountId);
      // Verify products and check stock
      for (const item of items) {
        const product = await tx.products.findFirst({
          where: {
            productId: item.productId,
            accountId,
          },
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
          );
        }
      }

      // Calculate totals
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
        0
      );
      const taxAmount = tax || 0;
      const discountAmount = discount || 0;
      const totalAmount = subtotal + taxAmount - discountAmount;

      // Create the sale order
      const newSaleOrder = await tx.saleOrder.create({
        data: {
          accountId,
          customerId: customerId || null,
          invoiceNumber,
          subtotal,
          tax: taxAmount,
          discount: discountAmount,
          totalAmount,
          paymentMethod: paymentMethod || "cash",
          notes: notes || null,
        },
      });

      // Create sale items and update stock
      for (const item of items) {
        // Create sale item
        await tx.saleItem.create({
          data: {
            saleOrderId: newSaleOrder.saleOrderId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          },
        });

        // Update product stock
        await tx.products.update({
          where: { productId: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Fetch the complete order with relations
      return await tx.saleOrder.findUnique({
        where: { saleOrderId: newSaleOrder.saleOrderId },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    res.status(201).json(saleOrder);
  } catch (error) {
    console.error("Error creating sale order:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error creating sale order",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
