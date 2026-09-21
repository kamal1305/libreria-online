"use client";

import React from "react";
import { MessageCircle, ShoppingBag, Truck, Coffee, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type BookDetailActionsProps = {
  book: {
    id: string;
    slug: string;
    title: string;
    author: string;
    price: number;
    imageUrl?: string | null;
    condition?: string;
    amazonAffiliateUrl?: string | null;
  };
};

export function BookDetailActions({ book }: BookDetailActionsProps) {
  const { addItem, items } = useCart();
  const isInCart = items.some((it) => it.id === book.id);
  const formattedPrice = book.price.toFixed(2).replace(".", ",");

  const whatsappMsg = encodeURIComponent(
    `¡Hola! Me gustaría pedir el siguiente libro en Más que libros ☕📖:\n\n📚 *"${book.title}"* de ${book.author}\n💰 Precio: ${formattedPrice} €\n🏷️ Estado: Ejemplar de ocasión revisado\n\n¿Me facilitáis los datos para pagarlo por Bizum? ¡Muchas gracias! 💕`
  );
  const whatsappUrl = `https://wa.me/34652409990?text=${whatsappMsg}`;

  return (
    <div className="book-actions-container mt-6">
      {/* Badge de ejemplar único */}
      <div className="flex items-center gap-2 mb-4">
        <span className="badge-unique">
          ✨ Único ejemplar físico disponible
        </span>
        <span className="text-xs text-[var(--muted)] flex items-center gap-1">
          <ShieldCheck size={14} color="var(--sage)" /> Estado verificado
        </span>
      </div>

      {/* Botones de acción principales */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() =>
            addItem({
              id: book.id,
              slug: book.slug,
              title: book.title,
              author: book.author,
              price: book.price,
              imageUrl: book.imageUrl,
              condition: book.condition,
            })
          }
          className="used-book-button flex-1 flex items-center justify-center gap-2"
          style={{ padding: "14px 22px", fontSize: ".96rem" }}
        >
          <ShoppingBag size={18} />
          {isInCart ? "En tu cesta (Ver cesta)" : `Añadir a la cesta · ${formattedPrice} €`}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-order-button sm:w-auto flex items-center justify-center gap-2"
          style={{ padding: "14px 20px" }}
          title="Pedir directamente a la librera por WhatsApp"
        >
          <MessageCircle size={18} />
          <span>Pedir por WhatsApp</span>
        </a>
      </div>

      {/* Ventajas de compra */}
      <div className="mt-6 pt-5 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2">
          <Coffee size={15} color="var(--sage)" />
          <span>Recogida gratis en Jerez con café ☕</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={15} color="var(--sage)" />
          <span>Envío gratis a partir de 30 €</span>
        </div>
      </div>

      {/* Enlace secundario a Amazon (por si busca edición nueva a estrenar) */}
      {book.amazonAffiliateUrl && (
        <div className="mt-6 pt-4 border-t border-dashed border-[var(--line)]">
          <p className="text-xs text-[var(--muted)] m-0 mb-1">
            ¿Prefieres la edición nueva o en tapa dura?
          </p>
          <a
            href={book.amazonAffiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-xs text-[var(--rose-deep)] underline hover:text-[var(--rose-strong)] font-medium"
          >
            Ver edición nueva en Amazon →
          </a>
        </div>
      )}
    </div>
  );
}
