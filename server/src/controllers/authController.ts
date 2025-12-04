import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const register = async (req: Request, res: Response): Promise<void> => {
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
    const existingAccount = await prisma.account.findUnique({
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account
    const account = await prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        name,
        companyName: companyName || null
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { accountId: account.accountId, email: account.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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
  } catch (error) {
    console.error("Error registering account:", error);
    res.status(500).json({
      success: false,
      message: "Error creating account",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log("Login failed: Email or password not provided.");
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
      return;
    }

    // Find account
    const account = await prisma.account.findUnique({
      where: { email }
    });

    if (!account) {
      console.log("Login failed: Account not found.");
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, account.password);
    console.log("Password validation result:", isValidPassword);

    if (!isValidPassword) {
      console.log("Login failed: Invalid password.");
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { accountId: account.accountId, email: account.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful, token generated.");
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
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const accountId = (req as any).accountId; // Set by auth middleware

    const account = await prisma.account.findUnique({
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
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching account",
      ...(process.env.NODE_ENV === "development" && { error: String(error) })
    });
  }
};
