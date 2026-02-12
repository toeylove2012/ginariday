# 📊 SEO Management Guide — กินอะไรดีวันนี้

## 🎯 เป้าหมาย SEO

**ติด Top 3 ใน 6-12 เดือน:**
- "วันนี้กินอะไรดี" (Volume สูงมาก)
- "กะเพราหมูกรอบกี่แคล" 
- "ผัดไทยกี่แคล"
- "มีไข่ทำอะไรได้บ้าง"

---

## ✅ SEO Features ที่มีอยู่แล้ว

### 1. Metadata Optimization
- ✅ Dynamic Title & Description
- ✅ Keywords per page
- ✅ Open Graph (Facebook, LINE sharing)
- ✅ Twitter Cards
- ✅ Canonical URLs

### 2. Structured Data (Schema.org)
- ✅ Recipe Schema สำหรับทุกเมนู
- ✅ FAQ Schema
- ✅ Breadcrumb Schema
- ✅ Nutrition Information

### 3. Technical SEO
- ✅ `sitemap.xml` (auto-generated)
- ✅ `robots.txt` (auto-generated)
- ✅ Static Site Generation (SSG) สำหรับหน้าเมนู
- ✅ Mobile-first responsive
- ✅ Fast loading (Next.js 14)

### 4. Content Pages
- ✅ `/menu` — หน้ารวมเมนูทั้งหมด
- ✅ `/menu/[slug]` — 12 หน้าเมนูแยก (SSG)
- ✅ OG Image generation

---

## 📂 SEO File Structure

```
src/
├── lib/
│   └── seo.ts                  # SEO utilities
│       ├── generateSEO()       # Metadata generator
│       ├── generateMenuSchema()    # Recipe schema
│       ├── generateFAQSchema()     # FAQ schema
│       ├── generateBreadcrumbSchema()
│       └── generateKeywords()
├── app/
│   ├── page.tsx                # Homepage (with FAQ schema)
│   ├── sitemap.ts              # Sitemap generator
│   ├── robots.ts               # Robots.txt
│   ├── menu/
│   │   ├── page.tsx            # Menu index
│   │   └── [slug]/
│   │       └── page.tsx        # Individual menu pages
│   └── api/
│       └── og/
│           └── route.tsx       # OG image generator
```

---

## 🛠️ วิธีจัดการ SEO แต่ละหน้า

### 1. Homepage (`src/app/page.tsx`)

**Current SEO:**
```typescript
import { generateSEO, generateFAQSchema } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'กินอะไรดีวันนี้ 🍜 | สุ่มเมนู • ค้นจากตู้เย็น • คำนวณแคล',
  description: '...',
  keywords: ['วันนี้กินอะไรดี', 'สุ่มเมนูอาหาร', ...],
})
```

**วิธีแก้ไข:**
1. เปิดไฟล์ `src/app/page.tsx`
2. แก้ `title`, `description`, `keywords`
3. Deploy → อัปเดตอัตโนมัติ

---

### 2. Menu Pages (`src/app/menu/[slug]/page.tsx`)

