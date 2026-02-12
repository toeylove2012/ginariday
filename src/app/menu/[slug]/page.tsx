// src/app/menu/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MENUS } from '@/lib/data/menus'
import { generateSEO, generateMenuSchema, generateBreadcrumbSchema, generateKeywords } from '@/lib/seo'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static paths for all menus (SSG)
export async function generateStaticParams() {
  return MENUS.map((menu) => ({
    slug: menu.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const menu = MENUS.find((m) => m.slug === slug)
  
  if (!menu) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return generateSEO({
    title: `${menu.name}กี่แคล? ตารางโภชนาการ + วิธีทำ`,
    description: `${menu.name} มีแคลอรี่ ${menu.calories} kcal โปรตีน ${menu.protein}g คาร์บ ${menu.carb}g ไขมัน ${menu.fat}g ราคา ${menu.price_min}-${menu.price_max} บาท พร้อมสูตรและวิธีทำ`,
    keywords: generateKeywords(menu),
    canonicalUrl: `${siteUrl}/menu/${slug}`,
    ogImage: `/api/og?menu=${menu.name}`,
  })
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const menu = MENUS.find((m) => m.slug === slug)

  if (!menu) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Schema.org structured data
  const menuSchema = generateMenuSchema(menu)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'หน้าแรก', url: siteUrl },
    { name: 'เมนูอาหาร', url: `${siteUrl}/menu` },
    { name: menu.name, url: `${siteUrl}/menu/${slug}` },
  ])

  const spicyLabels = ['ไม่เผ็ด', 'เผ็ดน้อย', 'เผ็ดปานกลาง', 'เผ็ด', 'เผ็ดมาก', 'เผ็ดสุดๆ']

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-cream">
        {/* Header */}
        <header className="bg-ink text-white py-4 px-5">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-stone-400 mb-2">
              <Link href="/" className="hover:text-saffron">หน้าแรก</Link>
              {' > '}
              <Link href="/menu" className="hover:text-saffron">เมนูอาหาร</Link>
              {' > '}
              <span className="text-white">{menu.name}</span>
            </nav>
            <h1 className="font-mitr text-3xl font-bold">{menu.name}</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-5 py-8">
          {/* Hero Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{menu.name}กี่แคล?</h2>
                <p className="text-smoke">
                  {menu.reasons.any || `เมนู${menu.type}ยอดนิยม`}
                </p>
              </div>
              <div className="text-6xl">
                {menu.type === 'ข้าว' ? '🍚' : 
                 menu.type === 'เส้น' ? '🍜' : 
                 menu.type === 'ซุป' ? '🥣' : 
                 menu.type === 'ยำ' ? '🥗' : '🍽️'}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-sm font-semibold">
                {menu.type}
              </span>
              <span className="px-3 py-1 bg-red-50 text-red-900 rounded-full text-sm font-semibold">
                🌶️ {spicyLabels[menu.spicy_level]}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-900 rounded-full text-sm font-semibold">
                ฿{menu.price_min}–{menu.price_max}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Nutrition Table */}
            <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-6">
              <h2 className="font-mitr text-xl font-bold mb-4 flex items-center gap-2">
                📊 ตารางโภชนาการ
              </h2>
              
              <div className="space-y-3">
                <NutritionRow label="แคลอรี่" value={`${menu.calories} kcal`} highlight />
                <NutritionRow label="โปรตีน" value={`${menu.protein}g`} />
                <NutritionRow label="คาร์โบไฮเดรต" value={`${menu.carb}g`} />
                <NutritionRow label="ไขมัน" value={`${menu.fat}g`} />
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-900">
                💡 <strong>เทียบกับความต้องการต่อวัน:</strong>
                <br />
                คิดเป็น {Math.round((menu.calories / 2000) * 100)}% ของ 2,000 kcal
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-6">
              <h2 className="font-mitr text-xl font-bold mb-4 flex items-center gap-2">
                🧺 วัตถุดิบ
              </h2>
              <div className="flex flex-wrap gap-2">
                {menu.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-stone-100 text-ink rounded-full text-sm font-semibold"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-6 mb-6">
            <h2 className="font-mitr text-xl font-bold mb-4">❓ คำถามที่พบบ่อย</h2>
            
            <div className="space-y-4">
              <FAQItem
                question={`${menu.name}กี่แคล?`}
                answer={`${menu.name} มีแคลอรี่ ${menu.calories} กิโลแคลอรี่ต่อจาน (ขนาดปกติ)`}
              />
              <FAQItem
                question={`${menu.name}เหมาะกับคนลดน้ำหนักไหม?`}
                answer={
                  menu.calories < 350
                    ? `เหมาะมาก! ${menu.name} มีแคลอรี่ต่ำเพียง ${menu.calories} kcal`
                    : `${menu.name} มีแคลอรี่ปานกลาง ควรควบคุมปริมาณถ้ากำลังลดน้ำหนัก`
                }
              />
              <FAQItem
                question={`ทำ${menu.name}ต้องใช้วัตถุดิบอะไรบ้าง?`}
                answer={`วัตถุดิบหลัก: ${menu.ingredients.slice(0, 5).join(', ')}`}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-saffron to-amber-600 rounded-3xl shadow-lg p-6 text-white text-center">
            <h3 className="font-mitr text-2xl font-bold mb-2">
              อยากสุ่มเมนูอื่นๆ ไหม?
            </h3>
            <p className="mb-4 opacity-90">
              ใช้ระบบสุ่มเมนูอัจฉริยะของเรา หรือค้นหาเมนูจากวัตถุดิบในตู้เย็น
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white text-saffron rounded-full font-bold hover:bg-stone-100 transition-colors"
            >
              🎲 กลับหน้าแรก
            </Link>
          </div>

          {/* Related Menus */}
          <div className="mt-8">
            <h2 className="font-mitr text-2xl font-bold mb-4">🔗 เมนูแนะนำ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MENUS.filter((m) => m.id !== menu.id && m.type === menu.type)
                .slice(0, 4)
                .map((related) => (
                  <Link
                    key={related.id}
                    href={`/menu/${related.slug}`}
                    className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition-shadow border border-stone-200"
                  >
                    <div className="text-3xl mb-2 text-center">
                      {related.type === 'ข้าว' ? '🍚' : '🍜'}
                    </div>
                    <h3 className="font-semibold text-sm text-center mb-1">
                      {related.name}
                    </h3>
                    <p className="text-xs text-center text-smoke">
                      {related.calories} kcal
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

function NutritionRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-xl ${
        highlight ? 'bg-amber-50' : 'bg-stone-50'
      }`}
    >
      <span className={`font-semibold ${highlight ? 'text-amber-900' : ''}`}>
        {label}
      </span>
      <span className={`font-bold ${highlight ? 'text-amber-600 text-lg' : ''}`}>
        {value}
      </span>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group">
      <summary className="font-semibold cursor-pointer hover:text-saffron transition-colors list-none flex items-center justify-between">
        {question}
        <span className="text-saffron group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      <p className="mt-2 text-smoke pl-4 border-l-2 border-stone-200">{answer}</p>
    </details>
  )
}
