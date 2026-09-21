"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Heart, ShoppingBag, Trash2, Truck, X, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const {
    items,
    removeItem,
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    cartOpen,
    setCartOpen,
    subtotal,
    shippingCost,
    total,
    freeShippingThreshold,
    amountToFreeShipping,
    isFreeShipping,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  if (!cartOpen) return null;

  const whatsappUrl = generateWhatsAppOrderUrl(customerName, customerAddress);

  return (
    <>
      <div
        className="cart-backdrop"
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />
      <aside className="cart-drawer" aria-label="Cesta de la compra">
        {/* Header */}
        <div className="cart-header">
          <div className="flex items-center gap-2">
            <div className="cart-header-icon">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="cart-title">Tu Cesta de Libros</h2>
              <p className="cart-subtitle">
                {items.length === 1
                  ? "1 libro seleccionado"
                  : `${items.length} libros seleccionados`}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={() => setCartOpen(false)}
            aria-label="Cerrar cesta"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">☕📖</div>
            <h3>Tu cesta está vacía</h3>
            <p>
              Date una vuelta por el catálogo y encuentra historias listas para una segunda vida.
            </p>
            <button
              type="button"
              className="used-book-button"
              onClick={() => {
                setCartOpen(false);
                document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="cart-body">
            {/* Selector de Entrega */}
            <div className="delivery-selector">
              <span className="delivery-label">¿Cómo quieres recibir tus libros?</span>
              <div className="delivery-options">
                <button
                  type="button"
                  className={`delivery-btn ${deliveryMethod === "recogida" ? "active" : ""}`}
                  onClick={() => setDeliveryMethod("recogida")}
                >
                  <Coffee size={16} />
                  <span>
                    <strong>Recogida en Jerez</strong>
                    <small>Punto de entrega gratis</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={`delivery-btn ${deliveryMethod === "envio" ? "active" : ""}`}
                  onClick={() => setDeliveryMethod("envio")}
                >
                  <Truck size={16} />
                  <span>
                    <strong>Envío a Domicilio</strong>
                    <small>{isFreeShipping ? "¡GRATIS!" : "3,95 €"}</small>
                  </span>
                </button>
              </div>

              {/* Barra de progreso de envío gratis */}
              {deliveryMethod === "envio" && (
                <div className="shipping-progress-box">
                  {isFreeShipping ? (
                    <p className="shipping-free-badge">
                      ✨ ¡Enhorabuena! Tienes <strong>ENVÍO GRATIS</strong> en este pedido.
                    </p>
                  ) : (
                    <>
                      <p className="shipping-progress-text">
                        Añade <strong>{amountToFreeShipping.toFixed(2).replace(".", ",")} €</strong> más para conseguir <strong>Envío Gratis</strong>
                      </p>
                      <div className="shipping-progress-track">
                        <div
                          className="shipping-progress-fill"
                          style={{
                            width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Listado de Libros */}
            <div className="cart-items-list">
              {items.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <div className="cart-item-thumb">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={60}
                        height={90}
                        unoptimized
                        className="cart-thumb-img"
                      />
                    ) : (
                      <div className="cart-thumb-placeholder">📖</div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <Link
                      href={`/libros/${item.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="cart-item-title"
                    >
                      {item.title}
                    </Link>
                    <p className="cart-item-author">{item.author}</p>
                    <div className="cart-item-meta">
                      <span className="cart-item-price">
                        {item.price.toFixed(2).replace(".", ",")} €
                      </span>
                      <span className="badge-unique">Único ejemplar</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Quitar ${item.title}`}
                    title="Quitar de la cesta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Formulario rápido opcional de datos */}
            <div className="cart-customer-section">
              <button
                type="button"
                className="cart-toggle-details"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "▲ Ocultar datos de entrega" : "▼ Indicar mis datos de entrega (opcional antes de enviar)"}
              </button>
              {showAddressForm && (
                <div className="cart-address-fields">
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="cart-input"
                  />
                  {deliveryMethod === "envio" && (
                    <input
                      type="text"
                      placeholder="Dirección completa de entrega"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="cart-input"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Resumen y Totales */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal ({items.length} {items.length === 1 ? "libro" : "libros"})</span>
                <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
              </div>
              <div className="cart-summary-row">
                <span>
                  {deliveryMethod === "recogida"
                    ? "Recogida local en Jerez"
                    : "Envío Peninsular"}
                </span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="text-[var(--sage)]">GRATIS</strong>
                  ) : (
                    `${shippingCost.toFixed(2).replace(".", ",")} €`
                  )}
                </span>
              </div>
              <div className="cart-summary-total">
                <span>Total a pagar</span>
                <strong>{total.toFixed(2).replace(".", ",")} €</strong>
              </div>

              {/* Botón Principal: WhatsApp Business / Bizum */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-order-button"
              >
                <MessageCircle size={20} />
                <span>Finalizar pedido por WhatsApp</span>
              </a>

              <div className="cart-payment-badges" style={{ margin: "10px 0 6px", textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: ".76rem", fontWeight: 700, color: "var(--charcoal-soft)" }}>
                  💳 Métodos de pago aceptados:
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", fontSize: ".72rem", color: "var(--muted)" }}>
                  <span style={{ background: "rgba(37, 211, 102, 0.12)", color: "#128C7E", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>📲 Bizum</span>
                  <span style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: "6px" }}>🏦 Transferencia</span>
                  <span style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: "6px" }}>💶 En mano en Jerez</span>
                </div>
              </div>
              <p className="cart-guarantee">
                🔒 Trato directo y cercano con la librera · Confirmación al instante
              </p>

              <button
                type="button"
                className="cart-continue-btn"
                onClick={() => setCartOpen(false)}
              >
                Seguir hojeando libros
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
