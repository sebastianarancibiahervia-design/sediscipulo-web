"use client";
import React, { createContext, useContext, useState } from "react";

export type CartItem = {
  id: string; // Ex: 'maranata-back-chocolate-s'
  name: string;
  price: number;
  image: string;
  base: string;
  diseno: string;
  talla: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemsCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  itemsCount: 0,
  cartTotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === newItem.id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ items, itemsCount, cartTotal, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
