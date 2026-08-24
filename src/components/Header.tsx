"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

const navItems = ["Recién llegados", "Libros", "Nuestra librería", "Compramos tus libros", "Reseñas"];
const instagramUrl = "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";

export function Header({ query, onQueryChange, cartCount, cartOpen, onCartToggle, menuOpen, onMenuToggle }: { query: string; onQueryChange: (value: string) => void; cartCount: number; cartOpen: boolean; onCartToggle: () => void; menuOpen: boolean; onMenuToggle: () => void }) {
  return <header className="professional-header">
    <div className="header-top"><div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-3 lg:px-8"><button className="mobile-menu-button lg:hidden" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={onMenuToggle}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button><Link href="/" className="header-logo"><Image src="/logo.png" alt="Segunda Vuelta Libros" width={240} height={80} priority className="h-14 w-auto object-contain md:h-16" /></Link><form className="header-search" onSubmit={(event) => event.preventDefault()}><Search size={19} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Título, Autor o ISBN" aria-label="Buscar por título, autor o ISBN" /><button type="submit" aria-label="Buscar"><Search size={18} /></button></form><div className="header-actions"><Link href="/admin/login" className="header-action"><UserRound size={19} /><span>Mi cuenta</span></Link><button className="header-action cart-action" onClick={onCartToggle} aria-expanded={cartOpen}><ShoppingBag size={19} /><span className="hidden sm:inline">Mi compra</span>{cartCount > 0 && <b>{cartCount}</b>}</button></div></div></div>
    <div className="header-bottom"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8"><nav className={`${menuOpen ? "flex" : "hidden"} header-nav lg:flex`}>{navItems.map((item) => item === "Reseñas" ? <Link href="/resenas" key={item}>{item}</Link> : <a href={item === "Libros" ? "#catalogo" : item === "Recién llegados" ? "#novedades" : item === "Nuestra librería" ? "#nosotros" : "#vender"} key={item}>{item}{item === "Libros" && <span>⌄</span>}</a>)}</nav><div className="social-nav"><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookMark /></a><a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramMark /></a></div></div></div>
  </header>;
}

function InstagramMark() { return <svg aria-hidden="true" className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>; }
function FacebookMark() { return <span aria-hidden="true" className="facebook-mark">f</span>; }
