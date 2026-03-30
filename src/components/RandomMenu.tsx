"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MENUS } from "@/lib/data/menus";
import type { Menu } from "@/types";

type Budget = "low" | "mid" | "high";
type Spicy = "any" | "spicy" | "mild";
type Goal = "any" | "diet" | "protein";

export default function RandomMenu({ userId }: { userId?: string }) {
  const [menus, setMenus] = useState<Menu[]>(MENUS);
  const [result, setResult] = useState<Menu | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [budget, setBudget] = useState<Budget>("low");
  const [spicy, setSpicy] = useState<Spicy>("any");
  const [goal, setGoal] = useState<Goal>("any");

  // Try to load menus from Supabase, keep local MENUS as fallback
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("menus")
          .select("*")
          .limit(50);
        if (error || !data || data.length === 0) return;

        const mapped: Menu[] = data.map((r: any) => ({
          id: Number(r.id),
          slug: r.slug,
          name: r.name_th ?? r.name_en ?? r.slug,
          spicy_level: r.spicy_level ?? 0,
          price_min: r.price_min ?? 50,
          price_max: r.price_max ?? 100,
          calories: r.calories ?? 300,
          protein: Number(r.protein_g ?? 20),
          carb: Number(r.carb_g ?? 30),
          fat: Number(r.fat_g ?? 10),
          available_at: r.available_at ?? [],
          ingredients: r.ingredients ?? [],
          type: (r.type as Menu["type"]) ?? "ข้าว",
          reasons: { any: r.description ?? "" },
        }));
        setMenus(mapped);
      } catch {
        // Keep local MENUS
      }
    };
    fetchMenus();
  }, []);

  function scoreMenu(m: Menu): number {
    let score = 50;

    const budgetPass: Record<Budget, boolean> = {
      low: m.price_min <= 50,
      mid: m.price_min <= 100,
      high: true,
    };
    if (!budgetPass[budget]) return -1;

    if (spicy === "spicy") {
      if (m.spicy_level >= 3) score += 20;
      if (m.spicy_level < 2) score -= 15;
    }
    if (spicy === "mild") {
      if (m.spicy_level <= 1) score += 20;
      if (m.spicy_level > 2) score -= 15;
    }

    if (goal === "diet") {
      if (m.calories < 300) score += 25;
      else if (m.calories < 450) score += 10;
      else if (m.calories > 600) score -= 15;
    }
    if (goal === "protein") {
      if (m.protein >= 25) score += 25;
      else if (m.protein >= 18) score += 12;
    }

    const recent = JSON.parse(
      localStorage.getItem("recent_menus") || "[]",
    ) as string[];
    if (recent.includes(String(m.id))) score -= 30;

    score += (Math.random() - 0.5) * 30;
    return Math.max(0, score);
  }

  function reasonFor(m: Menu): string {
    const reasons: string[] = [];
    if (spicy === "spicy" && m.spicy_level >= 3) reasons.push("เผ็ดจริง");
    if (goal === "diet" && m.calories < 300) reasons.push("แคลต่ำ");
    if (goal === "protein" && m.protein >= 25) reasons.push("โปรตีนสูง");
    if (reasons.length === 0) reasons.push("เข้าเงื่อนไข");
    return reasons.join(" • ");
  }

  function pickRandom() {
    if (showSpinner) return;
    setShowSpinner(true);

    setTimeout(() => {
      const scored = menus
        .map((m) => ({ menu: m, score: scoreMenu(m) }))
        .filter((x) => x.score >= 0)
        .sort((a, b) => b.score - a.score);

      if (scored.length === 0) {
        setShowSpinner(false);
        setResult(null);
        return;
      }

      const topN = scored.slice(0, Math.min(3, scored.length));
      const chosen = topN[Math.floor(Math.random() * topN.length)];

      const recent = JSON.parse(
        localStorage.getItem("recent_menus") || "[]",
      ) as string[];
      recent.push(String(chosen.menu.id));
      if (recent.length > 5) recent.shift();
      localStorage.setItem("recent_menus", JSON.stringify(recent));

      setResult(chosen.menu);
      setShowSpinner(false);
    }, 800);
  }

  function chip(active: boolean, variant?: "spicy" | "healthy") {
    const base = "chip";
    if (!active) return base;
    if (variant === "spicy") return `${base} spicy selected`;
    if (variant === "healthy") return `${base} healthy selected`;
    return `${base} selected`;
  }

  return (
    <section className="mt-6">
      <div className="card">
        <p className="card-title">💰 งบประมาณ</p>
        <div className="chip-group">
          <button className={chip(budget === "low")} onClick={() => setBudget("low")}>
            ไม่เกิน 50฿
          </button>
          <button className={chip(budget === "mid")} onClick={() => setBudget("mid")}>
            50–100฿
          </button>
          <button className={chip(budget === "high")} onClick={() => setBudget("high")}>
            มากกว่า 100฿
          </button>
        </div>

        <p className="card-title">🌶️ ความเผ็ด</p>
        <div className="chip-group">
          <button className={chip(spicy === "any")} onClick={() => setSpicy("any")}>
            ไม่สน
          </button>
          <button className={chip(spicy === "spicy", "spicy")} onClick={() => setSpicy("spicy")}>
            เผ็ดเลย
          </button>
          <button className={chip(spicy === "mild")} onClick={() => setSpicy("mild")}>
            ไม่เผ็ด
          </button>
        </div>

        <p className="card-title">⚖️ เป้าหมาย</p>
        <div className="chip-group">
          <button className={chip(goal === "any")} onClick={() => setGoal("any")}>
            กินอิ่มพอ
          </button>
          <button className={chip(goal === "diet", "healthy")} onClick={() => setGoal("diet")}>
            ควบคุมแคล
          </button>
          <button className={chip(goal === "protein")} onClick={() => setGoal("protein")}>
            เน้นโปรตีน
          </button>
        </div>
      </div>

      <button className="btn-main" onClick={pickRandom} disabled={showSpinner}>
        🎲 สุ่มเมนูเลย!
      </button>

      {showSpinner && <div className="spinner show">⏳ กำลังคิด...</div>}

      {result && !showSpinner && (
        <div className="result-card show">
          <div className="result-menu-name">{result.name}</div>
          <div className="result-reason">{reasonFor(result)}</div>
          <div className="result-stats">
            <div className="stat-box">
              <span className="stat-value">{result.calories}</span>
              <span className="stat-label">แคลอรี่</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">
                {result.price_min}–{result.price_max}
              </span>
              <span className="stat-label">ราคา (฿)</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{result.protein}</span>
              <span className="stat-label">โปรตีน (g)</span>
            </div>
          </div>
          <div className="result-tags">
            <span className="tag tag-spicy">
              {"🌶️".repeat(result.spicy_level) || "ไม่เผ็ด"}
            </span>
            <span className="tag tag-type">{result.type}</span>
          </div>
          <button
            className="btn-secondary"
            onClick={pickRandom}
            style={{ marginTop: "16px" }}
          >
            🔄 สุ่มอีกที
          </button>
        </div>
      )}
    </section>
  );
}
