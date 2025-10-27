"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProducts = void 0;
const prisma_1 = require("../lib/prisma");
const getProducts = async (req, res) => {
    try {
        // Get accountId from auth middleware
        const accountId = req.accountId;
        const search = req.query.search?.toString();
        const searchFilter = search ? { contains: search } : {};
        const products = await prisma_1.prisma.products.findMany({
            where: {
                accountId,
                name: searchFilter,
            },
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving products",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        // Get accountId from auth middleware
        const accountId = req.accountId;
        const { productId, name, price, rating, stockQuantity } = req.body;
        const product = await prisma_1.prisma.products.create({
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
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
            ...(process.env.NODE_ENV === "development" && { error: String(error) })
        });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=productController.js.map