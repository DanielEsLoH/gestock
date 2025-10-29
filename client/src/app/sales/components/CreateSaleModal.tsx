import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/_components/Header";
import { useGetProductsQuery } from "@/state/api";
import { formatCurrency } from "@/lib/currency";

type SaleFormData = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

type CreateSaleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: SaleFormData) => void;
};

const CreateSaleModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateSaleModalProps) => {
  const { data: products } = useGetProductsQuery();
  const [formData, setFormData] = useState<SaleFormData>({
    productId: "",
    quantity: 1,
    unitPrice: 0,
  });

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const selectedProduct = products?.find((p) => p.productId === productId);

    setFormData({
      ...formData,
      productId,
      unitPrice: selectedProduct?.price || 0,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "unitPrice" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ productId: "", quantity: 1, unitPrice: 0 });
    onClose();
  };

  if (!isOpen) return null;

  const selectedProduct = products?.find((p) => p.productId === formData.productId);
  const totalAmount = formData.quantity * formData.unitPrice;

  const labelCssStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 dark:border-gray-600 border-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";

  return (
    <div className="fixed inset-0 bg-gray-600/50 dark:bg-gray-900/70 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <Header name="Record New Sale" />
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
                {product.name} (Stock: {product.stockQuantity})
              </option>
            ))}
          </select>

          {selectedProduct && selectedProduct.stockQuantity === 0 && (
            <p className="text-red-500 text-sm mb-2">Out of stock!</p>
          )}

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
            max={selectedProduct?.stockQuantity || 0}
            required
            disabled={!formData.productId}
          />
          {selectedProduct && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Available: {selectedProduct.stockQuantity}
            </p>
          )}

          {/* UNIT PRICE */}
          <label htmlFor="unitPrice" className={labelCssStyles}>
            Unit Price *
          </label>
          <input
            type="number"
            name="unitPrice"
            placeholder="Unit Price"
            onChange={handleChange}
            value={formData.unitPrice}
            className={inputCssStyles}
            step="0.01"
            min="0"
            required
            disabled={!formData.productId}
          />

          {/* TOTAL AMOUNT */}
          {formData.productId && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Total Amount: {formatCurrency(totalAmount)}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!formData.productId || !selectedProduct || selectedProduct.stockQuantity < formData.quantity}
            >
              Record Sale
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

export default CreateSaleModal;