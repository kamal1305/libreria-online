import Link from "next/link";

const offers = [
  { label: "Libros de lance", price: "desde 3,90 €", tone: "rose" },
  { label: "Envío GRATIS", price: "a partir de 30 €", tone: "mint" },
  { label: "Recogida en Jerez", price: "0 € (Gratis)", tone: "butter" },
];

export function OffersBanner() {
  return (
    <section className="offers-section">
      <div className="mx-auto max-w-7xl px-5 py-14 text-center lg:px-8">
        <p className="eyebrow">PÁGINAS Y CAFÉ · LECTURAS PARA TODOS</p>
        <h2>
          Lee más, ahorra con mimo,
          <br />
          <em style={{ fontStyle: "normal", color: "var(--rose-deep)" }}>
            disfruta cada página.
          </em>
        </h2>
        <div className="offer-card">
          <h3>Un rincón acogedor para amantes de la buena lectura</h3>
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
            EXPLORAR LOS 130 LIBROS
          </Link>
        </div>
      </div>
    </section>
  );
}
