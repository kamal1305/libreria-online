"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Portada elegante generada cuando el libro no tiene imagen de portada.
   Detecta también el "pixel en blanco" de 1x1 que devuelve Open Library
   cuando no existe portada para un ISBN. */

const PALETTES = [
  { bg: "#4F6352", bg2: "#3d4f40", accent: "#EBF1EC", text: "#FAF7F2" },
  { bg: "#D47B84", bg2: "#b25f68", accent: "#F7DDD9", text: "#FAF7F2" },
  { bg: "#3C3733", bg2: "#2b2724", accent: "#DFCCB2", text: "#FAF7F2" },
  { bg: "#6E8270", bg2: "#57685a", accent: "#EBF1EC", text: "#FAF7F2" },
  { bg: "#BD646D", bg2: "#9c4f57", accent: "#F7DDD9", text: "#FAF7F2" },
  { bg: "#8FA491", bg2: "#71866f", accent: "#4F6352", text: "#FAF7F2" },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Props = {
  title: string;
  author: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  width?: number;
  height?: number;
  imgClassName?: string;
  eager?: boolean;
};

export function BookCover({
  title,
  author,
  imageUrl,
  imageAlt,
  width = 300,
  height = 450,
  imgClassName,
  eager = false,
}: Props) {
  const [failed, setFailed] = useState(!imageUrl);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const pal = PALETTES[hashStr(title || "libro") % PALETTES.length];

  const checkBlank = (img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth <= 2 && img.naturalHeight <= 2) setFailed(true);
    else if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  };
  useEffect(() => {
    if (!failed) checkBlank(imgRef.current);
  }, [failed]);

  if (!failed && imageUrl) {
    return (
      <Image
        ref={imgRef}
        src={imageUrl}
        alt={imageAlt ?? `Portada de ${title}`}
        width={width}
        height={height}
        unoptimized
        priority={eager}
        className={imgClassName}
        onError={() => setFailed(true)}
        onLoad={(e) => checkBlank(e.currentTarget)}
      />
    );
  }

  return (
    <div
      className="book-placeholder"
      role="img"
      aria-label={`Portada de ${title}, de ${author}`}
      style={{
        background: `linear-gradient(150deg, ${pal.bg} 0%, ${pal.bg2} 100%)`,
        color: pal.text,
      }}
    >
      <span className="book-placeholder-frame" style={{ borderColor: pal.accent }} aria-hidden="true" />
      <span className="book-placeholder-mark" style={{ color: pal.accent }} aria-hidden="true">
        ❦
      </span>
      <span className="book-placeholder-title">{title}</span>
      <span className="book-placeholder-author" style={{ color: pal.accent }}>
        {author}
      </span>
      <span className="book-placeholder-brand" style={{ color: pal.accent }}>
        Más que libros · Jerez
      </span>
    </div>
  );
}
