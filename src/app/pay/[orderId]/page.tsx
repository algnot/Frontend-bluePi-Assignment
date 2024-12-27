"use client";
import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { displayMoney, getStatusBadge } from "@/common/display";
import Image from "next/image";
import { BanknotesIcon, CurrencyDollarIcon } from "@heroicons/react/16/solid";
import { useFetch } from "@/hook/useFetch";
import { Client } from "@/common/client";
import { Coin, convertToUserCoin, formatChangeMessage } from "@/types/order";
import { useParams, useRouter } from "next/navigation";

const PaymentPage = () => {
  const client = new Client();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId;
  const [order, _] = useFetch(() => client.getOrder(orderId));

  const [userCoin, setUserCoin] = useState<Coin[]>([
    { name: "1 THB Coin", key: "coin_1", value: 1, quantity: 0 },
    { name: "5 THB Coin", key: "coin_5", value: 5, quantity: 0 },
    { name: "10 THB Coin", key: "coin_10", value: 10, quantity: 0 },
    { name: "20 THB Banknote", key: "bank_20", value: 20, quantity: 0 },
    { name: "50 THB Banknote", key: "bank_50", value: 50, quantity: 0 },
    { name: "100 THB Banknote", key: "bank_100", value: 100, quantity: 0 },
    { name: "500 THB Banknote", key: "bank_500", value: 500, quantity: 0 },
    { name: "1000 THB Banknote", key: "bank_1000", value: 1000, quantity: 0 },
  ]);

  const totalAmount = useMemo(() => {
    return userCoin.reduce((acc, coin) => acc + coin.quantity * coin.value, 0);
  }, [userCoin]);

  const incrementQuantity = (coinKey: string) => {
    handleCanceledOrder();
    setUserCoin((prevCoins) =>
      prevCoins.map((coin) =>
        coin.key === coinKey ? { ...coin, quantity: coin.quantity + 1 } : coin
      )
    );
  };

  const handleCanceledOrder = () => {
    if ((order?.status ?? "Created") == "Canceled") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sale order is canceled",
      });
      router.push("/");
    }
  };

  const decrementQuantity = (coinKey: string) => {
    handleCanceledOrder();
    setUserCoin((prevCoins) =>
      prevCoins.map((coin) =>
        coin.key === coinKey && coin.quantity > 0
          ? { ...coin, quantity: coin.quantity - 1 }
          : coin
      )
    );
  };

  const handleCompletePayment = () => {
    handleCanceledOrder();
    Swal.fire({
      title: "Confirm Payment",
      text: `You are about to pay ${displayMoney(
        totalAmount
      )}. Do you wish to proceed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, pay now",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await client.payOrder({
          sale_order_name: order?.sale_order_name ?? "",
          user_coin: convertToUserCoin(userCoin),
        });
        if (response?.is_error) {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.message,
          });
          router.push("/");
          return;
        }
        await Swal.fire({
          icon: "success",
          title: "Payment Completed",
          html: formatChangeMessage(response),
        });
        router.push(`/order/${orderId}`);
      }
    });
  };

  const handleCancel = () => {
    handleCanceledOrder();
    Swal.fire({
      title: "Cancel Payment",
      text: "Are you sure you want to cancel the payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, go back",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await client.cancelOrder(orderId);
        router.push("/order/" + orderId);
      }
    });
  };

  return (
    <div className="h-[96vh] flex flex-col container">
      <div className="flex items-center justify-between mb-10">
        <div className="w-16 h-16 relative">
          <Image src="/logo.png" alt="Logo" fill objectFit="contain" />
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Select your Coin and Banknote</h1>
        <p className="text-lg text-gray-400">
          Order Number #{order?.sale_order_name}
        </p>
        <span
          className={`${getStatusBadge(
            order?.status ?? ""
          )} text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded`}
        >
          {(order?.status ?? "").toUpperCase()}
        </span>
      </div>

      <div className="flex-grow overflow-y-auto">
        {userCoin.map((coin) => (
          <div
            key={coin.key}
            className="flex items-center mb-4 bg-white/20 rounded-lg p-4"
          >
            <div className="w-16 h-16 relative flex items-center justify-center">
              {coin.key.startsWith("coin_") ? (
                <CurrencyDollarIcon className="h-8 w-8 text-gray-500" />
              ) : (
                <BanknotesIcon className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div className="flex-grow">
              <p className="font-medium">{coin.name}</p>
              <p className="text-sm text-gray-400">
                Total {displayMoney(coin.quantity * coin.value)}
              </p>
            </div>
            <div className="flex items-center">
              <button
                className={`bg-gray-300 rounded-l-md px-4 py-2 ${
                  coin.quantity === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-400"
                }`}
                onClick={() => decrementQuantity(coin.key)}
                disabled={coin.quantity === 0}
              >
                -
              </button>
              <span className="px-3">{coin.quantity}</span>
              <button
                className={`${
                  totalAmount >= (order?.total ?? 0)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-400"
                } bg-gray-300 rounded-r-md px-4 py-2 `}
                onClick={
                  totalAmount <= (order?.total ?? 0)
                    ? () => incrementQuantity(coin.key)
                    : () => {}
                }
                disabled={totalAmount >= (order?.total ?? 0)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-500">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">Total</p>
          <p className="text-xl">{displayMoney(order?.total ?? 0)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold">Your balance</p>
          <p className="text-xl">{displayMoney(totalAmount)}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white rounded-lg py-3 w-full mt-4 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleCompletePayment}
            className={`${
              totalAmount < (order?.total ?? 0)
                ? "cursor-not-allowed bg-gray-400"
                : "bg-[#FFEB3B]"
            }  text-black rounded-lg py-3 w-full mt-4 font-bold`}
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
