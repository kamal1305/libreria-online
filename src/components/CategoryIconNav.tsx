"use client";

import {
  Baby,
  Backpack,
  BookMarked,
  BookOpen,
  BookText,
  Brain,
  Compass,
  Feather,
  Fingerprint,
  Gem,
  Ghost,
  Heart,
  Landmark,
  LayoutGrid,
  Rocket,
  Scroll,
  Smile,
  Trophy,
  Users,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genreIcons: Record<string, LucideIcon> = {
  Todos: LayoutGrid,
  "Novela negra": Fingerprint,
  Novela: BookOpen,
  Narrativa: BookOpen,
  Romance: Heart,
  "Novela romántica": Heart,
  Juvenil: Backpack,
  Terror: Ghost,
  Misterio: Ghost,
  Clásicos: BookMarked,
  Humor: Smile,
  Fantasía: Wand2,
  "Novela histórica": Landmark,
  "Novela Histórica": Landmark,
  Historia: Landmark,
  "No ficción": Scroll,
  "Ciencia ficción": Rocket,
  Pensamiento: Brain,
  Ensayo: Brain,
  Poesía: Feather,
  "Joyas Literarias": Gem,
  Infantil: Baby,
  Biografías: Users,
  Viajes: Compass,
  Cocina: BookText,
  Deporte: Trophy,
};

export function CategoryIconNav({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  const handleSelect = (name: string) => {
    onSelectCategory(name);
    document
      .getElementById("catalogo")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="generos" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="section-header">
        <div>
          <p className="eyebrow">ENCUENTRA TU PRÓXIMA HISTORIA</p>
          <h2>Explora por género</h2>
        </div>
        <span className="result-count">{categories.length} géneros</span>
      </div>
      <div className="category-grid">
        {categories.map((name) => {
          const Icon = genreIcons[name] ?? BookOpen;
          const active = name === activeCategory;
          return (
            <button
              type="button"
              className={`category-tile group${active ? " active" : ""}`}
              key={name}
              onClick={() => handleSelect(name)}
              aria-pressed={active}
            >
              <span className="category-tile-icon">
                <Icon
                  className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
                  strokeWidth={1.75}
                />
              </span>
              <strong>{name}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
