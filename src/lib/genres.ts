import {
  BookMarked,
  BookOpen,
  Brain,
  Fingerprint,
  Heart,
  Landmark,
  LayoutGrid,
  Backpack,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const MACRO_CATEGORIES = [
  "Todos",
  "Novela negra & Thriller",
  "Novela histórica",
  "Romántica & Pasión",
  "Juvenil & Infantil",
  "Clásicos & Teatro",
  "Narrativa & Ficción",
  "Crecimiento & Ensayo",
] as const;

export type MacroCategory = (typeof MACRO_CATEGORIES)[number];

export const CATEGORY_ICONS: Record<MacroCategory, LucideIcon> = {
  "Todos": LayoutGrid,
  "Novela negra & Thriller": Fingerprint,
  "Novela histórica": Landmark,
  "Romántica & Pasión": Heart,
  "Juvenil & Infantil": Backpack,
  "Clásicos & Teatro": BookMarked,
  "Narrativa & Ficción": BookOpen,
  "Crecimiento & Ensayo": Sparkles,
};

export const CATEGORY_SHORT_NAMES: Record<MacroCategory, string> = {
  "Todos": "Todos",
  "Novela negra & Thriller": "Novela negra",
  "Novela histórica": "Histórica",
  "Romántica & Pasión": "Romántica",
  "Juvenil & Infantil": "Juvenil",
  "Clásicos & Teatro": "Clásicos",
  "Narrativa & Ficción": "Narrativa",
  "Crecimiento & Ensayo": "Crecimiento",
};

/**
 * Normaliza y clasifica cualquier etiqueta de género libre o subcategoría
 * a una de las 7 familias macro de la librería.
 */
export function getMacroCategory(rawGenre: string): MacroCategory {
  const g = (rawGenre || "").toLowerCase();

  // 1. Novela negra, policiaca, suspense, espionaje, thriller
  if (/negra|thriller|policiaco|policíaco|misterio|suspense|espionaje|terror/.test(g)) {
    return "Novela negra & Thriller";
  }

  // 2. Novela histórica, crónica, biografías, época, II Guerra Mundial
  if (/históric|historic|biograf|segunda guerra|historia/.test(g)) {
    return "Novela histórica";
  }

  // 3. Romántica, amor, gótica pasional, comedia romántica
  if (/romántic|romantic|erótic|erotic|gótica|gotica/.test(g)) {
    return "Romántica & Pasión";
  }

  // 4. Juvenil, infantil, cuentos para jóvenes, aventuras
  if (/juvenil|infantil|aventura/.test(g)) {
    return "Juvenil & Infantil";
  }

  // 5. Clásicos universales, sátira clásica, teatro
  if (/clásic|clasic|teatro|sátira|satira/.test(g)) {
    return "Clásicos & Teatro";
  }

  // 6. Ensayo, autoayuda, crecimiento personal, divulgación, filosofía
  if (/autoayuda|crecimiento|desarrollo|liderazgo|ensayo|filosof|econom|medicina|pensamiento|polític/.test(g)) {
    return "Crecimiento & Ensayo";
  }

  // 7. Por defecto: Narrativa y ficción general
  return "Narrativa & Ficción";
}

/**
 * Comprueba si un libro pertenece a la categoría seleccionada por el usuario.
 */
export function matchesCategory(rawGenre: string, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === "Todos") return true;
  return getMacroCategory(rawGenre) === selectedCategory;
}
