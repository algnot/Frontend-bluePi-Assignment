"use client";
import { Client } from "@/common/client";
import ListProduct from "@/components/ListProduct";
import PopupProduct from "@/components/PopupProduct";
import { useCart } from "@/context/cart";
import { useFetch } from "@/hook/useFetch";
import { Product } from "@/types/product";
import { ShoppingCartIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { cartItems, addToCart } = useCart();
  const [product, _] = useFetch(new Client().getAllProduct);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );

  const getInitialQuantity = (productId: string) => {
    const existingItem = cartItems.find(
      (item) => item.product.id === productId,
    );
    return existingItem?.quantity ?? 1;
  };

  return (
    <div className="container relative">
      <div className={`top-14 right-10 cursor-pointer fixed z-50`}>
        <Link href="/order">
          <ShoppingCartIcon className="h-8 w-8 text-gray-700 hover:text-gray-900" />
        </Link>
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </div>

      <div className="text-6xl mt-20 text-[#8c532a]">Hey,</div>
      <div className="text-5xl mt-5">what's up?</div>
      <div className="mt-10">
        <ListProduct
          products={product?.products ?? []}
          selectedProduct={selectedProduct}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />

        {selectedProduct && (
          <PopupProduct
            initQuantity={getInitialQuantity(selectedProduct.id)}
            product={selectedProduct}
            onClose={() => setSelectedProduct(undefined)}
            onAddToCart={addToCart}
          />
        )}
      </div>
    </div>
  );
}
