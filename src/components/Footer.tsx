"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const instagramUrl =
  "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";
const whatsappUrl =
  "https://wa.me/34652409990?text=Hola%2C%20quer%C3%ADa%20hacer%20una%20consulta%20en%20M%C3%A1s%20que%20libros%20%E2%98%95%F0%9F%93%96";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.jpg"
              alt="Logo Más que libros"
              width={54}
              height={54}
              className="brand-logo-img"
            />
            <div>
              <p className="footer-brand m-0">
                Más que <span className="footer-brand-accent">libros</span>
              </p>
              <p className="footer-tagline m-0" style={{ fontSize: ".72rem" }}>
                Páginas y café · Libros de ocasión
              </p>
            </div>
          </div>
          <p className="footer-tagline">
            Historias con pasado, lectores por conocer. Reseñas y libros de ocasión seleccionados con mimo en Jerez de la Frontera.
          </p>
          <div className="footer-social">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @escondida_en_un_libro_"
              title="Instagram @escondida_en_un_libro_"
            >
              <InstagramIcon />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp Business"
              style={{ color: "#25D366" }}
            >
              <MessageCircle size={20} />
            </a>
          </div>
          <small style={{ color: "var(--muted)", fontSize: ".68rem", display: "block", marginTop: 12 }}>
            © 2026 Más que libros · Proyecto Escondida en un libro
          </small>
        </div>

        {/* Contacto & WhatsApp */}
        <div className="footer-col">
          <h3>Contacto & WhatsApp</h3>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontWeight: 700 }}>
            <MessageCircle size={15} /> WhatsApp: +34 652 40 99 90
          </a>
          <a href="mailto:info@masquelibros.es">
            <Mail size={14} /> info@masquelibros.es
          </a>
          <a href="#cafe">
            <MapPin size={14} /> Jerez de la Frontera, Cádiz
          </a>
          <p style={{ fontSize: ".74rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>
            ☕ Rincón de café de cortesía disponible para recogida de pedidos en mano.
          </p>
        </div>

        {/* Envíos y Condiciones */}
        <div className="footer-col">
          <h3>Envíos & Ventajas</h3>
          <p style={{ fontSize: ".78rem", color: "var(--text)", margin: "0 0 6px" }}>
            ☕ <strong>Recogida en Jerez:</strong> GRATIS
          </p>
          <p style={{ fontSize: ".78rem", color: "var(--text)", margin: "0 0 6px" }}>
            📦 <strong>Envío Peninsular:</strong> 3,95 €
          </p>
          <p style={{ fontSize: ".78rem", color: "var(--sage-deep)", margin: "0 0 12px", fontWeight: 700 }}>
            ✨ <strong>¡Envío GRATIS a partir de 30 €!</strong>
          </p>
          <Link href="#envios">Gastos y plazos</Link>
          <Link href="#privacidad">Privacidad y condiciones</Link>
        </div>

        {/* Explora */}
        <div className="footer-col">
          <h3>Explora</h3>
          <Link href="/resenas">Blog & Reseñas de libros</Link>
          <Link href="#catalogo">Catálogo de 130 libros</Link>
          <Link href="#cafe">El rincón del café</Link>
          <Link href="#nosotros">Nuestra esencia</Link>
          <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram @escondida_en_un_libro_
          </Link>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="social-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}
