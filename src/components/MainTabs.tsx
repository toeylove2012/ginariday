"use client";

import { useState } from "react";
import RandomMenu from "./RandomMenu";
import FridgeFinder from "./FridgeFinder";
import CalorieCalculator from "./CalorieCalculator";

type Tab = "random" | "fridge" | "calorie";

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: "random", emoji: "🎲", label: "สุ่มเมนู" },
  { id: "fridge", emoji: "🥚", label: "ตู้เย็น" },
  { id: "calorie", emoji: "🔥", label: "แคลอรี่" },
];

export default function MainTabs({ userId }: { userId?: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("random");

  return (
    <>
      <div className="max-w-[480px] mx-auto px-4 -mt-6 relative z-10">
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-1.5 rounded-xl text-[0.78rem] font-semibold transition-all flex flex-col items-center gap-0.5 ${
                activeTab === tab.id ? "bg-saffron text-ink" : "text-smoke"
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[480px] mx-auto px-4 pb-24">
        {activeTab === "random" && <RandomMenu userId={userId} />}
        {activeTab === "fridge" && <FridgeFinder userId={userId} />}
        {activeTab === "calorie" && <CalorieCalculator userId={userId} />}
      </main>
    </>
  );
}
