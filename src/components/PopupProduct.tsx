import { displayMoney } from "@/common/display";
import { Product } from "@/types/product";
import React, { useState } from "react";

interface SelectProductProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  initQuantity: number;
}

export default function PopupProduct({
  product,
  onClose,
  onAddToCart,
  initQuantity,
}: SelectProductProps) {
  const [quantity, setQuantity] = useState<number>(initQuantity);

  const handleClose = () => {
    onClose();
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const onIncreaseQuantity = () => {
    if (quantity + 1 > product.quantity) {
      return;
    }

    setQuantity(quantity + 1);
  };

  const onDecreaseQuantity = () => {
    if (quantity == 0) {
      return;
    }
    setQuantity(quantity - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <img
            src="/the-box-0.webp"
            alt={product.name}
            className="max-w-full object-cover"
            width={320}
            height={320}
          />{" "}
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">{product.name}</h2>
        <p className="text-xl text-center text-yellow-500 mb-4">
          {displayMoney(product.price * quantity)}-.
        </p>
        <div className="flex justify-center items-center mb-6">
          <button
            className={`bg-gray-200 rounded-l-md px-4 py-2 hover:bg-gray-300 ${
              quantity == 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onDecreaseQuantity}
          >
            -
          </button>
          <span className="px-4 py-2">{quantity}</span>
          <button
            className={`bg-gray-200 rounded-r-md px-4 py-2 hover:bg-gray-300 ${
              quantity == product.quantity
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={onIncreaseQuantity}
          >
            +
          </button>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-yellow-400 text-white rounded-lg py-2 px-6 hover:bg-yellow-500 font-bold"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src="/the-box-0.webp"
                alt={product.name}
                className="rounded-lg object-cover"
                width={80}
                height={80}
              />
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">
                  {displayMoney(product.price)}-. (available: {product.quantity}
                  )
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
