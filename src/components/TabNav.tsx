"use client";

export default function TabNav() {
  const handleTabClick = (tabId: string) => {
    // Hide all sections (remove 'active' and add 'hidden')
    const sections = ["sec-random", "sec-fridge", "sec-calorie"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove("active");
        el.classList.add("hidden");
      }
    });

    // Show selected section (add 'active' and remove 'hidden')
    const selected = document.getElementById(`sec-${tabId}`);
    if (selected) {
      selected.classList.add("active");
      selected.classList.remove("hidden");
    }

    // Update tab UI
    const tabs = ["tab-random", "tab-fridge", "tab-calorie"];
    tabs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("bg-saffron", "text-ink");
    });
    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
      activeTab.classList.add("bg-saffron", "text-ink");
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 -mt-6 relative z-10">
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-xl">
        <button
          id="tab-random"
          onClick={() => handleTabClick("random")}
          className="flex-1 py-2.5 px-1.5 rounded-xl text-[0.78rem] font-semibold text-smoke transition-all flex flex-col items-center gap-0.5 bg-saffron text-ink"
        >
          <span className="text-lg">🎲</span>
          สุ่มเมนู
        </button>
        <button
          id="tab-fridge"
          onClick={() => handleTabClick("fridge")}
          className="flex-1 py-2.5 px-1.5 rounded-xl text-[0.78rem] font-semibold text-smoke transition-all flex flex-col items-center gap-0.5"
        >
          <span className="text-lg">🥚</span>
          ตู้เย็น
        </button>
        <button
          id="tab-calorie"
          onClick={() => handleTabClick("calorie")}
          className="flex-1 py-2.5 px-1.5 rounded-xl text-[0.78rem] font-semibold text-smoke transition-all flex flex-col items-center gap-0.5"
        >
          <span className="text-lg">🔥</span>
          แคลอรี่
        </button>
      </div>
    </div>
  );
}
