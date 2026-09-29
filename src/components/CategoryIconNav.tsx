"use client";

import {
  MACRO_CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_SHORT_NAMES,
  type MacroCategory,
} from "@/lib/genres";

interface CategoryIconNavProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

export function CategoryIconNav({
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
}: CategoryIconNavProps) {
  const handleSelect = (name: string) => {
    onSelectCategory(name);
    document
      .getElementById("catalogo")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="generos" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="section-header">
        <div>
          <p className="eyebrow">SELECCIÓN EDITORIAL</p>
          <h2>Explora por temática</h2>
        </div>
        <span className="result-count">
          {activeCategory === "Todos"
            ? `${categoryCounts["Todos"] ?? 0} libros disponibles`
            : `${categoryCounts[activeCategory] ?? 0} libros`}
        </span>
      </div>

      <div className="category-grid">
        {MACRO_CATEGORIES.map((name) => {
          const Icon = CATEGORY_ICONS[name];
          const active = name === activeCategory;
          const count = categoryCounts[name];
          const shortName = CATEGORY_SHORT_NAMES[name];

          return (
            <button
              type="button"
              className={`category-tile group${active ? " active" : ""}`}
              key={name}
              onClick={() => handleSelect(name)}
              aria-pressed={active}
              title={`${name} (${count ?? 0} libros)`}
            >
              <span className="category-tile-icon">
                <Icon
                  className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
                  strokeWidth={1.8}
                />
              </span>

              {/* Nombre completo en tablets/escritorio, nombre corto en móvil */}
              <strong className="hidden sm:block">{name}</strong>
              <strong className="block sm:hidden">{shortName}</strong>

              {typeof count === "number" && (
                <span className="category-tile-count">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
