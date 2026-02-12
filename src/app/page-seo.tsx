// src/app/page.tsx (UPDATED with SEO)
import { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TabNav from '@/components/TabNav'
import RandomMenu from '@/components/RandomMenu'
import FridgeFinder from '@/components/FridgeFinder'
import CalorieCalculator from '@/components/CalorieCalculator'
import { createClient } from '@/lib/supabase/server'
import { generateSEO, generateFAQSchema } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: 'กินอะไรดีวันนี้ 🍜 | สุ่มเมนู • ค้นจากตู้เย็น • คำนวณแคล',
  description:
    'กินอะไรดีวันนี้ - สุ่มเมนูอาหารไทยด้วย AI, ค้นหาเมนูจากวัตถุดิบในตู้เย็น, คำนวณแคลอรี่อาหารไทย พร้อมตารางโภชนาการครบถ้วน',
  keywords: [
    'วันนี้กินอะไรดี',
    'สุ่มเมนูอาหาร',
    'กะเพราหมูกรอบกี่แคล',
    'มีไข่ทำอะไรได้บ้าง',
    'แคลอรี่อาหารไทย',
    'เมนูอาหารไทย',
  ],
})

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // FAQ Schema for rich snippets
  const faqSchema = generateFAQSchema([
    {
      question: 'วันนี้กินอะไรดี?',
      answer:
        'ใช้ระบบสุ่มเมนูอัจฉริยะของเรา เลือกงบประมาณ สถานที่ ความเผ็ด และเป้าหมาย แล้วระบบจะแนะนำเมนูที่เหมาะกับคุณ',
    },
    {
      question: 'กะเพราหมูกรอบกี่แคล?',
      answer:
        'กะเพราหมูกรอบมีแคลอรี่ 620 kcal ต่อจาน โปรตีน 28g คาร์บ 72g ไขมัน 22g',
    },
    {
      question: 'มีไข่ทำอะไรได้บ้าง?',
      answer:
        'ใช้ระบบค้นหาจากตู้เย็น เลือกวัตถุดิบที่มี (เช่น ไข่, ข้าว) แล้วระบบจะแนะนำเมนูที่ทำได้พร้อมวิธีทำทีละขั้น',
    },
    {
      question: 'เว็บนี้คำนวณแคลอรี่อาหารไทยได้ไหม?',
      answer:
        'ได้ครับ เลือกเมนูที่กิน ปรับ modifier (เช่น น้ำมันเพิ่ม, ข้าวน้อย) ใส่น้ำหนักตัว แล้วระบบจะคำนวณแคลและเวลาเผาผลาญ',
    },
  ])

  return (
    <>
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen">
        <Header user={user} />
        <Hero />
        <TabNav />

        <main className="max-w-[480px] mx-auto px-4 pb-24">
          <RandomMenu userId={user?.id} />
          <FridgeFinder userId={user?.id} />
          <CalorieCalculator userId={user?.id} />
        </main>

        {/* SEO Text Content (hidden, for crawlers) */}
        <article className="sr-only">
          <h1>วันนี้กินอะไรดี - สุ่มเมนูอาหารไทย</h1>
          <p>
            กินอะไรดีวันนี้ คือเครื่องมือช่วยตัดสินใจเลือกเมนูอาหารไทย
            ด้วยระบบสุ่มเมนูอัจฉริยะที่คำนึงถึงงบประมาณ ความเผ็ด และเป้าหมายของคุณ
          </p>
          <h2>ฟีเจอร์หลัก</h2>
          <ul>
            <li>สุ่มเมนูอาหาร - ระบบ AI เลือกเมนูที่เหมาะกับคุณ</li>
            <li>ค้นหาจากตู้เย็น - มีวัตถุดิบอะไรทำอะไรได้บ้าง</li>
            <li>คำนวณแคลอรี่ - ตารางโภชนาการอาหารไทยครบถ้วน</li>
          </ul>
        </article>
      </div>
    </>
  )
}
