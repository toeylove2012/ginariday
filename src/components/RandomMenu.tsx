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
        const data = res.data as Menu[] | null;
        const fetchError = res.error;
        if (fetchError) throw fetchError;
        setMenus(data ?? []);
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

  function filterMenus(): Menu[] {
    return menus.filter((m) => {
      // Budget filter based on price_max primarily
      if (budget === "low" && m.price_max > 50) return false;
      if (budget === "mid" && (m.price_max <= 50 || m.price_max > 100))
        return false;
      if (budget === "high" && m.price_min <= 100) return false;

      // Location
      if (!m.available_at.includes(location)) return false;

      // Spicy
      if (spicy === "spicy" && m.spicy_level < 3) return false;
      if (spicy === "mild" && m.spicy_level > 1) return false;

      // Goal
      if (goal === "diet" && m.calories > 450) return false;
      if (goal === "protein" && m.protein < 20) return false;

      return true;
    });
  }

  function pickRandom() {
    setSpinner(true);
    setResult(null);
    setTimeout(() => {
      const pool = filterMenus();
      if (pool.length === 0) {
        setError("ไม่พบเมนูที่ตรงกับเงื่อนไข");
        setSpinner(false);
        return;
      }
      const idx = Math.floor(Math.random() * pool.length);
      setResult(pool[idx]);
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
    </section>
  );
}
