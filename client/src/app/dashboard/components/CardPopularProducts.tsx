import { Product } from "@/state/api";
import { formatCurrency } from "@/lib/currency";
import { Package, ShoppingBag } from "lucide-react";
import Rating from "../../_components/Rating";

interface CardPopularProductsProps {
  products: Product[];
}

import { useTranslation } from "react-i18next";

const CardPopularProducts = ({ products }: CardPopularProductsProps) => {
  const { t } = useTranslation();
  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
        {t("CardPopularProducts.title")}
      </h3>
      <hr />
      <div className="overflow-auto h-full">
        {products.map((product) => (
          <div
            key={product.productId}
            className="flex items-center justify-between gap-3 px-5 py-7 border-b"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex flex-col justify-between gap-1">
                <div className="font-bold text-gray-700">
                  {product.name}
                </div>
                <div className="flex text-sm items-center">
                  <span className="font-bold text-blue-500 text-xs">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="mx-2">|</span>
                  <Rating rating={product.rating || 0} />
                </div>
              </div>
            </div>
            <div className="text-xs flex items-center">
              <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                <ShoppingBag className="w-4 h-4" />
              </button>
              {product.quantitySold} {t("CardPopularProducts.sold")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPopularProducts;