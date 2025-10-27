"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const prisma_1 = require("../lib/prisma");
const getDashboardMetrics = async (req, res) => {
    try {
        // Get accountId from auth middleware
        const accountId = req.accountId;
        const popularProducts = await prisma_1.prisma.products.findMany({
            where: { accountId },
            take: 15,
            orderBy: {
                stockQuantity: "desc",
            },
        });
        const salesSummary = await prisma_1.prisma.salesSummary.findMany({
            where: { accountId },
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const purchaseSummary = await prisma_1.prisma.purchaseSummary.findMany({
            where: { accountId },
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const expenseSummary = await prisma_1.prisma.expenseSummary.findMany({
            where: { accountId },
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummaryRaw = await prisma_1.prisma.expenseByCategory.findMany({
            where: { accountId },
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
            ...item,
            amount: item.amount.toString(),
        }));
        res.json({
            popularProducts,
            salesSummary,
            purchaseSummary,
            expenseSummary,
            expenseByCategorySummary,
        });
    }
    catch (error) {
        console.error("Error retrieving dashboard metrics:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving dashboard metrics",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.getDashboardMetrics = getDashboardMetrics;
//# sourceMappingURL=dashboardController.js.map