"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useFetch } from "@/hook/useFetch";
import { Client } from "@/common/client";
import { displayMoney } from "@/common/display";

interface ListProductProps {
  products: Product[];
  selectedProduct?: Product;
  onSelectProduct?: (product: Product | undefined) => void;
}

export default function ListProduct({
  products,
  selectedProduct,
  onSelectProduct,
}: ListProductProps) {
  const [productType, _] = useFetch(new Client().getAllProductType);
  const [selectedType, setSelectedType] = useState<string>("all");

  const handleFilterChange = (type: string) => {
    setSelectedType(type);
  };

  const handleProductChange = (product: Product) => {
    onSelectProduct?.(product);
  };

  const filteredProducts =
    selectedType === "all"
      ? products
      : products.filter((product) => product.type_id === selectedType);

  return (
    <>
      {(productType?.product_type_list ?? []).length > 0 && (
        <div className="mb-6 flex flex-wrap justify-start gap-3">
          <span
            className={`${
              selectedType === "all"
                ? "bg-[#8c532a] text-white"
                : "bg-[#f8f8f7] hover:bg-gray-200 cursor-pointer"
            } rounded-xl p-4 flex flex-col items-center justify-center`}
            onClick={() => handleFilterChange("all")}
          >
            <div className="text-lg">All</div>
          </span>
          {productType?.product_type_list.map((type) => (
            <span
              key={type.id}
              className={`${
                selectedType === type.id
                  ? "bg-[#8c532a] text-white"
                  : "bg-[#f8f8f7] hover:bg-gray-200 cursor-pointer"
              } rounded-xl p-4 flex flex-col items-center justify-center`}
              onClick={() => handleFilterChange(type.id)}
            >
              <div className="text-lg">{type.name}</div>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 flex justify-center items-center h-48">
            No products found
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                selectedProduct?.id == product.id
                  ? "bg-[#8c532a] text-white"
                  : "bg-[#f8f8f7] hover:bg-gray-200 cursor-pointer"
              } rounded-xl p-4 flex flex-col items-center justify-center relative ${
                product.quantity === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleProductChange(product)}
            >
              <div className="relative w-full h-[150px] mb-2">
                {" "}
                <img
                  src="/the-box-0.jpeg"
                  width={150}
                  height={150}
                  alt={product.name}
                  className="object-cover absolute inset-0 w-full h-full"
                />
                {product.quantity === 0 && (
                  <div className="absolute inset-0 flex justify-center items-center text-xl text-gray-500 bg-white/50">
                    Unavailable
                  </div>
                )}
              </div>
              <div className="text-lg">{product.name}</div>
              <div
                className={`text-md ${
                  selectedProduct?.id == product.id
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {displayMoney(product.price)} -.
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
