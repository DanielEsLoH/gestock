import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/_components/Header";
import { useGetProductsQuery } from "@/state/api";
import { formatCurrency } from "@/lib/currency";

type PurchaseFormData = {
  productId: string;
  quantity: number;
  unitCost: number;
};

type CreatePurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: PurchaseFormData) => void;
};

const CreatePurchaseModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreatePurchaseModalProps) => {
  const { data: products } = useGetProductsQuery();
  const [formData, setFormData] = useState<PurchaseFormData>({
    productId: "",
    quantity: 1,
    unitCost: 0,
  });

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const selectedProduct = products?.find((p) => p.productId === productId);

    setFormData({
      ...formData,
      productId,
      unitCost: selectedProduct?.price || 0,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "unitCost" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ productId: "", quantity: 1, unitCost: 0 });
    onClose();
  };

  if (!isOpen) return null;

  const totalCost = formData.quantity * formData.unitCost;

  const labelCssStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 dark:border-gray-600 border-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";

  return (
    <div className="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/70 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <Header name="Record New Purchase" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT SELECTION */}
          <label htmlFor="productId" className={labelCssStyles}>
            Product *
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleProductChange}
            className={inputCssStyles}
            required
          >
            <option value="">Select a product</option>
            {products?.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name} (Current Stock: {product.stockQuantity})
              </option>
            ))}
          </select>

          {/* QUANTITY */}
          <label htmlFor="quantity" className={labelCssStyles}>
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            value={formData.quantity}
            className={inputCssStyles}
            min="1"
            required
            disabled={!formData.productId}
          />

          {/* UNIT COST */}
          <label htmlFor="unitCost" className={labelCssStyles}>
            Unit Cost *
          </label>
          <input
            type="number"
            name="unitCost"
            placeholder="Unit Cost"
            onChange={handleChange}
            value={formData.unitCost}
            className={inputCssStyles}
            step="0.01"
            min="0"
            required
            disabled={!formData.productId}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            The purchase price (may differ from selling price)
          </p>

          {/* TOTAL COST */}
          {formData.productId && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Total Cost: {formatCurrency(totalCost)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stock will increase by {formData.quantity}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              disabled={!formData.productId}
            >
              Record Purchase
            </button>
            <button
              onClick={onClose}
              type="button"
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseModal;