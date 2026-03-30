"use client";

import { useState } from "react";
import { INGREDIENTS, INGREDIENT_MAP } from "@/lib/data/ingredients";
import { MENUS } from "@/lib/data/menus";
import type { Menu } from "@/types";

export default function FridgeFinder({ userId }: { userId?: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<Menu[] | null>(null);

  function toggleIngredient(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setMatches(null);
  }

  function findMenus() {
    if (selected.size === 0) return;

    const selectedNames = new Set(
      [...selected].flatMap((id) => INGREDIENT_MAP[id] ?? []),
    );

    const scored = MENUS.map((menu) => {
      const matchCount = menu.ingredients.filter((ing) =>
        [...selectedNames].some(
          (name) => ing.includes(name) || name.includes(ing),
        ),
      ).length;
      return { menu, matchCount };
    })
      .filter((x) => x.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    setMatches(scored.map((x) => x.menu));
  }

  return (
    <section className="mt-6">
      <div className="card">
        <p className="card-title">🧺 เลือกวัตถุดิบในตู้เย็น</p>

        <div className="ingredient-grid">
          {INGREDIENTS.map((ing) => (
            <button
              key={ing.id}
              onClick={() => toggleIngredient(ing.id)}
              className={`ingr-chip${selected.has(ing.id) ? " selected" : ""}`}
            >
              <span className="ingr-emoji">{ing.emoji}</span>
              {ing.name}
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <div className="selected-ingr">
            {[...selected].map((id) => {
              const ing = INGREDIENTS.find((i) => i.id === id);
              return ing ? (
                <span
                  key={id}
                  onClick={() => toggleIngredient(id)}
                  className="ingr-tag"
                >
                  {ing.emoji} {ing.name} ×
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      <button
        onClick={findMenus}
        disabled={selected.size === 0}
        className="btn-main"
        style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
      >
        🔍 ค้นหาเมนู
      </button>

      {matches !== null && (
        <div style={{ marginTop: "16px" }}>
          <p className="match-count">
            พบ <span>{matches.length}</span> เมนูที่ทำได้
          </p>
          {matches.length === 0 ? (
            <div className="card" style={{ textAlign: "center" }}>
              <p style={{ color: "var(--smoke)", fontSize: "0.9rem" }}>
                ไม่พบเมนูที่ตรงกัน ลองเพิ่มวัตถุดิบอื่น
              </p>
            </div>
          ) : (
            matches.map((menu) => (
              <div key={menu.id} className="match-card">
                <div className="match-name">{menu.name}</div>
                <div className="match-meta">
                  <span className="match-badge">
                    {menu.price_min}–{menu.price_max} ฿
                  </span>
                  <span className="match-badge green">{menu.calories} kcal</span>
                  <span className="match-badge">
                    {menu.spicy_level > 0
                      ? "🌶️".repeat(menu.spicy_level)
                      : "ไม่เผ็ด"}
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--smoke)" }}>
                  {menu.reasons.any}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
