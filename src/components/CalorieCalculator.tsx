"use client";

import { useState } from "react";
import { MENUS } from "@/lib/data/menus";
import { calculateCalories } from "@/lib/calories";
import type { Modifier } from "@/types";

const MODIFIER_LABELS: Record<Modifier, string> = {
  normal: "🍽️ ปกติ",
  "extra-oil": "🫕 เพิ่มน้ำมัน",
  "less-rice": "🥣 ข้าวน้อย",
  "add-egg": "🥚 เพิ่มไข่",
};

const ACTIVITY_LABELS: Record<string, { emoji: string; label: string }> = {
  walking: { emoji: "🚶", label: "เดิน" },
  running: { emoji: "🏃", label: "วิ่ง" },
  cycling: { emoji: "🚴", label: "ปั่นจักรยาน" },
  swimming: { emoji: "🏊", label: "ว่ายน้ำ" },
  yoga: { emoji: "🧘", label: "โยคะ" },
};

export default function CalorieCalculator({ userId }: { userId?: string }) {
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [modifier, setModifier] = useState<Modifier>("normal");
  const [weight, setWeight] = useState(60);
  const [result, setResult] = useState<ReturnType<typeof calculateCalories> | null>(null);

  const selectedMenu = MENUS.find((m) => m.id === selectedMenuId) ?? null;

  function calculate() {
    if (!selectedMenu) return;
    setResult(
      calculateCalories(
        selectedMenu.calories,
        selectedMenu.protein,
        selectedMenu.carb,
        selectedMenu.fat,
        modifier,
        weight,
      ),
    );
  }

  return (
    <section className="mt-6">
      <div className="card">
        <p className="card-title">🍽️ เลือกเมนูที่กิน</p>
        <div className="calorie-menu-grid">
          {MENUS.map((menu) => (
            <button
              key={menu.id}
              onClick={() => {
                setSelectedMenuId(menu.id);
                setResult(null);
              }}
              className={`cal-menu-chip${selectedMenuId === menu.id ? " selected" : ""}`}
            >
              {menu.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-title">⚙️ ปรับแต่งเมนู</p>
        <div className="modifier-row">
          {(Object.keys(MODIFIER_LABELS) as Modifier[]).map((mod) => (
            <button
              key={mod}
              onClick={() => {
                setModifier(mod);
                setResult(null);
              }}
              className={`modifier-btn${modifier === mod ? " active" : ""}`}
            >
              {MODIFIER_LABELS[mod]}
            </button>
          ))}
        </div>

        <p className="card-title" style={{ marginTop: "8px" }}>
          ⚖️ น้ำหนักของคุณ
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="range"
            min={40}
            max={120}
            value={weight}
            onChange={(e) => {
              setWeight(Number(e.target.value));
              setResult(null);
            }}
            style={{ flex: 1 }}
          />
          <span
            style={{
              fontFamily: "Mitr, sans-serif",
              fontWeight: 700,
              color: "var(--saffron)",
              minWidth: "60px",
            }}
          >
            {weight} กก.
          </span>
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={!selectedMenu}
        className="btn-main"
        style={{ opacity: !selectedMenu ? 0.5 : 1 }}
      >
        🔥 คำนวณแคลอรี่
      </button>

      {result && selectedMenu && (
        <div className="cal-result show" style={{ marginTop: "16px" }}>
          <div className="card">
            <div className="cal-big-num">{result.calories}</div>
            <div className="cal-unit">แคลอรี่ จาก{selectedMenu.name}</div>

            <div className="macro-bar">
              {[
                {
                  name: "คาร์บ",
                  val: result.macros.carb,
                  pct: result.macroPercent.carb,
                  color: "#f59e0b",
                },
                {
                  name: "โปรตีน",
                  val: result.macros.protein,
                  pct: result.macroPercent.protein,
                  color: "#10b981",
                },
                {
                  name: "ไขมัน",
                  val: result.macros.fat,
                  pct: result.macroPercent.fat,
                  color: "#ef4444",
                },
              ].map((m) => (
                <div key={m.name} style={{ marginBottom: "12px" }}>
                  <div className="macro-row">
                    <span className="macro-name">{m.name}</span>
                    <span className="macro-val">
                      {m.val}g ({m.pct}%)
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${m.pct}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="burn-section">
              <div className="burn-title">⏱️ ต้องออกกำลังกายนานแค่ไหน?</div>
              <div className="burn-grid">
                {Object.entries(result.burnMinutes).map(([act, mins]) => {
                  const info = ACTIVITY_LABELS[act] ?? {
                    emoji: "🏃",
                    label: act,
                  };
                  return (
                    <div key={act} className="burn-item">
                      <span className="burn-emoji">{info.emoji}</span>
                      <div className="burn-time">{mins} นาที</div>
                      <div className="burn-act">{info.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
