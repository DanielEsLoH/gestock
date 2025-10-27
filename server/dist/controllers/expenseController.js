"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesByCategory = void 0;
const prisma_1 = require("../lib/prisma");
const getExpensesByCategory = async (req, res) => {
    try {
        // Get accountId from auth middleware
        const accountId = req.accountId;
        const expenseByCategorySummaryRaw = await prisma_1.prisma.expenseByCategory.findMany({
            where: { accountId },
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
            ...item,
            amount: item.amount.toString(),
        }));
        res.json(expenseByCategorySummary);
    }
    catch (error) {
        console.error("Error retrieving expenses by category:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving expenses by category",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.getExpensesByCategory = getExpensesByCategory;
//# sourceMappingURL=expenseController.js.map