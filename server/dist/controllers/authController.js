"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const register = async (req, res) => {
    try {
        const { email, password, name, companyName } = req.body;
        // Validate required fields
        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                message: "Email, password, and name are required"
            });
            return;
        }
        // Check if account already exists
        const existingAccount = await prisma_1.prisma.account.findUnique({
            where: { email }
        });
        if (existingAccount) {
            res.status(400).json({
                success: false,
                message: "Email already registered"
            });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create account
        const account = await prisma_1.prisma.account.create({
            data: {
                email,
                password: hashedPassword,
                name,
                companyName: companyName || null
            }
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ accountId: account.accountId, email: account.email }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            success: true,
            token,
            account: {
                accountId: account.accountId,
                email: account.email,
                name: account.name,
                companyName: account.companyName
            }
        });
    }
    catch (error) {
        console.error("Error registering account:", error);
        res.status(500).json({
            success: false,
            message: "Error creating account",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        // Find account
        const account = await prisma_1.prisma.account.findUnique({
            where: { email }
        });
        if (!account) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        // Verify password
        const isValidPassword = await bcryptjs_1.default.compare(password, account.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ accountId: account.accountId, email: account.email }, JWT_SECRET, { expiresIn: "7d" });
        res.json({
            success: true,
            token,
            account: {
                accountId: account.accountId,
                email: account.email,
                name: account.name,
                companyName: account.companyName
            }
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const accountId = req.accountId; // Set by auth middleware
        const account = await prisma_1.prisma.account.findUnique({
            where: { accountId },
            select: {
                accountId: true,
                email: true,
                name: true,
                companyName: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!account) {
            res.status(404).json({
                success: false,
                message: "Account not found"
            });
            return;
        }
        res.json({
            success: true,
            account
        });
    }
    catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching account",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map