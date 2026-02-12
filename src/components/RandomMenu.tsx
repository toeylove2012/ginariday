"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Menu } from "@/types";

type Budget = "low" | "mid" | "high";
type Location = "condo" | "office" | "uni";
type Spicy = "any" | "spicy" | "mild";
type Goal = "any" | "diet" | "protein";

export default function RandomMenu({ userId }: { userId?: string }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Menu | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [mappedCount, setMappedCount] = useState(0);
  const [lastPoolCount, setLastPoolCount] = useState<number | null>(null);
  const [lastPickedDebug, setLastPickedDebug] = useState<any>(null);

  const [budget, setBudget] = useState<Budget>("low");
  const [location, setLocation] = useState<Location>("condo");
  const [spicy, setSpicy] = useState<Spicy>("any");
  const [goal, setGoal] = useState<Goal>("any");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await supabase.from("menus").select("*");
        console.debug("supabase res:", res);
        const data = res.data as any[] | null;
        const fetchError = res.error;
        if (fetchError) throw fetchError;
        // Map DB columns to frontend Menu shape (handles your schema: name_th, protein_g, carb_g, fat_g, available_at TEXT[])
        const mapped: Menu[] = (data ?? []).map((r) => ({
          id: r.id as any as any,
          slug: r.slug,
          name: r.name_th ?? r.name ?? r.name_en ?? r.slug,
          type: r.type,
          spicy_level: r.spicy_level ?? r.spicyLevel ?? 0,
          price_min: r.price_min ?? 0,
          price_max: r.price_max ?? 0,
          calories: r.calories ?? 0,
          protein: Number(r.protein_g ?? r.protein ?? 0),
          carb: Number(r.carb_g ?? r.carb ?? 0),
          fat: Number(r.fat_g ?? r.fat ?? 0),
          ingredients: r.ingredients ?? r.ingredients_list ?? [],
          available_at: r.available_at ?? [],
          reasons: { any: r.description ?? "" },
        })) as unknown as Menu[];
        setMenus(mapped);
        setLoadedCount((data ?? []).length);
        setMappedCount(mapped.length);
        console.debug("mapped menus count:", mapped.length);
        console.debug("loaded menus count:", (data ?? []).length);
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function toggleBudget(val: Budget) {
    setBudget(val);
  }
  function toggleLocation(val: Location) {
    setLocation(val);
  }
  function toggleSpicy(val: Spicy) {
    setSpicy(val);
  }
  function toggleGoal(val: Goal) {
    setGoal(val);
  }

  function scoreMenu(m: Menu): number {
    let score = 50; // base score

    // STEP 1: Hard filters (budget as hard limit)
    const budgetPass: Record<string, boolean> = {
      low: m.price_min <= 50,
      mid: m.price_min <= 100,
      high: true,
    };
    if (!budgetPass[budget]) return -1; // ตัดออก

    // STEP 2: Spicy preference bonus/penalty
    if (spicy === "spicy") {
      if (m.spicy_level >= 3) score += 20;
      if (m.spicy_level < 2) score -= 15;
    }
    if (spicy === "mild") {
      if (m.spicy_level <= 1) score += 20;
      if (m.spicy_level > 2) score -= 15;
    }

    // STEP 3: Goal scoring
    if (goal === "diet") {
      if (m.calories < 300) score += 25;
      else if (m.calories < 450) score += 10;
      else if (m.calories > 600) score -= 15;
    }
    if (goal === "protein") {
      if (m.protein >= 25) score += 25;
      else if (m.protein >= 18) score += 12;
    }

    // STEP 4: Location availability (soft bonus if available)
    if (m.available_at && m.available_at.length > 0) {
      if (m.available_at.includes(location)) score += 15;
    } else {
      // No restrictions = available anywhere
      score += 10;
    }

    // STEP 5: Controlled randomness (±15 points)
    score += (Math.random() - 0.5) * 30;

    return Math.max(0, score);
  }

  function pickRandom() {
    setSpinner(true);
    setResult(null);
    setError(null);
    setTimeout(() => {
      // Score all menus and filter out negative scores
      const scored = menus
        .map((m) => ({ menu: m, score: scoreMenu(m) }))
        .filter((x) => x.score >= 0)
        .sort((a, b) => b.score - a.score);

      setLastPoolCount(scored.length);
      console.debug(
        "menus total:",
        menus.length,
        "scored pool:",
        scored.length,
      );

      if (scored.length === 0) {
        setError("ไม่พบเมนูที่ตรงกับเงื่อนไข");
        setSpinner(false);
        return;
      }

      // Pick from top 3 by score (weighted randomness)
      const topN = scored.slice(0, Math.min(3, scored.length));
      const chosen = topN[Math.floor(Math.random() * topN.length)];

      setResult(chosen.menu);
      setLastPickedDebug(chosen.menu);
      console.debug(
        "picked from top",
        topN.length,
        "menu:",
        chosen.menu,
        "score:",
        chosen.score,
      );
      setSpinner(false);
    }, 500); // small delay to show spinner
  }

  function reasonFor(m: Menu) {
    if (goal === "diet" && m.reasons?.diet) return m.reasons.diet;
    if (goal === "protein" && m.reasons?.protein) return m.reasons.protein;
    return m.reasons?.any ?? "-";
  }

  return (
    <section className="section active" id="sec-random">
      <div className="card">
        <p className="card-title">💰 งบประมาณ</p>
        <div className="chip-group" id="budget-group">
          <button
            className={`chip ${budget === "low" ? "selected" : ""}`}
            onClick={() => toggleBudget("low")}
          >
            ไม่เกิน 50฿
          </button>
          <button
            className={`chip ${budget === "mid" ? "selected" : ""}`}
            onClick={() => toggleBudget("mid")}
          >
            50–100฿
          </button>
          <button
            className={`chip ${budget === "high" ? "selected" : ""}`}
            onClick={() => toggleBudget("high")}
          >
            มากกว่า 100฿
          </button>
        </div>

        <p className="card-title">📍 อยู่ที่ไหน</p>
        <div className="chip-group" id="location-group">
          <button
            className={`chip ${location === "condo" ? "selected" : ""}`}
            onClick={() => toggleLocation("condo")}
          >
            คอนโด/บ้าน
          </button>
          <button
            className={`chip ${location === "office" ? "selected" : ""}`}
            onClick={() => toggleLocation("office")}
          >
            ออฟฟิศ
          </button>
          <button
            className={`chip ${location === "uni" ? "selected" : ""}`}
            onClick={() => toggleLocation("uni")}
          >
            มหาวิทยาลัย
          </button>
        </div>

        <p className="card-title">🌶️ ความเผ็ด</p>
        <div className="chip-group" id="spicy-group">
          <button
            className={`chip ${spicy === "any" ? "selected" : ""}`}
            onClick={() => toggleSpicy("any")}
          >
            ไม่สน
          </button>
          <button
            className={`chip spicy ${spicy === "spicy" ? "selected" : ""}`}
            onClick={() => toggleSpicy("spicy")}
          >
            เผ็ดเลย
          </button>
          <button
            className={`chip ${spicy === "mild" ? "selected" : ""}`}
            onClick={() => toggleSpicy("mild")}
          >
            ไม่เผ็ด
          </button>
        </div>

        <p className="card-title">⚖️ เป้าหมาย</p>
        <div className="chip-group" id="goal-group">
          <button
            className={`chip ${goal === "any" ? "selected" : ""}`}
            onClick={() => toggleGoal("any")}
          >
            กินอิ่มพอ
          </button>
          <button
            className={`chip healthy ${goal === "diet" ? "selected" : ""}`}
            onClick={() => toggleGoal("diet")}
          >
            ควบคุมแคล
          </button>
          <button
            className={`chip ${goal === "protein" ? "selected" : ""}`}
            onClick={() => toggleGoal("protein")}
          >
            เน้นโปรตีน
          </button>
        </div>
      </div>

      <button
        className="btn-main"
        onClick={pickRandom}
        disabled={loading || spinner}
      >
        🎲 สุ่มเมนูเลย!
      </button>

      {spinner && (
        <div className="spinner" id="spinner-random">
          ⏳ กำลังคิด...
        </div>
      )}

      <div className="result-card" id="result-random">
        <div className="result-menu-name" id="res-name">
          {result?.name ?? "—"}
        </div>
        <div className="result-reason" id="res-reason">
          {result ? reasonFor(result) : "—"}
        </div>
        <div className="result-stats">
          <div className="stat-box">
            <span className="stat-value" id="res-cal">
              {result ? result.calories : "—"}
            </span>
            <span className="stat-label">แคลอรี่</span>
          </div>
          <div className="stat-box">
            <span className="stat-value" id="res-price">
              {result ? `${result.price_min}-${result.price_max}` : "—"}
            </span>
            <span className="stat-label">ราคา (฿)</span>
          </div>
          <div className="stat-box">
            <span className="stat-value" id="res-protein">
              {result ? result.protein : "—"}
            </span>
            <span className="stat-label">โปรตีน (g)</span>
          </div>
        </div>
        <div className="result-tags" id="res-tags">
          {result &&
            result.available_at.map((t) => (
              <span key={t} className="tag mr-2">
                {t}
              </span>
            ))}
        </div>
        <button
          className="btn-secondary"
          onClick={pickRandom}
          style={{ marginTop: 16 }}
        >
          🔄 สุ่มอีกที
        </button>
      </div>
      {/* Debug info - visible on page to help diagnose fetching/filtering issues */}
      <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        <div>
          DEBUG — loaded rows: {loadedCount} • mapped: {mappedCount}
        </div>
        <div>
          last filtered pool: {lastPoolCount ?? "-"} • last picked:{" "}
          {lastPickedDebug
            ? (lastPickedDebug.slug ?? lastPickedDebug.name ?? "obj")
            : "-"}
        </div>
        {error && <div style={{ color: "crimson" }}>Error: {error}</div>}
      </div>
    </section>
  );
}
