import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, Shield, UserCheck, Eye, Database, FileText } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad y Protección de Datos | Más que libros · Páginas y café",
  description:
    "Información sobre la privacidad y protección de datos conforme al RGPD y la LOPDGDD en Más que libros · Páginas y café (Jerez).",
};

export default function PrivacidadPage() {
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
            RGPD & LOPDGDD
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
            Política de Privacidad y Cookies
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
            En Más que libros respetamos al 100% tu privacidad. Tratamos tus datos de forma transparente, segura y únicamente para hacerte llegar tus libros.
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
              1. Responsable del Tratamiento
            </h2>
            <p style={{ margin: 0 }}>
              El responsable del tratamiento de los datos recabados en este sitio web es <strong>Más que libros · Páginas y café</strong> (proyecto cultural y comercial asociado a la comunidad literaria <em>@escondida_en_un_libro_</em>), con domicilio en <strong>Jerez de la Frontera (Cádiz, España)</strong>. Teléfono / WhatsApp de atención: <strong>+34 657 05 32 33</strong>. Correo electrónico de contacto: <strong>info@masquelibros.es</strong>.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              2. ¿Qué datos recopilamos y con qué finalidad?
            </h2>
            <p style={{ margin: "0 0 8px" }}>
              En cumplimiento del <strong>Reglamento General de Protección de Datos (RGPD UE 2016/679)</strong> y de la <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong>, te informamos de que los datos facilitados a través de nuestros canales se utilizan para:
            </p>
            <ul className="list-disc pl-5 space-y-2" style={{ paddingLeft: "20px" }}>
              <li><strong>Gestión de pedidos y envíos:</strong> Nombre, teléfono, dirección postal para empaquetar y entregar los libros adquiridos.</li>
              <li><strong>Atención al cliente personalizada:</strong> Comunicarnos contigo vía WhatsApp o email para resolver dudas sobre el estado de un libro o acordar la recogida local gratuita en Jerez.</li>
              <li><strong>Valoración y compra de libros usados:</strong> Datos necesarios para acordar la tasación y el pago por Bizum o transferencia en la sección de compra de libros.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              3. Cesión y conservación de datos
            </h2>
            <p style={{ margin: 0 }}>
              <strong>No vendemos ni cedemos jamás tus datos personales a empresas publicitarias o terceros.</strong> Únicamente se comunican los datos estrictamente necesarios a la empresa de mensajería para efectuar la entrega física del paquete. Los datos se conservarán durante el tiempo necesario para cumplir las obligaciones legales y tributarias derivadas de la venta.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              4. Tus Derechos (Acceso, Rectificación, Supresión)
            </h2>
            <p style={{ margin: "0 0 8px" }}>
              Puedes ejercer en cualquier momento tus derechos de <strong>acceso, rectificación, supresión (&quot;derecho al olvido&quot;), limitación del tratamiento, portabilidad y oposición</strong>.
            </p>
            <p style={{ margin: 0 }}>
              Para ello solo tienes que escribirnos un mensaje por WhatsApp al <strong>657 05 32 33</strong> o enviarnos un email a <strong>info@masquelibros.es</strong> indicando tu solicitud. Te responderemos en un plazo máximo de 48 horas.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--charcoal-soft)", margin: "0 0 8px" }}>
              5. Política de Cookies y Almacenamiento Local
            </h2>
            <p style={{ margin: 0 }}>
              Este sitio web utiliza <strong>únicamente almacenamiento técnico imprescindible</strong> (almacenamiento local del navegador) para mantener los libros que añades a tu cesta de compra mientras navegas por la tienda. <strong>No utilizamos cookies de seguimiento publicitario invasivo ni transferencias internacionales de datos sin consentimiento.</strong>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
