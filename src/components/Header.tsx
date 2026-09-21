"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, MessageCircle, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { label: "Recién llegados", href: "#novedades" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Nuestra esencia", href: "#nosotros" },
  { label: "Café & Rincón", href: "#cafe" },
  { label: "Reseñas", href: "/resenas", isPage: true },
];

const instagramUrl =
  "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";
const whatsappUrl =
  "https://wa.me/34652409990?text=Hola%2C%20quer%C3%ADa%20hacer%20una%20consulta%20en%20M%C3%A1s%20que%20libros%20%E2%98%95%F0%9F%93%96";

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

        {/* Official circular logo & brand */}
        <Link href="/" className="brand-lockup" aria-label="Más que libros, inicio">
          <Image
            src="/logo.jpg"
            alt="Logo Más que libros"
            width={48}
            height={48}
            className="brand-logo-img"
            priority
          />
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
          <Search size={17} color="var(--muted)" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Título, autor o ISBN..."
            aria-label="Buscar por título, autor o ISBN"
          />
          <button type="submit" aria-label="Buscar">
            <Search size={15} />
          </button>
        </form>

        {/* Acciones */}
        <div className="header-actions">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="header-action hidden md:flex"
            title="Atención por WhatsApp"
          >
            <MessageCircle size={18} color="#25D366" />
            <span>WhatsApp</span>
          </a>

          <Link href="/admin/login" className="header-action">
            <UserRound size={18} />
            <span className="hidden sm:inline">Mi cuenta</span>
          </Link>

          <button
            type="button"
            className="header-action relative"
            onClick={toggleCart}
            aria-expanded={cartOpen}
            aria-label="Ver cesta de libros"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cesta</span>
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </button>
        </div>
      </div>

      {/* Navigation row */}
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
              <MessageCircle size={18} />
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
