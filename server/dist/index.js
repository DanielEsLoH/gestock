"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
/* MIDDLEWARE IMPORTS */
const authMiddleware_1 = require("./middleware/authMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* ROUTES */
// Public routes (no authentication required)
app.use("/auth", authRoutes_1.default); //http://localhost:3001/auth
// Protected routes (authentication required)
app.use("/dashboard", authMiddleware_1.authMiddleware, dashboardRoutes_1.default); //http://localhost:3001/dashboard
app.use("/products", authMiddleware_1.authMiddleware, productRoutes_1.default); //http://localhost:3001/products
app.use("/customers", authMiddleware_1.authMiddleware, customerRoutes_1.default); //http://localhost:3001/customers
app.use("/expenses", authMiddleware_1.authMiddleware, expenseRoutes_1.default); //http://localhost:3001/expenses
/* ERROR HANDLING MIDDLEWARE - Must be last */
app.use(errorHandler_1.errorHandler);
/* SERVER */
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map