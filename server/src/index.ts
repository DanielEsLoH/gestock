import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

/* ROUTE IMPORTS */
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import expenseRoutes from './routes/expenseRoutes';

/* MIDDLEWARE IMPORTS */
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
// Public routes (no authentication required)
app.use("/auth", authRoutes); //http://localhost:3001/auth

// Protected routes (authentication required)
app.use("/dashboard", authMiddleware, dashboardRoutes); //http://localhost:3001/dashboard
app.use("/products", authMiddleware, productRoutes); //http://localhost:3001/products
app.use("/customers", authMiddleware, customerRoutes); //http://localhost:3001/customers
app.use("/expenses", authMiddleware, expenseRoutes); //http://localhost:3001/expenses

/* ERROR HANDLING MIDDLEWARE - Must be last */
app.use(errorHandler);

/* SERVER */
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});