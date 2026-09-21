import Link from "next/link";

const offers = [
  { label: "1 libro", price: "3,90 €", tone: "rose" },
  { label: "2 libros", price: "7 €", tone: "mint" },
  { label: "4 libros", price: "12 €", tone: "butter" },
];

export function OffersBanner() {
  return (
    <section className="offers-section">
      <div className="mx-auto max-w-7xl px-5 py-14 text-center lg:px-8">
        <p className="eyebrow">LECTURAS PARA TODOS LOS BOLSILLOS</p>
        <h2>
          Lee más, gasta menos,
          <br />
          <em style={{ fontStyle: "normal", color: "var(--rose-deep)" }}>
            sé feliz.
          </em>
        </h2>
        <div className="offer-card">
          <h3>Libros de lance a precios honestos</h3>
          <div className="offer-list">
            {offers.map((offer) => (
              <div
                className={`offer-price ${offer.tone}`}
                key={offer.label}
              >
                <span>{offer.label}</span>
                <strong>{offer.price}</strong>
              </div>
            ))}
          </div>
          <Link href="#catalogo" className="offer-button">
            VER LIBROS DISPONIBLES
          </Link>
        </div>
      </div>
    </section>
  );
}
