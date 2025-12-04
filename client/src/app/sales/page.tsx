"use client";

import { useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useGetProductsQuery,
  useGetCustomersQuery,
  useCreateSaleOrderMutation,
  useGetSaleOrdersQuery,
  type Product,
  type SaleOrder,
  type SaleItem,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/_components/Header";
import { ShoppingCart, Plus, Minus, Trash2, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import usePersistentState from "@/hooks/usePersistentState";
import { formatCurrency } from "@/lib/currency";

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error && 'data' in error;
}

interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

const Sales = () => {
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const { data: products } = useGetProductsQuery(productSearchTerm);
  const { data: customers } = useGetCustomersQuery();
  const { data: saleOrders, isLoading, isError } = useGetSaleOrdersQuery();
  const [createSaleOrder, { isLoading: isCreating }] = useCreateSaleOrderMutation();

  const [cart, setCart] = usePersistentState<CartItem[]>("cart", []);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [notes, setNotes] = useState<string>("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<SaleOrder | null>(null);

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.productId === product.productId);

    if (existingItem) {
      if (existingItem.quantity < product.stockQuantity) {
        setCart(
          cart.map((item) =>
            item.product.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        toast.error(`Cannot add more. Only ${product.stockQuantity} in stock.`);
      }
    } else {
      if (product.stockQuantity > 0) {
        setCart([...cart, { product, quantity: 1, unitPrice: product.price }]);
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error("Product is out of stock.");
      }
    }
  };

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find((i) => i.product.productId === productId);
    if (!item) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= item.product.stockQuantity) {
      setCart(
        cart.map((i) =>
          i.product.productId === productId ? { ...i, quantity: newQuantity } : i
        )
      );
    } else {
      toast.error(`Only ${item.product.stockQuantity} in stock.`);
    }
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.productId !== productId));
  };

  // Update unit price
  const updateUnitPrice = (productId: string, newPrice: number) => {
    setCart(
      cart.map((item) =>
        item.product.productId === productId ? { ...item, unitPrice: newPrice } : item
      )
    );
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = subtotal + tax - discount;

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedCustomerId("");
    setTax(0);
    setDiscount(0);
    setNotes("");
  };

  // Complete sale
  const completeSale = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    try {
      const saleData = {
        items: cart.map((item) => ({
          productId: item.product.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        customerId: selectedCustomerId || undefined,
        tax,
        discount,
        paymentMethod,
        notes: notes || undefined,
      };

      const result = await createSaleOrder(saleData).unwrap();
      toast.success("Sale completed successfully!");
      setLastInvoice(result);
      setShowInvoice(true);
      clearCart();
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const apiError = error.data as { message: string };
        toast.error(apiError.message || "Failed to complete sale");
      } else {
        toast.error("Failed to complete sale");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "invoiceNumber", headerName: "Invoice #", width: 150 },
    {
      field: "customer",
      headerName: "Customer",
      width: 150,
      valueGetter: (value, row) => row.customer?.name || "Walk-in",
    },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 120,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: "paymentMethod",
      headerName: "Payment",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
    {
      field: "items",
      headerName: "Items",
      width: 100,
      valueGetter: (value, row) => row.items?.length || 0,
    },
  ];

  if (isError) {
    return <div className="text-center text-red-500 py-4">Failed to load sales</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <Header name="Point of Sale" />

      {showInvoice && lastInvoice ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">{lastInvoice.invoiceNumber}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Date: {new Date(lastInvoice.createdAt).toLocaleString()}
              </p>
              {lastInvoice.customer && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer: {lastInvoice.customer.name} ({lastInvoice.customer.email})
                </p>
              )}
            </div>

            <table className="w-full mb-6">
              <thead className="border-b-2 border-gray-300 dark:border-gray-600">
                <tr>
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {lastInvoice.items.map((item: SaleItem) => (
                  <tr key={item.saleItemId} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">{item.product.name}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(lastInvoice.subtotal)}</span>
              </div>
              {lastInvoice.tax > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Tax:</span>
                  <span>{formatCurrency(lastInvoice.tax)}</span>
                </div>
              )}
              {lastInvoice.discount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(lastInvoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold mt-4">
                <span>Total:</span>
                <span>{formatCurrency(lastInvoice.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Products Selection */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Products</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {products?.map((product) => (
              <div
                key={product.productId}
                onClick={() => addToCart(product)}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  product.stockQuantity > 0
                    ? "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
                    : "border-red-200 dark:border-red-900 opacity-50 cursor-not-allowed"
                }`}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(product.price)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Stock: {product.stockQuantity}
                </p>
                {product.stockQuantity === 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    OUT OF STOCK
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cart ({cart.length})</h3>
          </div>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.productId} className="border dark:border-gray-700 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{item.product.name}</span>
                    <button
                      onClick={() => removeFromCart(item.product.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                      className="p-1 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.productId, parseInt(e.target.value) || 0)}
                      className="w-12 text-center bg-transparent border-x-0 border-y-1 border-gray-400 focus:ring-0 focus:border-gray-500"
                    />
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                      className="p-1 bg-gray-200 dark:bg-gray-700 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateUnitPrice(item.product.productId, parseFloat(e.target.value) || 0)}
                      className="ml-auto w-20 px-2 py-1 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      step="0.01"
                    />
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Customer (Optional)</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Walk-in Customer</option>
              {customers?.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tax & Discount */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Tax</label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                step="0.01"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {/* Totals */}
          <div className="border-t dark:border-gray-700 pt-4 mb-4">
            <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                <span>Tax:</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600 dark:text-green-400">
                <span>Discount:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={completeSale}
              disabled={cart.length === 0 || isCreating}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Receipt className="w-5 h-5" />
              {isCreating ? "Processing..." : "Complete Sale"}
            </button>
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sales History</h3>
        <DataGrid
          rows={saleOrders || []}
          columns={columns}
          getRowId={(row) => row.saleOrderId}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className="!text-gray-700 dark:!text-gray-200 !border-gray-200 dark:!border-gray-700"
          sx={{
            "& .MuiDataGrid-cell": {
              color: "inherit",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Sales;