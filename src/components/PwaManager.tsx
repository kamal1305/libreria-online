"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share, X, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidBanner, setShowAndroidBanner] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Registrar Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker registrado con éxito:", reg.scope))
        .catch((err) => console.log("Service Worker registro error:", err));
    }

    // 2. Comprobar si ya está instalado o silenciado
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Comprobar si ya corre como standalone app
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return; // Ya está instalada
    }

    // 3. Capturar evento de instalación en Android / Chrome / Edge
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mostrar tras 3 segundos de navegación para no ser intrusivo
      setTimeout(() => setShowAndroidBanner(true), 3500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 4. Detectar iOS (Safari en iPhone / iPad)
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;

    if (isIos && !isStandalone) {
      // Mostrar sugerencia discreta para iPhone tras 5 segundos
      setTimeout(() => setShowIosPrompt(true), 5000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowAndroidBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowAndroidBanner(false);
    setShowIosPrompt(false);
    setIsDismissed(true);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <>
      {/* Banner Android / Chrome / PC */}
      {showAndroidBanner && (
        <div className="pwa-install-banner fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50">
          <div
            className="flex items-center gap-3.5 p-4 rounded-2xl shadow-xl border"
            style={{
              background: "var(--cream)",
              borderColor: "var(--rose)",
              boxShadow: "0 12px 36px rgba(60, 55, 51, 0.2)",
            }}
          >
            <Image
              src="/logo.jpg"
              alt="Logo Más que libros"
              width={46}
              height={46}
              className="rounded-full shadow-sm shrink-0"
              style={{ borderRadius: "50%" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <strong style={{ fontSize: ".88rem", color: "var(--charcoal-soft)" }}>
                  Más que libros App
                </strong>
                <span style={{ fontSize: ".65rem", background: "var(--rose)", color: "#fff", padding: "1px 6px", borderRadius: "9999px", fontWeight: 700 }}>
                  App Móvil
                </span>
              </div>
              <p style={{ margin: 0, fontSize: ".74rem", color: "var(--muted)", lineHeight: 1.3 }}>
                Instala la web en tu pantalla de inicio como una aplicación para abrirla al instante.
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white transition-transform active:scale-95"
                  style={{ background: "var(--sage)" }}
                >
                  <Download size={13} /> Instalar Gratis
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1"
                >
                  Ahora no
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Cerrar aviso"
              className="text-stone-400 hover:text-stone-700 p-1 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Banner iOS / Safari (iPhone) */}
      {showIosPrompt && (
        <div className="pwa-install-banner fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50">
          <div
            className="flex items-start gap-3 p-4 rounded-2xl shadow-xl border"
            style={{
              background: "var(--cream)",
              borderColor: "var(--line)",
              boxShadow: "0 12px 36px rgba(60, 55, 51, 0.2)",
            }}
          >
            <Image
              src="/logo.jpg"
              alt="Logo Más que libros"
              width={42}
              height={42}
              className="rounded-full shadow-sm shrink-0"
              style={{ borderRadius: "50%" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <strong style={{ fontSize: ".86rem", color: "var(--charcoal-soft)" }}>
                  ¿Llevar la librería en tu iPhone? 📲
                </strong>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: ".74rem", color: "var(--text)", lineHeight: 1.4 }}>
                Pulsa el botón <strong>Compartir <Share size={12} className="inline mx-0.5" /></strong> abajo en Safari y luego elige <strong>&quot;Añadir a pantalla de inicio&quot; ➕</strong>.
              </p>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-[11px] font-bold text-stone-600 hover:text-stone-900"
              >
                Entendido
              </button>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Cerrar aviso"
              className="text-stone-400 hover:text-stone-700 p-1 shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
