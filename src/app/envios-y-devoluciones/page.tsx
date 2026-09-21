import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, HelpCircle, MessageCircle, Package, RefreshCw, ShieldCheck, Truck } from "lucide-react";

export const metadata = {
  title: "Envíos, Entregas y Devoluciones | Más que libros · Páginas y café",
  description:
    "Información transparente sobre gastos de envío, recogida gratis en Jerez, plazos de entrega y 14 días de devolución garantizada.",
};

export default function EnviosPage() {
  const whatsappUrl =
    "https://wa.me/34657053233?text=Hola%2C%20tengo%20una%20duda%20sobre%20los%20env%C3%ADos%20o%20devoluciones%20de%20M%C3%A1s%20que%20libros%20%F0%9F%93%A6";

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

      {/* Hero Banner */}
      <section
        className="border-b px-5 py-14 lg:px-8"
        style={{ background: "linear-gradient(180deg, var(--cream) 0%, var(--paper) 100%)", borderColor: "var(--line)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <span
            className="inline-block text-xs uppercase tracking-widest font-extrabold px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(110, 130, 112, 0.15)", color: "var(--sage-deep)" }}
          >
            TRANSPARENCIA & CONFIANZA
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
            Política de Envíos, Entregas y Devoluciones
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
            Tratamos cada libro como una pequeña joya. Embalaje protegido y ecológico, recogida gratuita en Jerez y todas las garantías de la Ley de Consumo.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-5 pt-12 lg:px-8 space-y-12">
        {/* Envíos */}
        <section
          id="envios"
          className="rounded-3xl p-8 border"
          style={{ background: "var(--cream)", borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "var(--sage)" }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--charcoal-soft)",
                  margin: 0,
                }}
              >
                1. Opciones de Envío y Tarifas
              </h2>
              <p style={{ margin: 0, fontSize: ".85rem", color: "var(--muted)" }}>
                Envíos rápidos a toda España peninsular y entrega en mano
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Opción 1: Jerez */}
            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--paper)", borderColor: "var(--line-soft)" }}
            >
              <span className="text-2xl mb-2 block">☕</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 4px" }}>
                Recogida en Jerez
              </h3>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--sage-deep)", margin: "0 0 8px" }}>
                GRATIS
              </p>
              <p style={{ fontSize: ".82rem", color: "var(--text)", margin: 0, lineHeight: 1.5 }}>
                Acordamos día y punto de encuentro céntrico en Jerez de la Frontera por WhatsApp. ¡Sin esperas ni gastos!
              </p>
            </div>

            {/* Opción 2: Estándar Peninsular */}
            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--paper)", borderColor: "var(--line-soft)" }}
            >
              <span className="text-2xl mb-2 block">📦</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 4px" }}>
                Envío Peninsular
              </h3>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
                3,95 €
              </p>
              <p style={{ fontSize: ".82rem", color: "var(--text)", margin: 0, lineHeight: 1.5 }}>
                Tarifa plana para España peninsular. Embalaje acolchado para proteger esquinas y lomos durante el transporte.
              </p>
            </div>

            {/* Opción 3: Gratis +30€ */}
            <div
              className="p-5 rounded-2xl border relative overflow-hidden"
              style={{ background: "var(--paper)", borderColor: "var(--rose)" }}
            >
              <span
                className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: "var(--rose)", color: "#fff" }}
              >
                PROMO
              </span>
              <span className="text-2xl mb-2 block">✨</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 4px" }}>
                Envío GRATUITO
              </h3>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--rose-deep)", margin: "0 0 8px" }}>
                A partir de 30 €
              </p>
              <p style={{ fontSize: ".82rem", color: "var(--text)", margin: 0, lineHeight: 1.5 }}>
                Llévate 3 o 4 libros y los gastos de transporte corren por nuestra cuenta a cualquier punto de la Península.
              </p>
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border flex items-start gap-4"
            style={{ background: "rgba(223, 204, 178, 0.25)", borderColor: "var(--latte)" }}
          >
            <Clock size={22} className="text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h4 style={{ margin: "0 0 4px", fontSize: ".95rem", fontWeight: 700, color: "var(--charcoal-soft)" }}>
                Plazos de entrega
              </h4>
              <p style={{ margin: 0, fontSize: ".85rem", color: "var(--text)", lineHeight: 1.5 }}>
                Preparamos y protegemos tu paquete en un plazo de <strong>24 horas hábiles</strong>. El plazo de transporte habitual en península es de <strong>24 a 48 horas laborables</strong> con número de seguimiento para que sepas en todo momento dónde viaja tu lectura.
              </p>
            </div>
          </div>
        </section>

        {/* Devoluciones y Desistimiento */}
        <section
          id="devoluciones"
          className="rounded-3xl p-8 border"
          style={{ background: "var(--cream)", borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "var(--rose-deep)" }}
            >
              <RefreshCw size={24} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--charcoal-soft)",
                  margin: 0,
                }}
              >
                2. Devoluciones y Garantía de Consumo
              </h2>
              <p style={{ margin: 0, fontSize: ".85rem", color: "var(--muted)" }}>
                Derecho de desistimiento legal (14 días naturales) y compromiso de satisfacción
              </p>
            </div>
          </div>

          <div className="space-y-5 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--paper)", borderColor: "var(--line-soft)" }}
            >
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 6px" }}>
                🛡️ Derecho legal de desistimiento (14 días naturales)
              </h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Conforme al <strong>Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios)</strong>, tienes derecho a desistir de tu compra en un plazo de <strong>14 días naturales</strong> desde la fecha en que recibes tus libros, sin necesidad de justificar ningún motivo y sin penalización.
              </p>
            </div>

            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--paper)", borderColor: "var(--line-soft)" }}
            >
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 6px" }}>
                📖 Nuestra Garantía de Estado en Libros de Ocasión
              </h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Sabemos que comprar libros de segunda mano por internet requiere confianza. Por eso revisamos minuciosamente cada ejemplar y lo catalogamos de forma fidedigna (<em>Como nuevo</em>, <em>Muy buen estado</em>, <em>Buen estado</em>). Si al recibirlo consideras que su estado difiere notablemente del descrito, <strong>asumimos nosotros los gastos de devolución y te reembolsamos el 100% de lo pagado</strong> o te enviamos otro libro que elijas.
              </p>
            </div>

            <div
              className="p-5 rounded-2xl border"
              style={{ background: "var(--paper)", borderColor: "var(--line-soft)" }}
            >
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 6px" }}>
                💬 ¿Cómo tramitar una devolución?
              </h3>
              <ol className="list-decimal pl-5 space-y-2 mt-2" style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
                <li>Envíanos un mensaje por WhatsApp al <strong>657 05 32 33</strong> o email a <strong>info@masquelibros.es</strong> indicando el título del libro o tu número de pedido.</li>
                <li>Empaqueta el libro protegiéndolo adecuadamente para que no sufra daños en el transporte de regreso.</li>
                <li>Una vez recibido en nuestro almacén y comprobado su estado, realizamos el <strong>reembolso íntegro inmediato</strong> por Bizum o transferencia bancaria en menos de 24-48 horas.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Preguntas Frecuentes */}
        <section
          className="rounded-3xl p-8 border"
          style={{ background: "var(--cream)", borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={24} style={{ color: "var(--sage-deep)" }} />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--charcoal-soft)",
                margin: 0,
              }}
            >
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-4 text-sm" style={{ color: "var(--text)" }}>
            <div>
              <strong className="block text-base mb-1" style={{ color: "var(--charcoal-soft)" }}>
                ¿Puedo pedir fotos adicionales del libro antes de comprarlo?
              </strong>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
                ¡Por supuesto! Es una de nuestras ventajas como librería cercana e independiente. Escríbenos por WhatsApp y te enviamos fotos reales del lomo, las esquinas o la portada al momento.
              </p>
            </div>
            <div>
              <strong className="block text-base mb-1" style={{ color: "var(--charcoal-soft)" }}>
                ¿Los libros vienen con dedicatoria o marcapáginas?
              </strong>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5 }}>
                Todos los pedidos incluyen un marcapáginas de regalo de <em>Más que libros · Páginas y café</em>. Además, si es para regalo, podemos incluir una nota personalizada escrita a mano con el texto que nos indiques.
              </p>
            </div>
          </div>
        </section>

        {/* WhatsApp Card */}
        <div
          className="rounded-3xl p-8 text-center border"
          style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5EBE1 100%)", borderColor: "var(--line)" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--charcoal-soft)",
              margin: "0 0 8px",
            }}
          >
            ¿Tienes alguna duda sobre tu pedido?
          </h3>
          <p style={{ fontSize: ".9rem", color: "var(--muted)", maxWidth: 500, margin: "0 auto 20px" }}>
            Escríbenos directamente por WhatsApp. Te respondemos de persona a persona con rapidez y cercanía.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vender-cta-btn inline-flex"
            style={{ textDecoration: "none" }}
          >
            <MessageCircle size={18} />
            <span>Consultar por WhatsApp (+34 657 05 32 33)</span>
          </a>
        </div>
      </div>
    </main>
  );
}
