# Gestock - Inventory Management System

A full-stack inventory management system built as a monorepo with separate client and server applications. Gestock provides a comprehensive solution for managing products, customers, sales, purchases, and expenses with multi-tenant support.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Database Management](#database-management)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

## Features

### Core Functionality
- **Multi-tenancy Support**: Data isolation between different user accounts
- **Product Management**: Create, edit, and track product inventory with stock levels
- **Sales Management**: Process sales orders with automatic invoice generation
- **Purchase Management**: Track purchase orders and supplier transactions
- **Customer Management**: Maintain customer records and transaction history
- **Expense Tracking**: Monitor and categorize business expenses
- **Dashboard Analytics**: Real-time metrics and visualizations for business insights

### User Experience
- **Internationalization (i18n)**: Full support for English and Spanish languages
- **Dark Mode**: Toggle between light and dark themes with persistent preferences
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and Material-UI
- **Real-time Updates**: Automatic data synchronization with RTK Query caching
- **User Settings**: Integrated profile management and password change functionality

## Tech Stack

### Frontend (`client/`)
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript 5+
- **State Management**: Redux Toolkit with RTK Query for API calls
- **UI Libraries**:
  - Material-UI 7.3.1 (Emotion CSS-in-JS)
  - Tailwind CSS 4.1.12
- **Data Visualization**: Recharts
- **Internationalization**: i18next
- **Persistence**: Redux-Persist (localStorage for UI state)
- **HTTP Client**: Axios

### Backend (`server/`)
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5+
- **Database**: PostgreSQL
- **ORM**: Prisma 6.15.0
- **Security**:
  - Helmet (HTTP headers)
  - CORS
  - JWT Authentication
- **Logging**: Morgan (request logging)
- **Development**: ts-node, nodemon with watch mode

## Project Structure

```
gestock/
├── client/                 # Next.js frontend application
│   ├── public/
│   │   └── locales/       # i18n translation files
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── _components/  # Shared components (Sidebar, Navbar, Header)
│   │   │   ├── dashboard/    # Dashboard with analytics
│   │   │   ├── products/     # Product management
│   │   │   ├── sales/        # Sales order management
│   │   │   ├── purchases/    # Purchase order management
│   │   │   ├── customers/    # Customer management
│   │   │   ├── expenses/     # Expense tracking
│   │   │   ├── inventory/    # Inventory views
│   │   │   └── settings/     # User settings
│   │   ├── state/         # Redux store and RTK Query API
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   └── package.json
│
└── server/                # Express.js backend application
    ├── prisma/
    │   ├── migrations/    # Database migrations
    │   ├── schema.prisma  # Prisma schema definition
    │   └── seed.ts        # Database seeding script
    ├── src/
    │   ├── controllers/   # Business logic
    │   ├── routes/        # API route definitions
    │   ├── middleware/    # Express middleware (auth, error handling)
    │   ├── types/         # TypeScript type definitions
    │   └── index.ts       # Express app setup
    └── package.json
```

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **npm** or **yarn** or **pnpm** or **bun**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gestock
```

### 2. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Set Up Environment Variables

**Client** (create `client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Server** (create `server/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/gestock
PORT=8000
JWT_SECRET=your-secret-key-here
```

### 4. Set Up the Database

```bash
cd server

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 5. Start the Development Servers

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## Development

### Client Commands (from `client/` directory)

```bash
npm run dev          # Start Next.js dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Server Commands (from `server/` directory)

```bash
npm run dev          # Build TypeScript + watch mode with nodemon
npm run build        # Compile TypeScript to dist/
npm start            # Build and run production server
npm run seed         # Seed database with sample data
```

## Database Management

All commands should be run from the `server/` directory:

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Generate Prisma Client (after schema changes)
npx prisma generate

# Open Prisma Studio GUI for database inspection
npx prisma studio

# Push schema changes without creating a migration (dev only)
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Environment Variables

### Client (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/gestock` |
| `PORT` | Server port | `8000` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |

## Deployment

### Frontend (Vercel)

The Next.js application can be easily deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `client`
4. Configure environment variables
5. Deploy

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Backend

The Express.js backend can be deployed to any Node.js hosting platform:

1. Build the application: `npm run build`
2. Ensure PostgreSQL database is accessible
3. Set environment variables
4. Start the server: `npm start`

Popular hosting options:
- Railway
- Render
- Heroku
- DigitalOcean
- AWS EC2

## API Documentation

### Authentication
All API endpoints (except `/auth/login` and `/auth/register`) require JWT authentication via Bearer token in the Authorization header.

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/dashboard` | Get dashboard metrics |
| GET | `/products` | List all products |
| POST | `/products` | Create a new product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |
| GET | `/sales` | List all sales orders |
| POST | `/sales` | Create a new sale order |
| GET | `/sales/:id` | Get sale order details |
| GET | `/purchases` | List all purchase orders |
| POST | `/purchases` | Create a new purchase order |
| GET | `/customers` | List all customers |
| POST | `/customers` | Create a new customer |
| GET | `/expenses` | List expenses grouped by category |
| GET | `/user/profile` | Get current user profile |
| PUT | `/user/profile` | Update user profile |
| PUT | `/user/password` | Change user password |

## State Management Pattern

The frontend uses a two-layer state management approach:

1. **Global UI State** (Redux slice):
   - Sidebar collapse state
   - Dark mode preference
   - Persisted to localStorage via redux-persist

2. **Server State** (RTK Query):
   - API endpoints with automatic caching and invalidation
   - Tagged cache invalidation system
   - Automatic refetching on mutations

## Database Schema

### Core Models
- **Users**: User accounts with authentication
- **Products**: Product catalog with stock tracking
- **Customers**: Customer information
- **SaleOrder & SaleOrderItem**: Sales transactions with line items
- **PurchaseOrder & PurchaseOrderItem**: Purchase transactions with line items
- **Expenses**: Expense records with categories

### Aggregation Models
- **SalesSummary**: Daily sales metrics
- **PurchaseSummary**: Daily purchase metrics
- **ExpenseSummary**: Daily expense aggregates
- **ExpenseByCategory**: Expenses grouped by category

## Author

**Daniel E. Londoño**
Email: daniel.esloh@gmail.com

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
