"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string | null;
  condition?: string;
};

export type DeliveryMethod = "recogida" | "envio";

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  subtotal: number;
  shippingCost: number;
  total: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  isFreeShipping: boolean;
  generateWhatsAppOrderUrl: (customerName?: string, customerAddress?: string) => string;
  whatsappNumber: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "mas_que_libros_cart_v1";
const DEFAULT_WHATSAPP = "34652409990";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("envio");
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito de localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading cart:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart:", e);
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Si ya está en la cesta, no duplicar (es ejemplar físico único)
      if (prev.some((x) => x.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => setCartOpen((v) => !v);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const freeShippingThreshold = 30;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost =
    deliveryMethod === "recogida" ? 0 : isFreeShipping ? 0 : 3.95;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = subtotal + shippingCost;

  const generateWhatsAppOrderUrl = (
    customerName?: string,
    customerAddress?: string
  ) => {
    const lines = [
      "¡Hola! Me gustaría hacer un pedido en Más que libros (Páginas y café) ☕📖",
      "",
      "Libros seleccionados:",
      ...items.map(
        (it, idx) =>
          `${idx + 1}. ${it.title} - ${it.author} (${it.price.toFixed(2).replace(".", ",")} €)`
      ),
      "",
      `Subtotal: ${subtotal.toFixed(2).replace(".", ",")} €`,
      `Método de entrega: ${
        deliveryMethod === "recogida"
          ? "☕ Recogida local en Jerez (Gratis + Café de cortesía)"
          : `📦 Envío a domicilio peninsular (${
              isFreeShipping ? "¡GRATIS!" : "3,95 €"
            })`
      }`,
      `Total a pagar: ${total.toFixed(2).replace(".", ",")} €`,
    ];

    if (customerName) {
      lines.push(`Nombre: ${customerName}`);
    }
    if (deliveryMethod === "envio" && customerAddress) {
      lines.push(`Dirección de envío: ${customerAddress}`);
    }

    lines.push(
      "",
      "¿Me facilitáis los datos para hacer el abono por Bizum? ¡Muchas gracias! 💕"
    );

    const fullMessage = lines.join("\n");
    return `https://wa.me/${DEFAULT_WHATSAPP}?text=${encodeURIComponent(
      fullMessage
    )}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        deliveryMethod,
        setDeliveryMethod,
        cartOpen,
        setCartOpen,
        toggleCart,
        subtotal,
        shippingCost,
        total,
        freeShippingThreshold,
        amountToFreeShipping,
        isFreeShipping,
        generateWhatsAppOrderUrl,
        whatsappNumber: DEFAULT_WHATSAPP,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
