import Link from "next/link";

const offers = [{ label: "1 libro", price: "3,90€", tone: "blue" }, { label: "2 libros", price: "7€", tone: "green" }, { label: "4 libros", price: "12€", tone: "red" }];
export function OffersBanner() { return <section className="offers-banner"><div className="mx-auto max-w-7xl px-5 py-12 text-center lg:px-8"><p className="eyebrow">LECTURAS PARA TODOS LOS BOLSILLOS</p><h2>LEE MÁS, GASTA MENOS, SÉ FELIZ</h2><div className="offer-box"><h3>Miles de libros a precios fijos</h3><div className="offer-list">{offers.map((offer) => <div className={`offer-price ${offer.tone}`} key={offer.label}><span>{offer.label}</span><strong>{offer.price}</strong></div>)}</div><Link href="#catalogo" className="offer-button">VER LIBROS EN OFERTA</Link></div></div></section>; }
