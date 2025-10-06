"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { omiseService } from "@/services/omise";
import { PaymentState } from "@/types/omise";
import { useCart } from "@/context/cart";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const amount = parseFloat(searchParams.get("amount") || "0");

  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: "idle",
  });
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId && amount > 0) {
      initiatePayment(amount);
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid payment amount",
        confirmButtonText: "OK",
      });
      router.push("/order");
    }
  }, [orderId, amount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (paymentState.status === "pending" && paymentState.charge?.expires_at) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiresAt = new Date(paymentState.charge!.expires_at).getTime();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

        setTimeLeft(remaining);

        if (remaining === 0) {
          setPaymentState((prev) => ({ ...prev, status: "expired" }));
        }
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentState.status, paymentState.charge?.expires_at]);

  const initiatePayment = async (orderTotal: number) => {
    try {
      setPaymentState({ status: "creating_source" });
      setLoading(false);

      // Create source and charge in one request
      const charge = await omiseService.createSourceAndCharge(
        orderTotal,
        orderId,
        omiseService.getExpirationTime(),
      );

      setPaymentState({
        status: "pending",
        charge,
        qrCodeUrl: charge.source.scannable_code?.image.download_uri,
      });

      // Start polling for payment status
      startPaymentPolling(charge.id);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setPaymentState({
        status: "failed",
        error: error instanceof Error ? error.message : "Payment failed",
      });
      setLoading(false);
    }
  };

  const startPaymentPolling = (chargeId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const charge = await omiseService.getCharge(chargeId);

        if (charge.status === "successful") {
          clearInterval(pollInterval);
          setPaymentState((prev) => ({
            ...prev,
            status: "successful",
            charge,
          }));

          // Clear the cart after successful payment
          clearCart();

          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your order has been paid successfully.",
            confirmButtonText: "Continue",
          });

          // Redirect to order confirmation or home
          router.push("/");
        } else if (charge.status === "failed" || charge.status === "expired") {
          clearInterval(pollInterval);
          setPaymentState((prev) => ({
            ...prev,
            status: charge.status,
            charge,
            error: charge.failure_message || "Payment failed",
          }));
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, 5000); // Poll every 5 seconds for demo

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentState.status === "pending") {
        setPaymentState((prev) => ({ ...prev, status: "expired" }));
      }
    }, 5 * 60 * 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRetry = () => {
    setPaymentState({ status: "idle" });
    initiatePayment(amount);
  };

  const handleCancel = () => {
    router.push("/order");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading order...</p>
        </div>
      );
    }

    switch (paymentState.status) {
      case "idle":
      case "creating_source":
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-lg">Preparing payment...</p>
          </div>
        );

      case "pending":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">สแกนจ่ายเงินตรงนี้</h2>
            <p className="text-lg mb-2">
              จำนวนเงิน {amount.toLocaleString()} บาท
            </p>
            <p className="text-sm text-gray-600 mb-4">
              หมดเวลาใน {formatTime(timeLeft)}
            </p>

            {paymentState.qrCodeUrl && (
              <div className="bg-white p-4 rounded-lg inline-block mb-6">
                <img
                  src={paymentState.qrCodeUrl}
                  alt="PromptPay QR Code"
                  className="w-64 h-64"
                />
              </div>
            )}

            <div className="mt-6 space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case "successful":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-lg mb-6">
              Your order has been paid successfully.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#FFEB3B] text-black px-6 py-3 rounded-lg font-medium"
            >
              Continue Shopping
            </button>
          </div>
        );

      case "failed":
      case "expired":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {paymentState.status === "expired"
                ? "Payment Expired"
                : "Payment Failed"}
            </h2>
            <p className="text-lg mb-6">
              {paymentState.error ||
                "Please try again or use a different payment method."}
            </p>
            <div className="space-x-4">
              <button
                onClick={handleRetry}
                className="bg-[#FFEB3B] text-black px-6 py-3 rounded-lg font-medium"
              >
                Try Again
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[96vh] flex flex-col container">
      <div className="flex items-center justify-between mb-10">
        <Link href="/order" className="text-lg">
          Back
        </Link>
        <div className="w-16 h-16 relative">
          <Image src="/logo.png" alt="Logo" fill objectFit="contain" />
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white/20 rounded-lg p-8 max-w-md w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
