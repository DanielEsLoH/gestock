"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = void 0;
const prisma_1 = require("../lib/prisma");
const getCustomers = async (req, res) => {
    try {
        // Get accountId from auth middleware
        const accountId = req.accountId;
        const customers = await prisma_1.prisma.customer.findMany({
            where: { accountId },
        });
        res.json(customers);
    }
    catch (error) {
        console.error("Error retrieving customers:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving customers",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.getCustomers = getCustomers;
//# sourceMappingURL=customerController.js.map