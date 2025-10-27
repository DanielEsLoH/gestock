import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);

// Protected route (authentication required)
router.get("/me", authMiddleware, getMe);

export default router;
