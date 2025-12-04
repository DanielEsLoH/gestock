import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/redux";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  quantitySold?: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesSummary {
  date: string;
  totalValue: number;
}

export interface PurchaseSummary {
  date: string;
  totalPurchased: number;
}

export interface ExpenseSummary {
  date: string;
  totalExpenses: number;
}

export interface ExpenseByCategorySummary {
  date: string;
  category: string;
  amount: number;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
}

export interface Sale {
  saleId: string;
  accountId: string;
  productId: string;
  timestamp: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  product: Product;
}

export interface NewSale {
  productId: string;
  quantity: number;
  unitPrice: number;
  timestamp?: string;
}

export interface SaleItem {
  saleItemId: string;
  saleOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
}

export interface SaleOrder {
  saleOrderId: string;
  accountId: string;
  customerId?: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  customer?: Customer;
  items: SaleItem[];
}

export interface NewSaleOrder {
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  customerId?: string;
  tax?: number;
  discount?: number;
  paymentMethod?: string;
  notes?: string;
}

export interface Purchase {
  purchaseId: string;
  accountId: string;
  productId: string;
  timestamp: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  product: Product;
}

export interface NewPurchase {
  productId: string;
  quantity: number;
  unitCost: number;
  timestamp?: string;
}

export interface Account {
  accountId: string;
  email: string;
  name: string;
  companyName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  companyName?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  account: Account;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "DashboardMetrics",
    "Products",
    "Customers",
    "Expenses",
    "Sales",
    "SaleOrders",
    "Purchases",
    "Auth",
    "User",
  ],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, string | void>({
      query: (timeframe) => ({
        url: "/dashboard",
        params: timeframe ? { timeframe } : {},
      }),
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<
      Product,
      Partial<Product> & Pick<Product, "productId">
    >({
      query: ({ productId, ...patch }) => ({
        url: `/products/${productId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    updateUser: build.mutation<Account, Partial<Account>>({
      query: (data) => ({
        url: `/user`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: build.mutation<
      {
        success: boolean;
        message: string;
      },
      { currentPassword: string; newPassword: string }
    >({
      query: ({ currentPassword, newPassword }) => ({
        url: "/user/password",
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
      invalidatesTags: ["Auth"],
    }),
    getCustomers: build.query<Customer[], void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),
    createCustomer: build.mutation<Customer, Partial<Customer>>({
      query: (newCustomer) => ({
        url: "/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: build.query<{ success: boolean; account: Account }, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    getSales: build.query<Sale[], void>({
      query: () => "/sales",
      providesTags: ["Sales"],
    }),
    createSale: build.mutation<Sale, NewSale>({
      query: (newSale) => ({
        url: "/sales",
        method: "POST",
        body: newSale,
      }),
      invalidatesTags: ["Sales", "Products", "DashboardMetrics"],
    }),
    getSaleOrders: build.query<SaleOrder[], void>({
      query: () => "/sales/orders",
      providesTags: ["SaleOrders"],
    }),
    getSaleOrderById: build.query<SaleOrder, string>({
      query: (id) => `/sales/orders/${id}`,
      providesTags: ["SaleOrders"],
    }),
    createSaleOrder: build.mutation<SaleOrder, NewSaleOrder>({
      query: (newSaleOrder) => ({
        url: "/sales/orders",
        method: "POST",
        body: newSaleOrder,
      }),
      invalidatesTags: ["SaleOrders", "Products", "DashboardMetrics"],
    }),
    getPurchases: build.query<Purchase[], void>({
      query: () => "/purchases",
      providesTags: ["Purchases"],
    }),
    createPurchase: build.mutation<Purchase, NewPurchase>({
      query: (newPurchase) => ({
        url: "/purchases",
        method: "POST",
        body: newPurchase,
      }),
      invalidatesTags: ["Purchases", "Products", "DashboardMetrics"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetExpensesByCategoryQuery,
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetSaleOrdersQuery,
  useGetSaleOrderByIdQuery,
  useCreateSaleOrderMutation,
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
} = api;
