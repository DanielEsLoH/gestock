import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const search = req.query.search?.toString();
    const searchFilter = search ? { contains: search } : {};
    const products = await prisma.products.findMany({
      where: {
        accountId,
        name: searchFilter,
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get accountId from auth middleware
    const accountId = (req as any).accountId;

    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
        accountId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = (req as any).accountId;
    const { id } = req.params;
    const { name, price, rating, stockQuantity } = req.body;

    if (!id) {
      res.status(400).json({ success: false, message: "Product ID is required" });
      return;
    }

    const product = await prisma.products.findFirst({
      where: { productId: id, accountId },
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    const updatedProduct = await prisma.products.update({
      where: { productId: id },
      data: { name, price, rating, stockQuantity },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = (req as any).accountId;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, message: "Product ID is required" });
      return;
    }

    const product = await prisma.products.findFirst({
      where: { productId: id, accountId },
    });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    await prisma.products.delete({
      where: { productId: id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
