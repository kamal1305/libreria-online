"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  const whatsappNumber = "34652409990";
  const defaultText = encodeURIComponent(
    "¡Hola! Estaba mirando la web de Más que libros (Páginas y café) y me gustaría hacer una consulta o recomendación sobre un libro ☕📖"
  );
  const url = `https://wa.me/${whatsappNumber}?text=${defaultText}`;

  return (
    <aside className="fixed bottom-6 right-6 z-40 flex items-center group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar por WhatsApp Business"
        className="whatsapp-floating-badge"
      >
        <div className="whatsapp-floating-bubble">
          <span className="whatsapp-floating-tagline">¿Hablamos de libros? ☕</span>
          <span className="whatsapp-floating-sub">Atención cercana por WhatsApp</span>
        </div>
        <div className="whatsapp-floating-icon">
          <MessageCircle size={26} />
          <span className="whatsapp-pulse-ring" />
        </div>
      </a>
    </aside>
  );
}