**Auto-generated metadata:**
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const menu = MENUS.find((m) => m.slug === params.slug)
  
  return generateSEO({
    title: `${menu.name}กี่แคล? ตารางโภชนาการ + วิธีทำ`,
    description: `${menu.name} มีแคลอรี่ ${menu.calories} kcal...`,
    keywords: generateKeywords(menu),
    canonicalUrl: `${siteUrl}/menu/${slug}`,
  })
}
```

**วิธีปรับแต่ง:**
1. แก้ function `generateKeywords()` ใน `src/lib/seo.ts`
2. เพิ่ม/ลด keywords ตามต้องการ

**ตัวอย่าง:**
```typescript
export function generateKeywords(menu: Menu): string[] {
  return [
    menu.name,
    `${menu.name}กี่แคล`,
    `${menu.name}สูตร`,
    `${menu.name}โภชนาการ`,
    `ทำ${menu.name}ยังไง`,
    // เพิ่มเอง
    `${menu.name}แคลต่ำ`,
    `${menu.name}ราคาเท่าไหร่`,
  ]
}
```

---

### 3. เพิ่มเมนูใหม่

**ขั้นตอน:**
1. เพิ่มข้อมูลใน `src/lib/data/menus.ts`
2. Deploy
3. Sitemap อัปเดตอัตโนมัติ
4. หน้าเมนูถูกสร้างด้วย SSG

**ตัวอย่าง:**
```typescript
{
  id: 13,
  slug: 'khao-pad-sapparot',
  name: 'ข้าวผัดสับปะรด',
  type: 'ข้าว',
  spicy_level: 0,
  price_min: 50,
  price_max: 80,
  calories: 480,
  protein: 18,
  carb: 75,
  fat: 12,
  ingredients: ['ข้าว', 'สับปะรด', 'กุ้ง', 'ไข่', 'ผักต่างๆ'],
  available_at: ['condo', 'office', 'uni'],
  reasons: {
    any: 'หวานนิดๆ อร่อยแปลกตา',
    diet: 'แคลปานกลาง เหมาะกับมื้อเที่ยง',
  },
}
```

→ หน้า `/menu/khao-pad-sapparot` ถูกสร้างอัตโนมัติ

---

## 📊 Schema.org Structured Data

### Recipe Schema (ติดอัตโนมัติทุกหน้าเมนู)

**จะแสดงใน Google Search Result แบบนี้:**
```
⭐⭐⭐⭐⭐ 4.5 (89 รีวิว)
⏱️ เวลา: 15 นาที
🔥 620 kcal
💰 50-80 บาท
```

**Code:**
```typescript
const menuSchema = generateMenuSchema(menu)

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
/>
```

### FAQ Schema (Homepage)

**จะแสดงใน SERP:**
```
❓ วันนี้กินอะไรดี?
  → ใช้ระบบสุ่มเมนูอัจฉริยะ...

❓ กะเพราหมูกรอบกี่แคล?
  → 620 kcal โปรตีน 28g...
```

---

## 🚀 SEO Best Practices

### 1. URL Structure
```
✅ Good:
/menu/khao-krapao-moo-grob
/menu/pad-thai-goong-sod

❌ Bad:
/menu?id=1
/เมนู/ข้าวกะเพราหมูกรอบ (ใช้ภาษาไทยใน URL)
```

### 2. Title Format
```
✅ Good:
"ข้าวกะเพราหมูกรอบกี่แคล? ตารางโภชนาการ + วิธีทำ | กินอะไรดีวันนี้"

❌ Bad:
"ข้าวกะเพราหมูกรอบ"
"Menu - ข้าวกะเพราหมูกรอบ - กินอะไรดีวันนี้"
```

### 3. Description (150-160 ตัวอักษร)
```typescript
✅ Good:
`${menu.name} มีแคลอรี่ ${menu.calories} kcal โปรตีน ${menu.protein}g 
คาร์บ ${menu.carb}g ราคา ${menu.price_min}-${menu.price_max} บาท 
พร้อมสูตรและวิธีทำ`

❌ Bad (สั้นเกินไป):
`ข้อมูลโภชนาการข้าวกะเพราหมูกรอบ`
```

### 4. Heading Structure
```html
<h1>ข้าวกะเพราหมูกรอบกี่แคล?</h1>        <!-- 1 ครั้งต่อหน้า -->
<h2>ตารางโภชนาการ</h2>
<h2>วัตถุดิบ</h2>
<h2>คำถามที่พบบ่อย</h2>
```

---

## 📈 การวัดผล SEO

### 1. Google Search Console

**Setup:**
1. ไปที่ https://search.google.com/search-console
2. เพิ่ม property: `https://ginariday.vercel.app`
3. Verify ownership (Vercel DNS)
4. Submit sitemap: `https://ginariday.vercel.app/sitemap.xml`

