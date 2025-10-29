import express from "express";
import { updateUser, changePassword } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.put("/", authMiddleware, updateUser);
router.put("/password", authMiddleware, changePassword);

export default router;