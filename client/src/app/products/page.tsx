"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/state/api";
import { Package, PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/_components/Header";
import Rating from "@/app/_components/Rating";
import ProductModal from "./components/ProductModal";
import { Product } from "@/state/api";

import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/currency";

const Products = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (selectedProduct) {
      await updateProduct({
        ...productData,
        productId: selectedProduct.productId,
      });
    } else {
      await createProduct(productData as Product);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm(t("Products.deleteConfirmation"))) {
      await deleteProduct(productId);
    }
  };

  if (isLoading) {
    return <div className="py-4">{t("Products.loading")}</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">{t("Products.error")}</div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder={t("Products.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name={t("Products.title")} />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 text-gray-200!" />{" "}
          {t("Products.createButton")}
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <div>{t("Products.loading")}</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 bg-gray-200 rounded-2xl mb-3 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-lg text-gray-900 font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-800">{formatCurrency(product.price)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  {t("Products.stock")}: {product.stockQuantity}
                </div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}
                <div className="flex mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-700"
                  >
                    {t("Products.editButton")}
                  </button>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    {t("Products.deleteButton")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
