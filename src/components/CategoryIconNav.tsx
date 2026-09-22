"use client";

import {
  BookHeart,
  BookMarked,
  BookOpen,
  BookText,
  Brain,
  Castle,
  Compass,
  Feather,
  Gem,
  Ghost,
  Heart,
  History,
  Landmark,
  Laugh,
  LayoutGrid,
  Microscope,
  Search,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genreIcons: Record<string, LucideIcon> = {
  Todos: LayoutGrid,
  "Novela romántica": Heart,
  Romance: Heart,
  "Novela negra": Search,
  "Novela Histórica": Landmark,
  Fantasía: Sparkles,
  "Ciencia ficción": Microscope,
  Historia: History,
  Clásicos: BookOpen,
  Infantil: BookHeart,
  Juvenil: Castle,
  Ensayo: Brain,
  "Joyas Literarias": Gem,
  Poesía: Feather,
  Pensamiento: Brain,
  Humor: Laugh,
  Terror: Ghost,
  "No ficción": BookMarked,
  Novela: BookOpen,
  Narrativa: BookOpen,
  Biografías: Users,
  Viajes: Compass,
  Cocina: BookText,
  Misterio: Ghost,
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
              className={`category-tile${active ? " active" : ""}`}
              key={name}
              onClick={() => handleSelect(name)}
              aria-pressed={active}
            >
              <span className="category-tile-icon">
                <Icon size={26} strokeWidth={2} />
              </span>
              <strong>{name}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
