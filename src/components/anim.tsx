"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Utilidades de animación estilo Arc UI, adaptadas a la estética editorial
   de Más que libros. Respetan prefers-reduced-motion. */

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Aparición al hacer scroll */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "span";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`mq-reveal${visible ? " mq-reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* Titular con entrada palabra por palabra */
export function WordReveal({ text, accent, className = "" }: { text: string; accent?: string; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (reducedMotion()) {
      setOn(true);
      return;
    }
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(t);
  }, []);
  const words = text.split(" ");
  const label = accent ? `${text} ${accent}` : text;
  return (
    <span className={`mq-words${on ? " mq-words-on" : ""} ${className}`} aria-label={label}>
      {words.map((w, i) => (
        <span key={i} className="mq-word" style={{ transitionDelay: `${i * 70}ms` }} aria-hidden="true">
          {w}
          {i < words.length - 1 || accent ? " " : ""}
        </span>
      ))}
      {accent && (
        <em className="mq-word" style={{ transitionDelay: `${words.length * 70}ms` }} aria-hidden="true">
          {accent}
        </em>
      )}
    </span>
  );
}

/* Contador animado */
export function CountUp({ to, suffix = "", duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reducedMotion()) {
        setVal(to);
        return;
      }
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (run(), obs.disconnect())),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
