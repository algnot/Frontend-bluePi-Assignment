"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const LOCAL_STORAGE_KEY = 'cartItems';

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedItems) {
      try {
        const parsedItems: CartItem[] = JSON.parse(storedItems);
        setCartItems(parsedItems);
      } catch (error) {
        console.error('Error parsing cart items from local storage:', error);
      }
    }
  }, []); // Empty dependency array: runs only on initial render

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]); // Dependency on cartItems: updates storage on change

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};