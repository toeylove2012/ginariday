// src/app/layout.tsx
import type { Metadata } from 'next'
import { Sarabun, Mitr } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  weight: ['300', '400', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  variable: '--font-sarabun',
})

const mitr = Mitr({
  weight: ['400', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-mitr',
})

export const metadata: Metadata = {
  title: 'กินอะไรดีวันนี้ 🍜 | สุ่มเมนู • ค้นจากตู้เย็น • คำนวณแคล',
  description:
    'กินอะไรดีวันนี้ - สุ่มเมนูอาหารไทย ค้นหาเมนูจากวัตถุดิบในตู้เย็น คำนวณแคลอรี่อาหารไทย',
  keywords: [
    'วันนี้กินอะไรดี',
    'กะเพราหมูกรอบกี่แคล',
    'มีไข่ทำอะไรได้บ้าง',
    'สุ่มเมนูอาหาร',
    'แคลอรี่อาหารไทย',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${sarabun.variable} ${mitr.variable}`}>
      <body className="font-sarabun bg-cream text-ink min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
