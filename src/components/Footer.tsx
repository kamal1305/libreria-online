import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const instagramUrl =
  "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <p className="footer-brand">
            Segunda Vuelta<span className="footer-brand-accent"> Libros</span>
          </p>
          <p className="footer-tagline">
            Historias con pasado, lectores por conocer. Desde Jerez de la
            Frontera para toda la península.
          </p>
          <div className="footer-social">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
          <small style={{ color: "var(--muted)", fontSize: ".68rem" }}>
            © 2026 Segunda Vuelta Libros
          </small>
        </div>

        {/* Contacto */}
        <div className="footer-col">
          <h3>Contacto</h3>
          <a href="tel:+34956000000">
            <Phone size={14} /> +34 956 000 000
          </a>
          <a href="mailto:info@segundavuelta.es">
            <Mail size={14} /> info@segundavuelta.es
          </a>
          <a href="#contacto">
            <MapPin size={14} /> Jerez de la Frontera, Cádiz
          </a>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <h3>Legal</h3>
          <Link href="#faq">Preguntas frecuentes</Link>
          <Link href="#envios">Gastos de envío</Link>
          <Link href="#devoluciones">Devoluciones</Link>
          <Link href="#legal">Aviso legal</Link>
          <Link href="#privacidad">Privacidad</Link>
          <Link href="#cookies">Cookies</Link>
        </div>

        {/* Atención */}
        <div className="footer-col">
          <h3>Explora</h3>
          <Link href="/resenas">Blog y reseñas</Link>
          <Link href="#catalogo">Catálogo de libros</Link>
          <Link href="#cafe">Café y rincón lector</Link>
          <Link href="#vender">Vender tus libros</Link>
          <Link href="#contacto">Contacto</Link>
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

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      className="social-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
