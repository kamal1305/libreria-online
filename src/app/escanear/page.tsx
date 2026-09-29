"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Barcode,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  PlusCircle,
  ArrowLeft,
  Sparkles,
  History,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ScannedBook {
  isbn: string;
  sku: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  condition: string;
  synopsis?: string;
  coverUrl?: string | null;
  year?: number | null;
  publisher?: string | null;
}

const MACRO_GENRES = [
  "Novela y Narrativa",
  "Suspense y Misterio",
  "Historia y Ensayo",
  "Juvenil e Infantil",
  "Desarrollo y Filosofía",
  "Clásicos",
  "Otros",
];

const CONDITIONS = ["Bueno", "Muy bueno", "Como nuevo", "Aceptable"];

export default function EscanearPage() {
  const [isbnInput, setIsbnInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Datos del libro actual siendo procesado
  const [currentBook, setCurrentBook] = useState<ScannedBook | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Historial de la sesión actual
  const [sessionHistory, setSessionHistory] = useState<
    Array<{
      sku: string;
      title: string;
      author: string;
      price: number;
      time: string;
      coverUrl?: string | null;
    }>
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Mantener el foco en el input siempre para la pistola escáner
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentBook, saving]);

  // Sonido de pitido usando Web Audio API
  const playSound = (type: "beep" | "success" | "error") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "beep") {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } else if (type === "success") {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Ignorar si el navegador bloquea audio sin interacción previa
    }
  };

  // Buscar libro al enviar el ISBN (disparo de la pistola)
  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = isbnInput.replace(/[^0-9X]/gi, "").toUpperCase();
    if (!clean || clean.length < 10) {
      setStatusMessage({
        type: "error",
        text: "Por favor, introduce un ISBN válido (mínimo 10 dígitos).",
      });
      playSound("error");
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    setDuplicateWarning(null);
    playSound("beep");

    try {
      const res = await fetch("/api/scanner/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: clean }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "No se pudo consultar el ISBN");
      }

      if (data.duplicate?.exists) {
        setDuplicateWarning(data.duplicate);
      }

      setCurrentBook({
        isbn: clean,
        sku: data.nextSku || "SVL-PROX",
        title: data.title || "",
        author: data.author || "",
        genre: data.genre || "Novela y Narrativa",
        price: data.suggestedPrice || 7.0,
        condition: "Bueno",
        synopsis: data.description || "",
        coverUrl: data.coverUrl || null,
        year: data.year || null,
        publisher: data.publisher || null,
      });

      if (!data.found) {
        setStatusMessage({
          type: "info",
          text: "No se encontraron datos automáticos en la red. Rellena el título y autor manualmente.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Error al buscar los datos del libro.",
      });
      playSound("error");
    } finally {
      setLoading(false);
      setIsbnInput("");
    }
  };

  // Guardar ficha en Notion
  const handleSaveBook = async () => {
    if (!currentBook) return;
    if (!currentBook.title.trim()) {
      setStatusMessage({
        type: "error",
        text: "El título del libro es obligatorio.",
      });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/scanner/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBook),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Error al guardar en Notion");
      }

      playSound("success");
      setStatusMessage({
        type: "success",
        text: `¡Libro "${currentBook.title}" guardado en Notion con SKU ${currentBook.sku}!`,
      });

      // Añadir al historial local de la sesión
      setSessionHistory((prev) => [
        {
          sku: currentBook.sku,
          title: currentBook.title,
          author: currentBook.author,
          price: currentBook.price,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          coverUrl: currentBook.coverUrl,
        },
        ...prev,
      ]);

      // Limpiar libro actual y reenfocar input
      setCurrentBook(null);
      setDuplicateWarning(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Error al guardar el ejemplar en Notion.",
      });
      playSound("error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentBook(null);
    setDuplicateWarning(null);
    setStatusMessage(null);
    setIsbnInput("");
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream-bg, #FAF7F2)",
        color: "var(--charcoal-dark, #231F20)",
        fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
        paddingBottom: "60px",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--rose-deep, #9E2A2B)",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              background: "rgba(158, 42, 43, 0.06)",
            }}
          >
            <ArrowLeft size={16} /> Tienda
          </Link>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#1C1917",
              }}
            >
              📚 Más que libros · Escáner de Inventario
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: "#78716C",
              }}
            >
              Conexión directa con Notion · Pistola lectora USB / Bluetooth
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
            style={{
              background: "transparent",
              border: "1px solid #E7E5E4",
              borderRadius: "8px",
              padding: "7px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.8rem",
              color: "#57534E",
            }}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={16} color="#059669" /> Sonido ON
              </>
            ) : (
              <>
                <VolumeX size={16} color="#78716C" /> Sonido OFF
              </>
            )}
          </button>

          <div
            style={{
              background: "#ECFDF5",
              color: "#065F46",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
              }}
            />
            Notion Conectado
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "860px",
          margin: "32px auto",
          padding: "0 20px",
        }}
      >
        {/* Scanner Input Card */}
        <section
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "28px",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: "12px",
            }}
          >
            <Barcode size={24} color="#9E2A2B" />
            <h2
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#1C1917",
              }}
            >
              Lector de Código de Barras (ISBN)
            </h2>
          </div>
          <p
            style={{
              margin: "0 0 18px 0",
              fontSize: "0.88rem",
              color: "#78716C",
            }}
          >
            Apunta con la pistola lectora a la contraportada del libro. El
            número se escribirá solo y buscará la ficha automáticamente.
          </p>

          <form
            onSubmit={handleScanSubmit}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={isbnInput}
              onChange={(e) => setIsbnInput(e.target.value)}
              placeholder="Escanea el código con la pistola o escribe el ISBN (ej: 9788420683146)..."
              disabled={loading}
              autoFocus
              style={{
                flex: 1,
                padding: "16px 20px",
                fontSize: "1.05rem",
                borderRadius: "12px",
                border: "2px solid #E7E5E4",
                outline: "none",
                background: "#FAFAF9",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#9E2A2B")}
              onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
            />
            <button
              type="submit"
              disabled={loading || !isbnInput.trim()}
              style={{
                padding: "0 28px",
                borderRadius: "12px",
                border: "none",
                background: loading
                  ? "#A8A29E"
                  : "var(--rose-deep, #9E2A2B)",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.2s ease",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Buscando...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Buscar
                </>
              )}
            </button>
          </form>

          {/* Mensajes de estado */}
          {statusMessage && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 18px",
                borderRadius: "10px",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background:
                  statusMessage.type === "success"
                    ? "#ECFDF5"
                    : statusMessage.type === "error"
                    ? "#FEF2F2"
                    : "#EFF6FF",
                color:
                  statusMessage.type === "success"
                    ? "#065F46"
                    : statusMessage.type === "error"
                    ? "#991B1B"
                    : "#1E40AF",
                border: `1px solid ${
                  statusMessage.type === "success"
                    ? "#A7F3D0"
                    : statusMessage.type === "error"
                    ? "#FECACA"
                    : "#BFDBFE"
                }`,
              }}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </section>

        {/* Alerta de libro duplicado */}
        {duplicateWarning && (
          <div
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              color: "#92400E",
            }}
          >
            <AlertTriangle size={20} color="#D97706" style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: "0.95rem" }}>
                ¡Aviso de ejemplar existente en Notion!
              </strong>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem" }}>
                Este ISBN ya está registrado como{" "}
                <strong>[{duplicateWarning.sku}]</strong> &quot;
                {duplicateWarning.title}&quot; (Estado:{" "}
                {duplicateWarning.estado}).
                <br />
                Puedes guardar este nuevo ejemplar con su propio SKU
                independiente o cancelar si no deseas duplicarlo.
              </p>
            </div>
          </div>
        )}

        {/* Ficha del libro escaneado (Si se ha detectado) */}
        {currentBook && (
          <section
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              padding: "32px",
              border: "2px solid rgba(158, 42, 43, 0.2)",
              boxShadow: "0 8px 30px rgba(158, 42, 43, 0.08)",
              marginBottom: "32px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #F5F5F4",
                paddingBottom: "18px",
                marginBottom: "24px",
              }}
            >
              <div>
                <span
                  style={{
                    background: "rgba(158, 42, 43, 0.1)",
                    color: "var(--rose-deep, #9E2A2B)",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Nuevo ejemplar detectado
                </span>
                <span
                  style={{
                    marginLeft: 10,
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#059669",
                  }}
                >
                  SKU asignado: {currentBook.sku}
                </span>
              </div>
              <button
                onClick={handleCancel}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#78716C",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Cancelar y escanear otro
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: "28px",
              }}
            >
              {/* Portada */}
              <div>
                <div
                  style={{
                    width: "160px",
                    height: "230px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#F5F5F4",
                    border: "1px solid #E7E5E4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {currentBook.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentBook.coverUrl}
                      alt={currentBook.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 12,
                        color: "#A8A29E",
                      }}
                    >
                      <BookOpen size={40} style={{ margin: "0 auto 8px" }} />
                      <span style={{ fontSize: "0.75rem", display: "block" }}>
                        Sin portada disponible
                      </span>
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#A8A29E",
                    textAlign: "center",
                    marginTop: 8,
                    fontFamily: "monospace",
                  }}
                >
                  ISBN: {currentBook.isbn}
                </p>
              </div>

              {/* Formulario de Confirmación Rápida */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Título */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#44403C",
                      marginBottom: 4,
                    }}
                  >
                    Título de la obra
                  </label>
                  <input
                    type="text"
                    value={currentBook.title}
                    onChange={(e) =>
                      setCurrentBook({ ...currentBook, title: e.target.value })
                    }
                    placeholder="Título del libro..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #D6D3D1",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#1C1917",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Autor y Año */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 14,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#44403C",
                        marginBottom: 4,
                      }}
                    >
                      Autor / Autora
                    </label>
                    <input
                      type="text"
                      value={currentBook.author}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          author: e.target.value,
                        })
                      }
                      placeholder="Nombre del autor..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #D6D3D1",
                        fontSize: "0.9rem",
                        color: "#1C1917",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#44403C",
                        marginBottom: 4,
                      }}
                    >
                      Año publicación
                    </label>
                    <input
                      type="number"
                      value={currentBook.year || ""}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          year: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      placeholder="Ej: 2018"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #D6D3D1",
                        fontSize: "0.9rem",
                        color: "#1C1917",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Género y Precio */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1fr",
                    gap: 14,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#44403C",
                        marginBottom: 4,
                      }}
                    >
                      Categoría / Género
                    </label>
                    <select
                      value={currentBook.genre}
                      onChange={(e) =>
                        setCurrentBook({ ...currentBook, genre: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #D6D3D1",
                        fontSize: "0.9rem",
                        background: "#FFFFFF",
                        color: "#1C1917",
                        fontWeight: 500,
                        boxSizing: "border-box",
                      }}
                    >
                      {MACRO_GENRES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#44403C",
                        marginBottom: 4,
                      }}
                    >
                      Precio de venta (€)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentBook.price}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "2px solid #059669",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#065F46",
                        background: "#F0FDF4",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                {/* Estado físico */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#44403C",
                      marginBottom: 6,
                    }}
                  >
                    Estado de conservación
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {CONDITIONS.map((cond) => {
                      const isActive = currentBook.condition === cond;
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() =>
                            setCurrentBook({ ...currentBook, condition: cond })
                          }
                          style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "0.82rem",
                            fontWeight: isActive ? 700 : 500,
                            border: `1px solid ${
                              isActive ? "#9E2A2B" : "#E7E5E4"
                            }`,
                            background: isActive
                              ? "var(--rose-deep, #9E2A2B)"
                              : "#FAFAF9",
                            color: isActive ? "#FFFFFF" : "#57534E",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Guardado */}
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={handleSaveBook}
                    disabled={saving}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "none",
                      background: saving
                        ? "#A8A29E"
                        : "var(--rose-deep, #9E2A2B)",
                      color: "#FFFFFF",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      boxShadow: "0 4px 14px rgba(158, 42, 43, 0.25)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> Guardando
                        en Notion...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} /> Guardar en Notion (
                        {currentBook.sku})
                      </>
                    )}
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "0.75rem",
                      color: "#A8A29E",
                      marginTop: 8,
                    }}
                  >
                    💡 Pulsa este botón o la tecla Enter para registrar y volver
                    al escáner.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Historial de la sesión */}
        <section
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            padding: "24px 28px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <History size={18} color="#78716C" />
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1C1917",
                }}
              >
                Libros guardados en esta sesión
              </h3>
            </div>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#78716C",
                background: "#F5F5F4",
                padding: "3px 10px",
                borderRadius: "12px",
              }}
            >
              Total: {sessionHistory.length}
            </span>
          </div>

          {sessionHistory.length === 0 ? (
            <p
              style={{
                color: "#A8A29E",
                fontSize: "0.85rem",
                margin: 0,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Aún no has escaneado ningún libro en esta sesión. Pasa el primer
              código de barras arriba.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sessionHistory.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "#FAFAF9",
                    border: "1px solid #F5F5F4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 0,
                    }}
                  >
                    {item.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverUrl}
                        alt=""
                        style={{
                          width: 34,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 48,
                          background: "#E7E5E4",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BookOpen size={16} color="#A8A29E" />
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 700,
                          color: "#1C1917",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        [{item.sku}] {item.title}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#78716C" }}>
                        {item.author} · {item.price.toFixed(2)} €
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#A8A29E",
                      fontFamily: "monospace",
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
