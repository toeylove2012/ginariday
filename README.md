# 🍜 กินอะไรดีวันนี้ (Ginariday)

**Thai Food Decision Engine** — Next.js 14 + Supabase + Google OAuth

สุ่มเมนูอาหารไทย ค้นหาเมนูจากวัตถุดิบในตู้เย็น คำนวณแคลอรี่

---

## ✨ Features

- 🎲 **สุ่มเมนูอาหาร** — Weighted scoring algorithm (ไม่ใช่ random ธรรมดา)
- 🥚 **ค้นหาจากตู้เย็น** — เลือกวัตถุดิบ → แสดงเมนูที่ทำได้พร้อมวิธีทำ
- 🔥 **คำนวณแคลอรี่** — Macro breakdown + เวลาเผาผลาญ (เดิน/วิ่ง/ปั่น)
- 🔐 **Google OAuth** — Login จริง sync ข้าม device
- ❤️ **Favourites** — บันทึกเมนูโปรด
- 📊 **History** — ประวัติการสุ่ม/คำนวณทั้งหมด
- 📱 **Mobile First** — Responsive UI ใช้งานง่าย
- 🔒 **RLS Security** — แต่ละคนเห็นแค่ข้อมูลตัวเอง

---

## 🚀 Quick Start

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/ginariday-nextjs.git
cd ginariday-nextjs
npm install
\`\`\`

### 2. Setup Supabase
อ่านละเอียดใน [SETUP_GUIDE.md](./SETUP_GUIDE.md)

สรุปสั้นๆ:
1. สร้าง Supabase project
2. Run SQL migrations (ใน SETUP_GUIDE.md)
3. Enable Google OAuth

### 3. Environment Variables
สร้างไฟล์ `.env.local`:
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 4. Run
\`\`\`bash
npm run dev
\`\`\`

เปิด http://localhost:3000

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Supabase** | Database + Auth + Realtime |
| **Supabase Auth** | Google OAuth + Session |
| **Vercel** | Hosting |

---

## 🗃️ Database Schema

### Tables

\`\`\`
menus
  ├─ id (serial)
  ├─ name, type, calories, protein, carb, fat
  ├─ spicy_level, price_min, price_max
  ├─ ingredients (text[])
  └─ reasons (jsonb)

user_history
  ├─ id (uuid)
  ├─ user_id → auth.users
  ├─ menu_id → menus
  ├─ action ('random' | 'fridge' | 'calorie')
  └─ created_at

user_favourites
  ├─ user_id → auth.users
  └─ menu_id → menus (primary key)
\`\`\`

---

## 🧮 Algorithms

### 1. Weighted Random Menu Selection
ไม่ใช่ `Math.random()` ธรรมดา แต่ให้คะแนนตาม:
- งบประมาณ (hard filter)
- ความเผ็ด (+20 / -15 pts)
- เป้าหมาย: diet (+25 ถ้าแคลต่ำ), protein (+25 ถ้า >25g)
- สถานที่ (+15 pts)
- Anti-repeat (-30 pts)
- Randomness (±15 pts)

→ Pick จาก top 3 แบบ weighted

### 2. Ingredient Matching
- Expand ingredient aliases (เช่น "ข้าว" → ["ข้าว", "ข้าวสวย"])
- คำนวณ coverage = matched / total
- เรียงตาม coverage desc
- แสดงวิธีทำทีละขั้น

### 3. Calorie Calculation
- Base calories × modifier (1.0 / 1.2 / 0.85)
- Macro breakdown (carb/protein/fat percentages)
- Burn time = calories / (MET × weight / 60)

---

## 📂 Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind + animations
│   └── auth/
│       └── callback/       # OAuth redirect handler
│           └── route.ts
├── components/
│   ├── Header.tsx          # Login button / Avatar
│   ├── Hero.tsx            # 🤔 วันนี้กินอะไรดี?
│   ├── TabNav.tsx          # Tab switcher
│   ├── RandomMenu.tsx      # 🎲 Section
│   ├── FridgeFinder.tsx    # 🥚 Section
│   ├── CalorieCalculator.tsx # 🔥 Section
│   ├── LoginModal.tsx      # Google OAuth modal
│   └── ProfileModal.tsx    # User profile drawer
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server client
│   ├── data/
│   │   ├── menus.ts        # 12 Thai menus
│   │   └── ingredients.ts  # 18 ingredients
│   ├── scoring.ts          # Weighted algorithm
│   └── calories.ts         # Calorie calculator
├── types/
│   └── index.ts            # TypeScript interfaces
└── middleware.ts           # Auth refresh
\`\`\`

---

## 🔐 Security

### Row Level Security (RLS)
ทุก user เห็นแค่ข้อมูลตัวเอง:

\`\`\`sql
-- user_history
CREATE POLICY "Users can view own history"
  ON user_history FOR SELECT
  USING (auth.uid() = user_id);

-- user_favourites
CREATE POLICY "Users can view own favourites"
  ON user_favourites FOR SELECT
  USING (auth.uid() = user_id);
\`\`\`

Menus = public read-only

---

## 📊 Analytics & Monitoring

### Supabase Dashboard
- **Database** → Table Editor: ดูข้อมูล real-time
- **Authentication** → Users: ดูจำนวน users
- **Logs** → Error logs

### Vercel Dashboard
- **Analytics**: Page views, unique visitors
- **Speed Insights**: Performance metrics
- **Logs**: Runtime logs

---

## 🚀 Deploy to Production

### Vercel (แนะนำ)
\`\`\`bash
npx vercel --prod
\`\`\`

หรือ:
1. Push to GitHub
2. Import ใน Vercel
3. ใส่ Environment Variables
4. Deploy

### Environment Variables (Production)
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=https://ginariday.vercel.app
\`\`\`

**อย่าลืม!** Update Google OAuth Redirect URI เป็น production URL

---

## 📝 TODO / Roadmap

- [ ] SEO: หน้า `/menu/[slug]` พร้อม Schema.org
- [ ] Blog: บทความ SEO (กะเพราหมูกรอบกี่แคล)
- [ ] PWA: Install as app
- [ ] Share: ปุ่มแชร์เมนู → LINE/Facebook
- [ ] Export: ส่งออกประวัติเป็น CSV
- [ ] Admin: Dashboard จัดการเมนู
- [ ] i18n: รองรับภาษาอังกฤษ
- [ ] Dark mode

---

## 🤝 Contributing

PRs welcome! กรุณา:
1. Fork repo
2. Create feature branch
3. Commit changes
4. Push & create PR

---

## 📄 License

MIT License — ใช้ได้ฟรีทั้ง personal และ commercial

---

## 👨‍💻 Author

Created by Claude (Anthropic AI) + Your Name

---

## 🙏 Credits

- Fonts: **Sarabun** & **Mitr** (Google Fonts)
- Icons: Emoji
- Database: Supabase
- Hosting: Vercel
"# ginariday" 
"# ginariday" 
