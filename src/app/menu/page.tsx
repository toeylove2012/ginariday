// src/app/menu/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { MENUS } from "@/lib/data/menus";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "เมนูอาหารไทยทั้งหมด - ตารางแคลอรี่และโภชนาการ",
  description:
    "รวมเมนูอาหารไทยยอดนิยมพร้อมตารางแคลอรี่ โปรตีน คาร์บ และไขมัน ครบทุกเมนู ข้าวกะเพรา ผัดไทย ต้มยำกุ้ง และอีกมากมาย",
  keywords: [
    "เมนูอาหารไทย",
    "แคลอรี่อาหารไทย",
    "ตารางแคลอรี่",
    "อาหารไทยกี่แคล",
  ],
});

export default function MenuIndexPage() {
  const menusByType = MENUS.reduce(
    (acc, menu) => {
      if (!acc[menu.type]) acc[menu.type] = [];
      acc[menu.type].push(menu);
      return acc;
    },
    {} as Record<string, typeof MENUS>,
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-ink text-white py-8 px-5">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-stone-400 mb-3">
            <Link href="/" className="hover:text-saffron">
              หน้าแรก
            </Link>
            {" > "}
            <span className="text-white">เมนูอาหาร</span>
          </nav>
          <h1 className="font-mitr text-4xl font-bold mb-2">
            🍜 เมนูอาหารไทยทั้งหมด
          </h1>
          <p className="text-stone-300">
            รวมเมนูยอดนิยมพร้อมตารางแคลอรี่และโภชนาการ
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {/* Search hint */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-stone-200">
          <p className="text-sm text-smoke">
            💡 <strong>คำค้นยอดนิยม:</strong> &quot;กะเพราหมูกรอบกี่แคล&quot;
            &quot;ผัดไทยกี่แคล&quot; &quot;ต้มยำกุ้งกี่แคล&quot;
          </p>
        </div>

        {/* Menu Categories */}
        {Object.entries(menusByType).map(([type, menus]) => (
          <section key={type} className="mb-8">
            <h2 className="font-mitr text-2xl font-bold mb-4 flex items-center gap-2">
              {type === "ข้าว" && "🍚"}
              {type === "เส้น" && "🍜"}
              {type === "ซุป" && "🥣"}
              {type === "ยำ" && "🥗"}
              {type === "แกง" && "🍛"}
              {type === "กับข้าว" && "🍽️"}
              เมนู{type}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {menus.map((menu) => (
                <Link
                  key={menu.id}
                  href={`/menu/${menu.slug}`}
                  className="bg-white rounded-2xl p-4 shadow hover:shadow-xl transition-all border border-stone-200 hover:border-saffron group"
                >
                  <div className="text-4xl mb-2 text-center group-hover:scale-110 transition-transform">
                    {type === "ข้าว"
                      ? "🍚"
                      : type === "เส้น"
                        ? "🍜"
                        : type === "ซุป"
                          ? "🥣"
                          : type === "ยำ"
                            ? "🥗"
                            : "🍽️"}
                  </div>

                  <h3 className="font-semibold text-center mb-2 group-hover:text-saffron transition-colors">
                    {menu.name}
                  </h3>

                  <div className="flex justify-between items-center text-xs text-smoke">
                    <span>{menu.calories} kcal</span>
                    <span>
                      ฿{menu.price_min}–{menu.price_max}
                    </span>
                  </div>

                  {menu.spicy_level > 0 && (
                    <div className="mt-2 text-center">
                      <span className="text-xs px-2 py-1 bg-red-50 text-red-900 rounded-full">
                        🌶️ {"".padStart(menu.spicy_level, "🌶️")}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="bg-gradient-to-br from-saffron to-amber-600 rounded-3xl shadow-lg p-8 text-white text-center mt-12">
          <h2 className="font-mitr text-3xl font-bold mb-3">
            ไม่รู้จะกินอะไรดี?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            ใช้ระบบสุ่มเมนูอัจฉริยะของเราสิ!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white text-saffron rounded-full font-bold text-lg hover:bg-stone-100 transition-colors shadow-lg"
          >
            🎲 สุ่มเมนูเลย
          </Link>
        </div>
      </main>
    </div>
  );
}
