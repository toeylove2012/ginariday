"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Menu } from "@/types";

export default function RandomMenu({ userId }: { userId?: string }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Menu | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);

  // Filter state
  const [budget, setBudget] = useState<"low" | "mid" | "high">("low");
  const [spicy, setSpicy] = useState<"any" | "spicy" | "mild">("any");
  const [goal, setGoal] = useState<"any" | "diet" | "protein">("any");

  // Debug counters
  const [loadedCount, setLoadedCount] = useState(0);
  const [mappedCount, setMappedCount] = useState(0);
  const [lastPoolCount, setLastPoolCount] = useState(0);
  const [lastPickedDebug, setLastPickedDebug] = useState("-");
  const [lastChosenScore, setLastChosenScore] = useState<number | null>(null);

  // Fetch menus on mount
  useEffect(() => {
    const fetchMenus = async () => {
      const supabase = createClient();
      try {
        console.log("📡 Fetching menus from Supabase...");
        // Diagnostic: print the Supabase URL this client is using
        try {
          // NEXT_PUBLIC_SUPABASE_URL is safe to log (public)
          // eslint-disable-next-line no-console
          console.log(
            "🔎 Supabase URL (client):",
            process.env.NEXT_PUBLIC_SUPABASE_URL,
          );
        } catch (e) {
          // ignore
        }

        // First check: count all rows
        const { count, error: countError } = await supabase
          .from("menus")
          .select("*", { count: "exact", head: true });

        console.log(`📊 Total menus in DB: ${count} | Error:`, countError);

        const { data, error } = await supabase
          .from("menus")
          .select("*")
          .limit(10);

        if (error) {
          console.error("❌ Supabase error:", error);
          throw error;
        }

        console.log("✅ Data received:", data);
        if (!data) {
          console.warn("⚠️ No data returned");
          return;
        }

        console.log(`📊 Loaded ${data.length} menus`);
        setLoadedCount(data.length);

        // Map DB schema to component Menu type
        const mapped = data.map(
          (r: any): Menu => ({
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
            type: r.type ?? "อาหารตามสั่ง",
            reasons: {
              any: r.description ?? "",
            },
          }),
        );

        console.log(`✅ Mapped ${mapped.length} menus`);
        setMappedCount(mapped.length);
        setMenus(mapped);
      } catch (err) {
        console.error("❌ Failed to fetch menus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

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

    // STEP 4: Anti-repeat (ลดคะแนนเมนูที่เพิ่งสุ่มได้)
    const recent = JSON.parse(
      localStorage.getItem("recent_menus") || "[]",
    ) as string[];
    if (recent.includes(m.id?.toString() ?? m.slug)) {
      score -= 30;
    }

    // STEP 6: Controlled randomness (±15 points)
    score += (Math.random() - 0.5) * 30;

    return Math.max(0, score);
  }

  function reasonFor(m: Menu, score: number): string {
    const reasons: string[] = [];

    const budgetLabels: Record<string, string> = {
      low: "ไม่เกิน 50฿",
      mid: "50–100฿",
      high: "มากกว่า 100฿",
    };

    const baseScore = 50;
    let earnedBonus = score - baseScore;

    // Reconstruct why this menu was picked
    if (spicy === "spicy" && m.spicy_level >= 3) {
      reasons.push("เผ็ดจริง");
    }
    if (goal === "diet" && m.calories < 300) {
      reasons.push("แคลต่ำ");
    }
    if (goal === "protein" && m.protein >= 25) {
      reasons.push("โปรตีนสูง");
    }

    if (reasons.length === 0) {
      reasons.push("เข้าเงื่อนไข");
    }

    return reasons.join(" • ");
  }

  function pickRandom() {
    if (menus.length === 0) return;

    setShowSpinner(true);

    setTimeout(() => {
      const scored = menus
        .map((m) => ({ menu: m, score: scoreMenu(m) }))
        .filter((x) => x.score >= 0)
        .sort((a, b) => b.score - a.score);

      setLastPoolCount(scored.length);

      if (scored.length === 0) {
        setShowSpinner(false);
        setResult(null);
        return;
      }

      // Pick random from top 3 (weighted randomness)
      const topN = scored.slice(0, Math.min(3, scored.length));
      const chosen = topN[Math.floor(Math.random() * topN.length)];

      // Add to recent_menus (keep last 5)
      const recent = JSON.parse(
        localStorage.getItem("recent_menus") || "[]",
      ) as string[];
      recent.push(chosen.menu.id?.toString() ?? chosen.menu.slug);
      if (recent.length > 5) recent.shift();
      localStorage.setItem("recent_menus", JSON.stringify(recent));

      setLastPickedDebug(chosen.menu.slug);
      setLastChosenScore(chosen.score);
      setResult(chosen.menu);
      setShowSpinner(false);
    }, 800);
  }

  useEffect(() => {
    // Set up event listeners for chip buttons
    const handleChipClick = (e: Event) => {
      const btn = e.target as HTMLElement;
      const group = btn.getAttribute("data-group");
      const val = btn.getAttribute("data-val");

      if (!group || !val) return;

      // Update sibling buttons
      document
        .querySelectorAll(`[data-group="${group}"]`)
        .forEach((el) => el.classList.remove("selected"));
      btn.classList.add("selected");

      // Update state
      if (group === "budget") setBudget(val as "low" | "mid" | "high");
      if (group === "spicy") setSpicy(val as "any" | "spicy" | "mild");
      if (group === "goal") setGoal(val as "any" | "diet" | "protein");
    };

    const chipButtons = document.querySelectorAll(".chip");
    chipButtons.forEach((btn) => {
      btn.addEventListener("click", handleChipClick as EventListener);
    });

    // Set up main button
    const mainBtn = document.querySelector(".btn-main");
    if (mainBtn) {
      mainBtn.addEventListener("click", pickRandom);
    }

    return () => {
      chipButtons.forEach((btn) => {
        btn.removeEventListener("click", handleChipClick as EventListener);
      });
      if (mainBtn) {
        mainBtn.removeEventListener("click", pickRandom);
      }
    };
  }, [menus, budget, spicy, goal]);

  return (
    <section className="section active" id="sec-random">
      <div className="card">
        <p className="card-title">💰 งบประมาณ</p>
        <div className="chip-group" id="budget-group">
          <button className="chip selected" data-group="budget" data-val="low">
            ไม่เกิน 50฿
          </button>
          <button className="chip" data-group="budget" data-val="mid">
            50–100฿
          </button>
          <button className="chip" data-group="budget" data-val="high">
            มากกว่า 100฿
          </button>
        </div>

        <p className="card-title">🌶️ ความเผ็ด</p>
        <div className="chip-group" id="spicy-group">
          <button className="chip selected" data-group="spicy" data-val="any">
            ไม่สน
          </button>
          <button className="chip spicy" data-group="spicy" data-val="spicy">
            เผ็ดเลย
          </button>
          <button className="chip" data-group="spicy" data-val="mild">
            ไม่เผ็ด
          </button>
        </div>

        <p className="card-title">⚖️ เป้าหมาย</p>
        <div className="chip-group" id="goal-group">
          <button className="chip selected" data-group="goal" data-val="any">
            กินอิ่มพอ
          </button>
          <button className="chip healthy" data-group="goal" data-val="diet">
            ควบคุมแคล
          </button>
          <button className="chip" data-group="goal" data-val="protein">
            เน้นโปรตีน
          </button>
        </div>
      </div>

      <button className="btn-main">🎲 สุ่มเมนูเลย!</button>

      {showSpinner && <div className="spinner">⏳ กำลังคิด...</div>}

      {result && (
        <div className="result-card">
          <div className="result-menu-name">{result.name}</div>
          <div className="result-reason">
            {reasonFor(result, lastChosenScore ?? 0)}
          </div>
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
            <span className="tag-chip">ความเผ็ด: {result.spicy_level}/5</span>
          </div>
          <button className="btn-secondary" style={{ marginTop: "16px" }}>
            🔄 สุ่มอีกที
          </button>
        </div>
      )}

      {/* Debug info */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "#999",
          marginTop: "16px",
          fontFamily: "monospace",
        }}
      >
        📊 loaded: {loadedCount} • mapped: {mappedCount} • pool: {lastPoolCount}{" "}
        • picked: {lastPickedDebug}
      </div>
    </section>
  );
}
