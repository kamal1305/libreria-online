"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Coffee,
  Heart,
  IceCreamCone,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { useCart } from "@/lib/cart-context";
import { Footer } from "@/components/Footer";
import { OffersBanner } from "@/components/OffersBanner";
import { CategoryIconNav } from "@/components/CategoryIconNav";

type StoreBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string;
  amazonAffiliateUrl: string | null;
};
type StoreReview = {
  id?: string;
  slug: string;
  title: string;
  author: string;
  rating: number;
  coverUrl: string | null;
  coverAlt: string | null;
  synopsis: string;
  content?: string;
  instagramUrl?: string | null;
};

const conditionLabels: Record<string, string> = {
  LIKE_NEW: "Como nuevo",
  VERY_GOOD: "Muy buen estado",
  GOOD: "Buen estado",
  ACCEPTABLE: "Aceptable",
  DEFECTIVE: "Con defectos",
};

const instagramUrl =
  "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==";

/** Quita tildes y normaliza a minúsculas para búsquedas insensibles. */
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Storefront({
  books,
  reviews,
}: {
  books: StoreBook[];
  reviews: StoreReview[];
}) {
  const [query, setQuery] = useState("");
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const scrollReviews = (direction: "left" | "right") => {
    if (reviewsScrollRef.current) {
      const amount = direction === "left" ? -370 : 370;
      reviewsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };
  const [condition, setCondition] = useState("Todas");
  const [category, setCategory] = useState("Todos");
  const [price, setPrice] = useState("Cualquier precio");
  const [menuOpen, setMenuOpen] = useState(false);
  const { addItem, toggleCart } = useCart();
  const [visibleLimit, setVisibleLimit] = useState(8);

  // Al cambiar búsqueda o filtros, restablecer a 8 libros para no alargar la página
  useEffect(() => {
    setVisibleLimit(8);
  }, [query, category, condition, price]);

  const categories = [
    "Todos",
    ...Array.from(new Set(books.map((b) => b.category))),
  ];
  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const q = normalize(query);
        const searchPool = normalize(`${book.title} ${book.author} ${book.category} ${book.slug}`);
        const matchesQuery = !q || searchPool.includes(q);
        const matchesCondition =
          condition === "Todas" ||
          conditionLabels[book.condition] === condition;
        const matchesCategory =
          category === "Todos" || book.category === category;
        const matchesPrice =
          price === "Cualquier precio" ||
          (price === "Menos de 8 EUR" ? book.price < 8 : book.price >= 8);
        return (
          matchesQuery && matchesCondition && matchesCategory && matchesPrice
        );
      }),
    [books, category, condition, price, query]
  );
  const addToCart = (book: StoreBook) => {
    addItem({
      id: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      price: book.price,
      imageUrl: book.imageUrl,
      condition: book.condition,
    });
  };
  const scrollToCatalog = () =>
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const featured = books[0];

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--text)]">


      {/* Header */}
      <Header
        query={query}
        onQueryChange={setQuery}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      {/* Mobile nav backdrop — rendered outside header to escape backdrop-filter containment */}
      {menuOpen && (
        <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* Cart drawer handled globally by CartDrawer component */}

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:items-center lg:gap-14 lg:px-8 lg:py-28">
          {/* Left: editorial copy */}
          <div className="hero-content md:col-span-6">
            <p className="eyebrow">UNA SEGUNDA VIDA PARA CADA HISTORIA</p>
            <h1>
              Historias que aún tienen mucho que <em>decir</em>.
            </h1>
            <p className="hero-subtitle">
              Libros usados escogidos en Jerez, descritos sin rodeos, junto a
              un café de cortesía y un helado para los más pequeños. Entra,
              hojea y descansa.
            </p>

            <form className="hero-search" onSubmit={(e) => { e.preventDefault(); scrollToCatalog(); }}>
              <Search size={18} color="var(--muted)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca por título o autor"
                aria-label="Buscar por título o autor"
              />
              <button type="submit">Buscar</button>
            </form>

            <div className="hero-pills">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right: featured book card */}
          <div className="md:col-span-6">
            <HeroFeature book={featured} onAdd={addToCart} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OFFERS
      ═══════════════════════════════════════════════════════════ */}
      <OffersBanner />

      {/* ═══════════════════════════════════════════════════════════
          CATEGORY GRID
      ═══════════════════════════════════════════════════════════ */}
      <CategoryIconNav
        categories={categories}
        activeCategory={category}
        onSelectCategory={setCategory}
      />

      {/* ═══════════════════════════════════════════════════════════
          NOVEDADES
      ═══════════════════════════════════════════════════════════ */}
      {/* Novedades unificadas en el catálogo principal */}

      {/* ═══════════════════════════════════════════════════════════
          RESEÑAS
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="resenas"
        className="reviews-section content-section mx-auto max-w-7xl px-5 py-20 lg:px-8"
      >
        <div className="reviews-header-flex">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="eyebrow" style={{ margin: 0 }}>BOOKSTAGRAM · @ESCONDIDA_EN_UN_LIBRO_</span>
              <span style={{ fontSize: ".72rem", background: "rgba(193, 53, 132, .1)", color: "#C13584", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>
                ✨ Reseñas destacadas
              </span>
            </div>
            <h2 style={{ margin: "0 0 6px" }}>Lecturas que nos han robado el corazón</h2>
            <p style={{ margin: 0, fontSize: ".92rem", color: "var(--muted)", maxWidth: 640 }}>
              Opiniones sinceras, apasionadas y sin spoilers de la librera. Desliza para descubrir tu próxima obsesión literaria.
            </p>
          </div>
          <div className="reviews-controls hidden sm:flex">
            <button
              onClick={() => scrollReviews("left")}
              className="review-scroll-arrow"
              aria-label="Ver reseñas anteriores"
              type="button"
            >
              ←
            </button>
            <button
              onClick={() => scrollReviews("right")}
              className="review-scroll-arrow"
              aria-label="Ver más reseñas"
              type="button"
            >
              →
            </button>
          </div>
        </div>

        <div ref={reviewsScrollRef} className="reviews-scroll-container">
          {reviews.map((review) => (
            <div key={review.id} className="ig-review-card">
              {/* Cabecera estilo Instagram */}
              <div className="ig-card-header">
                <div className="ig-author-badge">
                  <Image
                    src="/logo.jpg"
                    alt="Logo Escondida en un libro"
                    width={36}
                    height={36}
                    className="ig-avatar"
                  />
                  <div>
                    <span className="ig-user-name">escondida_en_un_libro_</span>
                    <span className="ig-user-tag">Librera & reseñista</span>
                  </div>
                </div>
                <span className="ig-rating-pill">
                  ⭐ {review.rating}/5
                </span>
              </div>

              {/* Libro reseñado */}
              <div className="ig-book-row">
                <div style={{ position: "relative", width: 72, height: 104, flexShrink: 0 }}>
                  <Image
                    src={review.coverUrl || "/covers/alas-de-sangre-empireo-1.svg"}
                    alt={review.coverAlt || review.title}
                    fill
                    sizes="72px"
                    className="ig-book-cover-img"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="ig-book-details">
                  <span className="ig-book-genre">{review.synopsis || "Lectura recomendada"}</span>
                  <h3 className="ig-book-title">{review.title}</h3>
                  <p className="ig-book-author">{review.author}</p>
                </div>
              </div>

              {/* Fragmento de la reseña */}
              <blockquote className="ig-review-quote">
                &ldquo;{review.content}&rdquo;
              </blockquote>

              {/* Acción directa */}
              <a
                href={review.instagramUrl || instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-card-action"
              >
                <span>Ver reseña en Instagram</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          ))}
        </div>

        {/* Tarjeta de llamada a Instagram: "Te han gustado, visita mi página allí hay más" */}
        <div className="ig-more-banner">
          <div className="ig-more-info">
            <span className="ig-more-badge">
              <InstagramMark /> Comunidad de lectura
            </span>
            <h3>¿Te han gustado estas reseñas? En mi Instagram hay muchas más 📚☕</h3>
            <p>
              Cada semana comparto recomendaciones en vídeo, unboxings de novedades que llegan a la librería, debates del club de lectura y fotos de cada rincón literario. ¡Únete a nuestra pequeña gran familia lectora!
            </p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-more-btn"
          >
            <InstagramMark />
            <span>Visitar @escondida_en_un_libro_</span>
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CAFÉ CORNER
      ═══════════════════════════════════════════════════════════ */}
      <section id="cafe" className="cafe-section">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow">NUESTRO SUEÑO · PRÓXIMA TIENDA FÍSICA</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)",
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-.015em",
              margin: "0 0 16px",
              color: "var(--charcoal-soft)",
            }}
          >
            El futuro rincón de café y lectura en Jerez
          </h2>
          <p style={{ maxWidth: 680, margin: "0 0 32px", color: "var(--muted)", fontSize: ".92rem", lineHeight: 1.6 }}>
            Actualmente operamos como librería online con envíos a toda la península y punto de recogida en Jerez. Nuestro sueño y próximo paso es abrir un espacio físico en Jerez de la Frontera donde compartir cafés, helados y charlas entre páginas.
          </p>

          <div className="cafe-grid">
            {/* Café */}
            <div className="cafe-card">
              <div className="cafe-icon">
                <Coffee size={24} />
              </div>
              <h3>Rincón de café de especialidad</h3>
              <p>
                Diseñado para cuando abramos la tienda física: un rincón acogedor donde poder sentarte con calma a disfrutar de una buena lectura y un café recién preparado.
              </p>
              <span className="cafe-badge">📍 Proyecto tienda física en Jerez</span>
            </div>

            {/* Helados infantiles */}
            <div className="cafe-card">
              <div className="cafe-icon">
                <IceCreamCone size={24} />
              </div>
              <h3>Espacio familiar y dulce</h3>
              <p>
                Pensado para la futura apertura física en Jerez: que los más pequeños descubran cuentos, cómics y la magia de leer en un ambiente dulce, alegre y familiar.
              </p>
              <span className="cafe-badge">📍 Proyecto tienda física en Jerez</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NUESTRA ESENCIA / PROYECTO JEREZ
      ═══════════════════════════════════════════════════════════ */}
      <section id="nosotros" className="essence-section">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="essence-grid">
            <div className="essence-image soft-dots">
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
                alt="Estantería de librería con libros de segunda mano"
              />
            </div>
            <div className="essence-content">
              <p className="eyebrow">NUESTRA ESENCIA</p>
              <h2>
                Libros con pasado,
                <br />
                <em>lectores por conocer</em>.
              </h2>
              <p>
                Segunda Vuelta nace en Jerez con una idea clara: cada libro
                tiene una historia que merece contarse de nuevo. Seleccionamos,
                revisamos y describimos cada ejemplar con honestidad para que
                sepas exactamente lo que compras.
              </p>
              <p>
                Nuestra librería combina el placer de descubrir libros con un
                rincón de café y un espacio familiar. Creemos que comprar un
                libro de ocasión puede ser una experiencia cálida, luminosa y
                placentera.
              </p>

              <div className="essence-details">
                <div className="essence-detail">
                  <div className="essence-detail-icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <strong>Jerez de la Frontera</strong>
                    <span>Envío a toda la península</span>
                  </div>
                </div>
                <div className="essence-detail">
                  <div className="essence-detail-icon">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <strong>Selección cuidada</strong>
                    <span>Solo lo que merece una segunda vuelta</span>
                  </div>
                </div>
                <div className="essence-detail">
                  <div className="essence-detail-icon">
                    <Check size={18} />
                  </div>
                  <div>
                    <strong>Estado verificado</strong>
                    <span>Fotos y descripción honestas</span>
                  </div>
                </div>
                <div className="essence-detail">
                  <div className="essence-detail-icon">
                    <Heart size={18} />
                  </div>
                  <div>
                    <strong>Consumo consciente</strong>
                    <span>Reutilizar es cuidar el planeta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATÁLOGO COMPLETO
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="catalogo"
        className="catalog-section mx-auto max-w-7xl scroll-mt-10 px-5 py-16 lg:px-8"
      >
        <div className="section-header">
          <div>
            <p className="eyebrow">EXPLORA LA ESTANTERÍA</p>
            <h2>Libros de segunda mano</h2>
          </div>
          <span className="result-count">
            {filteredBooks.length} ejemplares
          </span>
        </div>

        <div className="catalog-layout">
          <aside className="filters">
            <div className="flex items-center justify-between">
              <h3>Filtrar por</h3>
              <button
                className="text-xs underline"
                onClick={() => {
                  setCategory("Todos");
                  setCondition("Todas");
                  setPrice("Cualquier precio");
                }}
              >
                Limpiar
              </button>
            </div>
            <label>
              Género
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Precio
              <select value={price} onChange={(e) => setPrice(e.target.value)}>
                <option>Cualquier precio</option>
                <option>Menos de 8 EUR</option>
                <option>8 EUR o más</option>
              </select>
            </label>
            <label>
              Estado
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option>Todas</option>
                {Object.values(conditionLabels).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </aside>

          <div>
            {/* Feedback de búsqueda activa */}
            {query.trim() && (
              <div className="mb-6 flex items-center justify-between p-3.5 rounded-2xl bg-[var(--mint-tint)] border border-[var(--sage-light)] text-sm">
                <span>
                  🔍 Búsqueda: <strong>"{query}"</strong> — <strong>{filteredBooks.length}</strong> {filteredBooks.length === 1 ? "libro encontrado" : "libros encontrados"}
                </span>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs font-bold text-[var(--sage-deep)] underline cursor-pointer ml-3"
                >
                  ✕ Limpiar búsqueda
                </button>
              </div>
            )}

            {/* Cuadrícula limitada para que no sea infinita */}
            <BookGrid books={filteredBooks.slice(0, visibleLimit)} onAdd={addToCart} />

            {/* Botón Ver más libros */}
            {filteredBooks.length > visibleLimit && (
              <div className="flex flex-col items-center justify-center mt-10 gap-2">
                <button
                  type="button"
                  className="used-book-button"
                  onClick={() => setVisibleLimit((prev) => prev + 12)}
                  style={{ padding: "13px 32px", fontSize: ".96rem" }}
                >
                  Ver más libros (+{filteredBooks.length - visibleLimit} disponibles)
                </button>
                <span className="text-xs text-[var(--muted)]">
                  Mostrando {Math.min(visibleLimit, filteredBooks.length)} de {filteredBooks.length} libros disponibles
                </span>
              </div>
            )}

            {visibleLimit > 8 && filteredBooks.length > 8 && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="text-xs text-[var(--muted)] hover:underline cursor-pointer"
                  onClick={() => {
                    setVisibleLimit(8);
                    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  ▲ Mostrar solo los primeros 8 libros
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BENEFICIOS
      ═══════════════════════════════════════════════════════════ */}
      
      {/* ── SECCIÓN COMPRAMOS TUS LIBROS USADOS ── */}
      <section id="vender" className="vender-section mx-auto max-w-7xl px-5 py-16 lg:px-8 scroll-mt-10">
        <div className="vender-card soft-dots">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow">ECONOMÍA CIRCULAR & LECTURA SOSTENIBLE</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: "var(--charcoal-soft)", margin: "0 0 14px", lineHeight: 1.15 }}>
              ¿Tienes libros que ya has leído? <br />
              <span style={{ color: "var(--rose-deep)" }}>Dales una segunda vida y gana dinero</span>
            </h2>
            <p style={{ color: "var(--text)", fontSize: ".95rem", lineHeight: 1.6 }}>
              No dejes que tus libros acumulen polvo en la estantería. En <strong>Más que libros</strong> te los valoramos de forma justa, rápida y sin compromiso para que otros lectores puedan disfrutarlos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Paso 1 */}
            <div className="vender-step">
              <div className="vender-step-num">1</div>
              <h3>📸 Foto a los lomos</h3>
              <p>
                Coloca los libros juntos y haz una foto clara a los lomos con tu móvil donde se lean los títulos y autores.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="vender-step">
              <div className="vender-step-num">2</div>
              <h3>💬 Valoración rápida</h3>
              <p>
                Envíanos la foto por WhatsApp al <strong>657 05 32 33</strong>. Te respondemos en menos de 24 horas con nuestra oferta de compra o canje.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="vender-step">
              <div className="vender-step-num">3</div>
              <h3>💶 Pago o saldo extra</h3>
              <p>
                Te abonamos el dinero por <strong>Bizum o transferencia</strong>, o llévate un <strong>+20% extra en saldo</strong> para elegir libros de nuestro catálogo.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="vender-cta-box">
            <div className="vender-cta-info">
              <h4 className="vender-cta-title">
                ¿Tienes un lote de libros para valorar?
              </h4>
              <p className="vender-cta-desc">
                Atención directa y cercana con la librera por WhatsApp. Recogida en Jerez o a domicilio en lotes grandes.
              </p>
            </div>
            <a
              href="https://wa.me/34657053233?text=%C2%A1Hola!%20Tengo%20libros%20en%20casa%20que%20ya%20he%20le%C3%ADdo%20y%20me%20gustar%C3%ADa%20que%20me%20los%20valor%C3%A9is%20para%20darles%20una%20segunda%20vida%20%F0%9F%93%9A%E2%9C%A8"
              target="_blank"
              rel="noopener noreferrer"
              className="vender-cta-btn"
            >
              <span>💬 Valorar mis libros por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>


      {/* ── SECCIÓN ACTIVIDADES, CLUB DE LECTURA & NOTICIAS ── */}
      <section id="actividades" className="actividades-section mx-auto max-w-7xl px-5 py-16 lg:px-8 scroll-mt-10">
        <div className="section-header">
          <div>
            <p className="eyebrow">COMUNIDAD LECTORA & EVENTOS</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 600, color: "var(--charcoal-soft)", margin: 0 }}>
              Club de Lectura &amp; Actividades
            </h2>
          </div>
          <span className="result-count">@escondida_en_un_libro_</span>
        </div>

        <p style={{ color: "var(--muted)", maxWidth: 650, margin: "10px 0 32px", fontSize: ".92rem", lineHeight: 1.6 }}>
          En <strong>Más que libros</strong> no solo vendemos páginas: creamos comunidad. Participa en nuestras dinámicas literarias, comparte lecturas y disfruta de actividades pensadas para devoradores de historias.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Actividad 1: Club de Lectura */}
          <div className="actividad-card">
            <div className="actividad-badge">Mensual</div>
            <div className="actividad-icon">📖</div>
            <h3>Club de Lectura "Páginas y Café"</h3>
            <p>
              Leemos juntos un libro seleccionado cada mes por <strong>@escondida_en_un_libro_</strong>. Debate en directo por Instagram y tertulia presencial.
            </p>
            <span className="actividad-perk">✨ Ejemplar del club con descuento</span>
          </div>

          {/* Actividad 2: Gimcana Literaria */}
          <div className="actividad-card">
            <div className="actividad-badge">Especial Jerez</div>
            <div className="actividad-icon">🗺️</div>
            <h3>Gimcana: "Libros Escondidos en Jerez"</h3>
            <p>
              ¡Búsqueda del tesoro literaria! Escondemos libros de ocasión precintados en plazas y rincones bonitos de Jerez con pistas en Stories. ¡Quien lo encuentra se lo queda!
            </p>
            <span className="actividad-perk">🎁 Libros gratis con pistas en redes</span>
          </div>

          {/* Actividad 3: Cita a Ciegas con un Libro */}
          <div className="actividad-card">
            <div className="actividad-badge">Muy Popular</div>
            <div className="actividad-icon">💌</div>
            <h3>Cita a Ciegas con un Libro</h3>
            <p>
              Libros sorpresa envueltos en papel kraft con cuerda de yute y pistas misteriosas escritas a mano. ¡Déjate sorprender por tu próxima gran historia sin juzgar la portada!
            </p>
            <span className="actividad-perk">🤫 Pistas temáticas y marcapáginas</span>
          </div>

          {/* Actividad 4: Cajas Literarias & Bookjournaling */}
          <div className="actividad-card">
            <div className="actividad-badge">Talleres & Regalo</div>
            <div className="actividad-icon">☕</div>
            <h3>Cajas Literarias &amp; Bookjournaling</h3>
            <p>
              Packs regalo que combinan un libro de ocasión escogido según tus gustos, marcapáginas artesanal y detalles cuquis para tu diario de lectura.
            </p>
            <span className="actividad-perk">📦 El regalo perfecto para lectores</span>
          </div>
        </div>

        {/* Banner de llamada a Instagram */}
        <div className="mt-10 p-6 rounded-2xl bg-[var(--rose-tint)] border border-[var(--rose-pale)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--rose-deep)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
              ✨
            </div>
            <div>
              <strong style={{ display: "block", color: "var(--charcoal-soft)", fontSize: ".95rem" }}>
                ¿Quieres participar en la próxima lectura conjunta o gimcana?
              </strong>
              <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>
                Publicamos todas las fechas y pistas en el perfil oficial de Instagram <strong>@escondida_en_un_libro_</strong>
              </span>
            </div>
          </div>
          <a
            href="https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg=="
            target="_blank"
            rel="noopener noreferrer"
            className="used-book-button sm:w-auto shrink-0"
            style={{ padding: "10px 22px", fontSize: ".85rem" }}
          >
            Seguir @escondida_en_un_libro_
          </a>
        </div>
      </section>

