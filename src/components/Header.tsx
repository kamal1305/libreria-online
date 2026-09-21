"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

const navItems = [
  { label: "Recién llegados", href: "#novedades" },
  { label: "Libros", href: "#catalogo" },
  { label: "Nuestra esencia", href: "#nosotros" },
  { label: "Café & Rincón", href: "#cafe" },
  { label: "Reseñas", href: "/resenas", isPage: true },
];

const instagramUrl =
  "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";

type HeaderProps = {
  query: string;
  onQueryChange: (v: string) => void;
  cartCount: number;
  cartOpen: boolean;
  onCartToggle: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
};

export function Header({
  query,
  onQueryChange,
  cartCount,
  cartOpen,
  onCartToggle,
  menuOpen,
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="site-header">
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
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="brand-lockup" aria-label="Segunda Vuelta Libros, inicio">
          <BookMark />
          <span className="brand-text">
            <span className="brand-title">
              Segunda Vuelta <span className="brand-title-accent">Libros</span>
            </span>
            <span className="brand-tagline">
              Libros de ocasión · Café &amp; Helado
            </span>
          </span>
        </Link>

        <form className="header-search" onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}>
          <Search size={17} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Título, autor o ISBN"
            aria-label="Buscar por título, autor o ISBN"
          />
          <button type="submit" aria-label="Buscar">
            <Search size={15} />
          </button>
        </form>

        <div className="header-actions">
          <Link href="/admin/login" className="header-action">
            <UserRound size={18} />
            <span>Mi cuenta</span>
          </Link>
          <button
            className="header-action"
            onClick={onCartToggle}
            aria-expanded={cartOpen}
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cesta</span>
            {cartCount > 0 && <b className="badge">{cartCount}</b>}
          </button>
        </div>
      </div>

      {/* Navigation row — always visible on desktop, hidden on mobile unless toggled */}
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
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

/**
 * Isotipo original: libro abierto con dos páginas de trazo fino
 * (verde agua y rosa pastel), corazón en el lomo y líneas de texto.
 * No imita ninguna marca existente.
 */
function BookMark() {
  return (
    <svg
      className="brand-mark"
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Left page — water green */}
      <path
        d="M24 13.5C19 9.6 12.2 9.8 6 12v22.2c6.2-2 12.7-2 18 1.8"
        stroke="#7FB8A6"
        strokeWidth="1.7"
      />
      {/* Right page — pastel rose */}
      <path
        d="M24 13.5C29 9.6 35.8 9.8 42 12v22.2c-6.2-2-12.7-2-18 1.8"
        stroke="#D98088"
        strokeWidth="1.7"
      />
      {/* Spine */}
      <path d="M24 13.5v22.5" stroke="#D98088" strokeWidth="1.4" />
      {/* Faint type lines */}
      <path d="M10.5 19h8" stroke="#7FB8A6" strokeWidth="1.3" />
      <path d="M10.5 24h5.5" stroke="#7FB8A6" strokeWidth="1.3" />
      <path d="M29.5 19h8" stroke="#D98088" strokeWidth="1.3" />
      <path d="M32 24h5.5" stroke="#D98088" strokeWidth="1.3" />
      {/* Heart bookmark */}
      <path
        d="M24 33.2c-1.5-2-4.3-1.4-4.3.6 0 2 4.3 4 4.3 4s4.3-2 4.3-4c0-2-2.8-2.6-4.3-.6Z"
        fill="#F2C4BE"
        stroke="none"
      />
    </svg>
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