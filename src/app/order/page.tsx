"use client";
import React, { useContext, useState } from "react";
import { CartContext } from "@/context/cart";
import { displayMoney } from "@/common/display";
import Image from "next/image";
import Link from "next/link";
import { Client } from "@/common/client";
import { CreateOrderLineRequest } from "@/types/order";
import { useRouter } from "next/navigation";

const OrderPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const client = new Client();

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity == 0) {
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const onCheckout = async () => {
    if (cartItems.length == 0) {
      return;
    }
    setLoading(true);

    try {
      // Calculate total amount
      const totalAmount = calculateTotal();

      // Generate a simple order ID for demo
      const orderId = `ORDER_${Date.now()}`;

      // Redirect directly to payment page with total amount
      router.push(`/pay/${orderId}?amount=${totalAmount}`);
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[96vh] flex flex-col container">
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="text-lg">
          Back
        </Link>
        <div className="w-16 h-16 relative">
          <Image src="/logo.jpg" alt="Logo" fill objectFit="contain" />
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Order</h1>
        <p className="text-lg">Take Out</p>
      </div>

      <div className="flex-grow overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center mb-4 bg-white/20 rounded-lg p-4"
            >
              <div className="w-16 h-16 relative mr-4">
                <img
                  src="the-box-0.jpeg"
                  alt={item.product.name}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm">{displayMoney(item.product.price)}</p>
              </div>
              <div className="flex items-center">
                <button
                  className={`bg-gray-300 rounded-l-md px-4 py-2 ${
                    item.quantity <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : " hover:bg-gray-400"
                  }`}
                  onClick={
                    item.quantity > 0
                      ? () =>
                          handleQuantityChange(
                            item.product.id,
                            Math.max(0, item.quantity - 1),
                          )
                      : () => {}
                  }
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  className={`bg-gray-300 rounded-r-md px-4 py-2 ${
                    item.quantity >= item.product.quantity
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-400"
                  }`}
                  onClick={
                    item.quantity < item.product.quantity
                      ? () =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity + 1,
                          )
                      : () => {}
                  }
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveFromCart(item.product.id)}
                  className="ml-5 text-red-500"
                >
                  X
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-500">
        <div className="flex justify-between items-center">
          <p className="text-xl">Total</p>
          <p className="text-xl font-bold">{displayMoney(calculateTotal())}</p>
        </div>
        <button
          onClick={onCheckout}
          className={`${
            loading || cartItems.length == 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FFEB3B]"
          } text-black rounded-lg py-3 w-full mt-4`}
        >
          {loading ? "loading.." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