<section className="benefits-band">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow">COMPRAR CON SENTIDO</p>
          <h2>Una buena historia merece más de una oportunidad.</h2>
          <div className="benefit-grid">
            <Benefit
              icon={<Check size={20} />}
              title="Estado claro"
              text="Cada ejemplar se revisa y se describe con honestidad, sin sorpresas."
            />
            <Benefit
              icon={<Heart size={20} />}
              title="Consumo consciente"
              text="Alargar la vida de un libro evita que se desperdicie y reduce tu huella."
            />
            <Benefit
              icon={<Truck size={20} />}
              title="Envíos agrupados"
              text="Reúne varios libros en un solo envío y ahorra en gastos de transporte."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INSTAGRAM BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="instagram-banner mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div>
          <p className="eyebrow">LA LIBRERÍA TAMBIÉN SE VE</p>
          <h2>Videorreseñas, novedades y lecturas compartidas.</h2>
          <p>
            Síguenos en Instagram para descubrir lo que acaba de llegar a la
            estantería.
          </p>
        </div>
        <a
          className="instagram-button"
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramMark /> Seguir en Instagram
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

/* ── Subcomponents ──────────────────────────────────────────────── */

function BookGrid({
  books,
  onAdd,
}: {
  books: StoreBook[];
  onAdd: (book: StoreBook) => void;
}) {
  if (!books.length) {
    return (
      <p className="empty-state" style={{ padding: "48px 0" }}>
        No se encontraron libros con esos filtros.
      </p>
    );
  }
  return (
    <div className="book-grid">
      {books.map((book, index) => (
        <article className="book-card" key={book.id}>
          <Link href={`/libros/${book.slug}`} className="book-cover" aria-label={`Ver ${book.title}`}>
            <Image
              src={book.imageUrl ?? "/images/libro-ejemplo.jpg"}
              alt={book.imageAlt ?? "Portada de libro"}
              width={300}
              height={450}
              priority={index === 0}
              unoptimized
              className="book-cover-image"
            />
            <span className="status-badge">
              {conditionLabels[book.condition]}
            </span>
            <button
              className="quick-add"
              aria-label={`Añadir ${book.title} al carrito`}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(book); }}
            >
              <ShoppingBag size={16} />
            </button>
          </Link>
          <div className="book-info">
            <p className="book-author">{book.author}</p>
            <h3>
              <Link href={`/libros/${book.slug}`}>{book.title}</Link>
            </h3>
            <div className="flex items-center justify-between">
              <strong>{book.price.toFixed(2).replace(".", ",")} EUR</strong>
              <button className="add-link" onClick={() => onAdd(book)}>
                Añadir <ChevronDown size={13} />
              </button>
            </div>
            {book.amazonAffiliateUrl && (
              <a
                className="card-amazon-link"
                href={book.amazonAffiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Comprar en Amazon ↗
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function HeroFeature({
  book,
  onAdd,
}: {
  book?: StoreBook;
  onAdd: (book: StoreBook) => void;
}) {
  return (
    <div className="hero-feature soft-dots">
      <img
        src="/hero-banner.jpg"
        alt="Mesa cálida con libros y un café"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85";
        }}
      />
      <span className="hero-badge">Novedades de la semana</span>
      <div className="hero-feature-copy">
        {book ? (
          <>
            <p className="eyebrow">LIBRO RECOMENDADO</p>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <button onClick={() => onAdd(book)}>
              Ver ejemplar · {book.price.toFixed(2).replace(".", ",")} EUR{" "}
              <ShoppingBag size={14} />
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">PRÓXIMAMENTE</p>
            <h2>Nuevas lecturas en camino</h2>
          </>
        )}
      </div>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="benefit">
      <div className="benefit-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function InstagramMark() {
  return (
    <svg
      aria-hidden="true"
      className="instagram-mark"
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