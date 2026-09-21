import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Check, FileCheck, HelpCircle, MessageCircle, Scale, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Términos y Condiciones Generales | Más que libros · Páginas y café",
  description:
    "Aviso legal y condiciones generales de compraventa de libros de ocasión y tasación en Más que libros · Páginas y café (Jerez).",
};

export default function CondicionesPage() {
  return (
    <main
      className="min-h-screen bg-[var(--paper)] text-[var(--text)] pb-24"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Header */}
      <header
        className="mx-auto flex max-w-7xl items-center justify-between border-b px-5 py-5 lg:px-8"
        style={{ borderColor: "var(--line)", background: "var(--cream)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-decoration-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, textDecoration: "none" }}
        >
          <Image
            src="/logo.jpg"
            alt="Logo Más que libros"
            width={38}
            height={38}
            className="rounded-full"
            style={{ borderRadius: "50%" }}
          />
          <span style={{ color: "var(--charcoal-soft)" }}>
            Más que libros <span style={{ color: "var(--rose-deep)", fontSize: ".85rem", fontWeight: 400 }}>· Páginas y café</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--rose-deep)", textDecoration: "none" }}
        >
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>
      </header>

      {/* Hero */}
      <section
        className="border-b px-5 py-14 lg:px-8"
        style={{ background: "linear-gradient(180deg, var(--cream) 0%, var(--paper) 100%)", borderColor: "var(--line)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <span
            className="inline-block text-xs uppercase tracking-widest font-extrabold px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(110, 130, 112, 0.15)", color: "var(--sage-deep)" }}
          >
            AVISO LEGAL & CONTRATACIÓN
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--charcoal-soft)",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Términos y Condiciones Generales
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
            Bases contractuales de compra, venta de libros usados a particulares, métodos de pago y marco normativo español.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-5 pt-12 lg:px-8 space-y-8">
        <section
          className="rounded-3xl p-8 border space-y-6 text-sm leading-relaxed"
          style={{ background: "var(--cream)", borderColor: "var(--line)", color: "var(--text)" }}
        >
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              1. Titularidad del Sitio Web
            </h2>
            <p style={{ margin: 0 }}>
              El presente sitio web corresponde a la actividad comercial y cultural de <strong>Más que libros · Páginas y café</strong>, librería online de ocasión y futuro espacio físico en <strong>Jerez de la Frontera (Cádiz, España)</strong>, vinculada a la comunidad de divulgación literaria <em>@escondida_en_un_libro_</em>. Contacto: <strong>+34 657 05 32 33</strong> / <strong>info@masquelibros.es</strong>.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              2. Naturaleza de los Productos (Libros de Ocasión)
            </h2>
            <p style={{ margin: "0 0 8px" }}>
              Los libros ofrecidos en nuestro catálogo son en su mayoría ejemplares de <strong>segunda mano y ocasión cuidadosamente seleccionados</strong>, catalogados en los siguientes estados:
            </p>
            <ul className="list-disc pl-5 space-y-1.5" style={{ paddingLeft: "20px" }}>
              <li><strong>Como nuevo:</strong> Ejemplar impecable, prácticamente sin signos de lectura ni marcas en el lomo.</li>
              <li><strong>Muy buen estado:</strong> Ejemplar en óptimas condiciones, con leve roce natural de estantería pero páginas y encuadernación perfectas.</li>
              <li><strong>Buen estado:</strong> Ejemplar íntegro, sólido y perfectamente legible, que puede presentar señales normales de haber sido disfrutado con cariño.</li>
            </ul>
            <p style={{ margin: "8px 0 0" }}>
              Al tratarse generalmente de ejemplares únicos por título, los pedidos se atienden por estricto orden de confirmación.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              3. Precios y Formas de Pago
            </h2>
            <p style={{ margin: "0 0 8px" }}>
              Todos los precios se indican en euros (€) e incluyen los impuestos legalmente aplicables (IVA superreducido del 4% para libros en España).
            </p>
            <p style={{ margin: 0 }}>
              Los métodos de pago admitidos son: <strong>Bizum</strong> (pago instantáneo seguro con verificación directa por WhatsApp), <strong>transferencia bancaria</strong>, o <strong>pago en mano</strong> (disponible exclusivamente al optar por recogida local en Jerez).
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              4. Compra de Libros Usados a Particulares (&quot;Dales una segunda vida&quot;)
            </h2>
            <p style={{ margin: "0 0 8px" }}>
              Las personas interesadas en ceder o vender sus libros pueden enviar fotos de los lomos por WhatsApp al <strong>657 05 32 33</strong>. Tras examinar el estado y la demanda, emitimos una oferta de valoración:
            </p>
            <ul className="list-disc pl-5 space-y-1.5" style={{ paddingLeft: "20px" }}>
              <li><strong>Opción de cobro:</strong> Transferencia o Bizum inmediato tras recepción y verificación física.</li>
              <li><strong>Opción de saldo de tienda (+20% extra):</strong> Saldo digital acumulable para elegir cualquier otro libro del catálogo.</li>
            </ul>
            <p style={{ margin: "8px 0 0" }}>
              No se admiten libros con páginas faltantes, daños graves por humedad o encuadernaciones rotas irreparables.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              5. Legislación Aplicable y Resolución de Controversias
            </h2>
            <p style={{ margin: 0 }}>
              Las compraventas efectuadas se someten a la legislación del Reino de España y a la normativa comunitaria de protección a consumidores y usuarios. Asimismo, de conformidad con el Art. 14.1 del Reglamento (UE) 524/2013, se informa de que la Comisión Europea facilita una plataforma de resolución de litigios en línea en el enlace: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--rose-deep)", textDecoration: "underline" }}>https://ec.europa.eu/consumers/odr/</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
