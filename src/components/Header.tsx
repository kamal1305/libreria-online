"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, MessageCircle, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { label: "Catálogo", href: "#catalogo" },
  { label: "Vender mis libros", href: "#vender" },
  { label: "Club & Actividades", href: "#actividades" },
  { label: "Nuestra esencia", href: "#nosotros" },
  { label: "Futura tienda física", href: "#cafe" },
  { label: "Reseñas", href: "/resenas", isPage: true },
];

const instagramUrl =
  "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";
const whatsappUrl =
  "https://wa.me/34657053233?text=Hola%2C%20quer%C3%ADa%20hacer%20una%20consulta%20en%20M%C3%A1s%20que%20libros%20%E2%98%95%F0%9F%93%96";

type HeaderProps = {
  query: string;
  onQueryChange: (v: string) => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
};

export function Header({
  query,
  onQueryChange,
  menuOpen,
  onMenuToggle,
}: HeaderProps) {
  const { items, toggleCart, cartOpen } = useCart();
  const cartCount = items.length;

  return (
    <header className="site-header">
      {/* 1. BANNER SUPERIOR DE AVISOS */}
      <div className="top-banner" role="region" aria-label="Avisos destacados">
        <div className="top-banner-inner">
          <span className="inline-flex items-center gap-1.5">
            ✨ <strong className="font-bold">ENVÍO GRATIS</strong> A PARTIR DE 30 €
          </span>
          <span className="banner-dot hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            PUNTO DE RECOGIDA EN JEREZ:{" "}
            <span className="banner-pill-free">GRATIS</span>
          </span>
          <span className="banner-dot hidden md:inline">·</span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            ATENCIÓN DIRECTA POR WHATSAPP:{" "}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-white"
            >
              657 05 32 33
            </a>{" "}
            ✨
          </span>
        </div>
      </div>

      {/* Main row */}
      <div className="header-inner">
        <button
          className="lg:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={onMenuToggle}
          style={{
            background: "none",
            border: 0,
            color: "var(--charcoal-soft)",
            cursor: "pointer",
            display: "flex",
            padding: "4px",
          }}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* 2. LOGOTIPO Y MARCA AMPLIADOS */}
        <Link href="/" className="brand-lockup" aria-label="Más que libros, inicio">
          <div className="brand-logo-container">
            <Image
              src="/logo.jpg"
              alt="Logo Más que libros"
              width={64}
              height={64}
              className="brand-logo-img"
              priority
            />
          </div>
          <span className="brand-text">
            <span className="brand-title">
              Más que <span className="brand-title-accent">libros</span>
            </span>
            <span className="brand-tagline">
              Páginas y café · Libros de ocasión
            </span>
          </span>
        </Link>

        {/* Buscador */}
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            document
              .getElementById("catalogo")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <Search size={19} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Título, autor o ISBN..."
            aria-label="Buscar por título, autor o ISBN"
          />
          <button type="submit" aria-label="Buscar">
            <Search size={16} />
          </button>
        </form>

        {/* 3. CESTA, WHATSAPP E INSTAGRAM */}
        <div className="header-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="header-action header-action-wa hidden md:inline-flex"
            title="Atención directa por WhatsApp"
          >
            <MessageCircle className="w-6 h-6 text-[#25D366]" strokeWidth={2.2} />
            <span className="font-semibold text-slate-800">WhatsApp</span>
          </a>

          <Link href="/admin/login" className="header-action" title="Mi cuenta">
            <UserRound className="w-6 h-6 text-slate-700" strokeWidth={1.9} />
            <span className="hidden sm:inline font-semibold text-slate-800">Mi cuenta</span>
          </Link>

          <button
            type="button"
            className="header-action header-action-cart relative"
            onClick={toggleCart}
            aria-expanded={cartOpen}
            aria-label="Ver cesta de libros"
          >
            <ShoppingBag className="w-6 h-6 text-slate-800" strokeWidth={2.2} />
            <span className="hidden sm:inline font-bold text-slate-800">Cesta</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* 4. BARRA DE APARTADOS (NAVBAR INFERIOR VERDE AGUA / MENTA PASTEL) */}
      <nav className={`nav-bar ${menuOpen ? "nav-open" : ""}`}>
        <div className={`nav-inner ${menuOpen ? "flex" : "hidden lg:flex"}`}>
          {navItems.map((item) =>
            item.isPage ? (
              <Link href={item.href} key={item.label} onClick={onMenuToggle}>
                {item.label}
              </Link>
            ) : (
              <a href={item.href} key={item.label} onClick={onMenuToggle}>
                {item.label}
              </a>
            )
          )}
          <div className="nav-social">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @escondida_en_un_libro_"
              title="Instagram @escondida_en_un_libro_"
              className="social-btn instagram-btn"
            >
              <InstagramIcon />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp Business"
              className="social-btn whatsapp-btn"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366]" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-6 h-6 text-[#E1306C]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
