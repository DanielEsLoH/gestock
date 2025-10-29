import { Router } from "express";
import {
  getSales,
  createSale,
  getSaleOrders,
  getSaleOrderById,
  createSaleOrder
} from "../controllers/saleController";

const router = Router();

// Legacy single-product sales
router.get("/", getSales);
router.post("/", createSale);

// New cart-based sales with invoicing
router.get("/orders", getSaleOrders);
router.get("/orders/:id", getSaleOrderById);
router.post("/orders", createSaleOrder);

export default router;
