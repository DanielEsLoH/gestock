import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const updateUser = async (req: Request, res: Response) => {
  const accountId = (req as any).accountId;
  const { name, email } = req.body;

  try {
    const account = await prisma.account.findUnique({ where: { accountId } });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const updatedAccount = await prisma.account.update({
      where: { accountId },
      data: {
        name,
        email,
      },
    });

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const accountId = (req as any).accountId;
  const { currentPassword, newPassword } = req.body;

  try {
    const account = await prisma.account.findUnique({ where: { accountId } });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      account.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.account.update({
      where: { accountId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};