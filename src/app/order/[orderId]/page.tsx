"use client";
import React from "react";
import { displayMoney, getStatusBadge } from "@/common/display";
import Image from "next/image";
import Link from "next/link";
import { Client } from "@/common/client";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hook/useFetch";

const OrderPage = () => {
  const client = new Client();
  const router = useRouter();
  const params = useParams();
  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;
  const [order, _] = useFetch(() =>
    orderId ? client.getOrder(orderId) : Promise.resolve(null),
  );

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
        <h1 className="text-3xl font-bold">My order</h1>
        <p className="text-lg text-gray-500">#{order?.sale_order_name}</p>
        <span
          className={`${getStatusBadge(
            order?.status ?? "",
          )} text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded`}
        >
          {(order?.status ?? "").toUpperCase()}
        </span>
      </div>

      <div className="flex-grow overflow-y-auto">
        {order?.order_line.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          order?.order_line.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center mb-4 bg-white/20 rounded-lg p-4"
            >
              <div className="w-16 h-16 relative mr-4">
                <img
                  src="/the-box-0.jpeg"
                  alt={item.name}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm">
                  {displayMoney(item.unit_price)} x {item.quantity} pcs{" "}
                </p>
              </div>
              <div className="flex items-center">
                {displayMoney(item.total)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-500">
        <div className="flex justify-between items-center">
          <p className="text-xl">Total</p>
          <p className="text-xl font-bold">{displayMoney(order?.total ?? 0)}</p>
        </div>
        <button
          className="bg-[#FFEB3B] text-black rounded-lg py-3 w-full mt-4"
          onClick={() => router.push("/")}
        >
          More Order
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
