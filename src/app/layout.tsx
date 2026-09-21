import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Más que libros · Páginas y café | Libros de ocasión y rincón lector",
  description:
    "Librería online de ocasión y rincón de café en Jerez de la Frontera. Libros usados escogidos con mimo, trato cercano por WhatsApp y envíos a toda la península.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${nunitoSans.variable}`}
    >
      <body className="min-h-full flex flex-col antialiased bg-[var(--paper)] text-[var(--text)]">
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