**ตรวจสอบ:**
- Impressions (คนเห็นใน Google)
- Clicks (คนคลิกเข้าเว็บ)
- Average position (อันดับเฉลี่ย)
- Coverage errors

### 2. Analytics

**Vercel Analytics (Built-in):**
- Page views
- Unique visitors
- Top pages

**Google Analytics 4:**
```typescript
// src/app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
```

---

## 🎯 Content Strategy

### Phase 1: Core Pages (เสร็จแล้ว ✅)
- Homepage
- 12 Menu pages
- Menu index

### Phase 2: Blog Articles (ต่อไป)

**10 หัวข้อ SEO:**

1. **"วันนี้กินอะไรดี? 10 เมนูง่ายๆ ราคาไม่เกิน 50 บาท"**
   - Keyword: `วันนี้กินอะไรดี` (Volume สูงมาก)
   - Create: `/blog/wan-nee-gin-arai-dee`

2. **"กะเพราหมูกรอบกี่แคล? ตารางโภชนาการแบบละเอียด"**
   - Keyword: `กะเพราหมูกรอบกี่แคล`
   - Create: `/blog/khao-krapao-gee-cal`

3. **"มีไข่ทำอะไรได้บ้าง? 15 เมนูไข่ง่ายๆ ทำเองที่บ้าน"**
   - Keyword: `มีไข่ทำอะไรได้บ้าง`
   - Create: `/blog/mee-kai-tham-arai-dai`

...และอีก 7 บทความ

**วิธีสร้าง:**
```bash
# สร้างโฟลเดอร์
mkdir -p src/app/blog/[slug]

# สร้างหน้า
touch src/app/blog/[slug]/page.tsx
```

---

## 🔧 Advanced SEO Tools

### 1. เพิ่ม Web Vitals Monitoring

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 2. Image Optimization

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
}
```

### 3. Internationalization (i18n)

```typescript
// src/middleware.ts
import { match } from '@formatjs/intl-localematcher'

export function middleware(request: NextRequest) {
  // Detect language
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'th'
  
  // Redirect /en → English version
}
```

---

## 📝 Quick Checklist

**ก่อน Deploy:**
- [ ] ตรวจสอบ metadata ทุกหน้า
- [ ] Test sitemap.xml
- [ ] Test robots.txt
- [ ] ตรวจสอบ Schema.org (Google Rich Results Test)
- [ ] Mobile-friendly test

**หลัง Deploy:**
- [ ] Submit sitemap ใน Google Search Console
- [ ] ตั้งค่า Analytics
- [ ] Monitor Core Web Vitals
- [ ] ตรวจสอบ coverage errors

---

## 🆘 SEO Troubleshooting

### ไม่ติด Google?
1. ตรวจสอบ `robots.txt` ไม่ได้ block
2. Submit sitemap ใหม่
3. Request indexing ใน Search Console
4. รอ 1-2 สัปดาห์

### Rich Snippets ไม่แสดง?
1. Test schema: https://search.google.com/test/rich-results
2. ตรวจสอบ JSON-LD ถูกต้อง
3. รอ Google crawl ใหม่

### Metadata ไม่อัปเดต?
1. Clear cache
2. Request re-indexing
3. ตรวจสอบ `<meta>` tags ใน HTML source

---

## 🎉 Summary

**ระบบ SEO ที่มีอยู่:**
- ✅ Auto-generated metadata
- ✅ Schema.org (Recipe, FAQ, Breadcrumb)
- ✅ Sitemap + Robots.txt
- ✅ OG images
- ✅ Mobile-optimized
- ✅ Fast loading (Next.js 14)

**การจัดการ:**
- แก้ไขง่าย — แค่แก้ไฟล์ `src/lib/seo.ts`
- เพิ่มเมนูใหม่ — แค่เพิ่มใน `menus.ts`
- ไม่ต้อง manual SEO แต่ละหน้า

**Ready for Production!** 🚀
