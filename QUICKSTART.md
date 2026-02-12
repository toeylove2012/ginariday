# 🚀 QUICKSTART — กินอะไรดีวันนี้ (Next.js)

## 📦 แตกไฟล์

```bash
tar -xzf ginariday-nextjs.tar.gz
cd ginariday-nextjs
```

---

## ⚡ วิธีรันเร็วสุด (5 นาที)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase (2 นาที)

#### 2.1 สร้าง Project
1. ไปที่ https://supabase.com → **New Project**
2. Name: `ginariday`, Region: `Singapore`
3. รอ 2 นาที

#### 2.2 Run SQL Migrations
1. ไปที่ **SQL Editor**
2. Copy-paste SQL จาก `SETUP_GUIDE.md` (Section 2.1-2.3)
3. Run ทีละ section:
   - ✅ Create Tables (menus, user_history, user_favourites)
   - ✅ Insert Sample Data (12 เมนู)
   - ✅ Enable RLS Policies

#### 2.3 Get API Keys
1. ไปที่ **Settings** → **API**
2. Copy:
   - Project URL
   - anon public key

### 3. สร้างไฟล์ `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

เปิด **http://localhost:3000** ✅

---

## 🔐 Enable Google Login (Optional — 5 นาที)

### 1. Google Cloud Console
1. https://console.cloud.google.com
2. Create Project → `ginariday`
3. **APIs & Services** → **Credentials**
4. **Create OAuth Client ID** → Web application
5. Authorized redirect URIs:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** + **Client Secret**

### 2. Supabase Dashboard
1. **Authentication** → **Providers** → **Google**
2. Paste Client ID + Secret
3. Save ✅

### 3. ทดสอบ
1. Refresh localhost:3000
2. คลิก **เข้าสู่ระบบ**
3. เลือก Google account
4. ควรเห็น Avatar ขวาบน ✅

---

## 📂 Project Structure

```
ginariday-nextjs/
├── README.md                 # Overview + Tech Stack
├── SETUP_GUIDE.md            # Full deployment guide
├── package.json
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage
│   │   ├── layout.tsx        # Root layout
│   │   └── auth/callback/    # OAuth redirect
│   ├── components/
│   │   ├── Header.tsx        # Login / Avatar
│   │   ├── LoginModal.tsx    # Google OAuth modal
│   │   ├── ProfileModal.tsx  # User profile + history
│   │   └── ...               # RandomMenu, FridgeFinder, etc
│   ├── lib/
│   │   ├── supabase/         # Client + Server
│   │   ├── data/             # Menus + Ingredients
│   │   ├── scoring.ts        # Algorithm
│   │   └── calories.ts       # Calculator
│   └── types/                # TypeScript interfaces
└── .env.local                # ⚠️ สร้างเอง (ดูด้านบน)
```

---

## 🎯 Features Included

✅ **Supabase Auth** — Google OAuth real login  
✅ **Database Sync** — ข้ามเครื่อง/เบราว์เซอร์  
✅ **Row Level Security** — แต่ละคนเห็นแค่ของตัวเอง  
✅ **TypeScript** — Type-safe  
✅ **Tailwind CSS** — Responsive mobile-first  
✅ **12 Thai Menus** — Ready to use  
✅ **Weighted Algorithm** — Smart random (not Math.random())  

🚧 **Components ยังไม่เสร็จ** (HTML version มีครบ):
- RandomMenu filters/results
- FridgeFinder ingredient grid
- CalorieCalculator modifiers

👉 **ใช้ HTML version** (`ginariday.html`) สำหรับ full UI  
👉 **ใช้ Next.js version** สำหรับ production + auth + database

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ginariday.git
git push -u origin main

# 2. Import in Vercel
# - https://vercel.com
# - Import Project → Select GitHub repo
# - Add Environment Variables (same as .env.local)
# - Deploy ✅

# 3. Update Google OAuth
# - Add production URL to redirect URIs:
#   https://ginariday.vercel.app/auth/callback
```

---

## 📚 Documentation

- **README.md** — Overview, tech stack, database schema
- **SETUP_GUIDE.md** — Step-by-step full deployment
- **QUICKSTART.md** — This file (5 min setup)

---

## 🆘 Troubleshooting

### ❌ "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Supabase auth not working
1. ตรวจสอบ `.env.local` ถูกต้อง
2. ตรวจสอบ Google OAuth redirect URI ตรงกัน
3. ดู Supabase Logs → Authentication

### ❌ RLS error: "new row violates row-level security policy"
Run SQL policies อีกครั้ง (Section 2.3 ใน SETUP_GUIDE.md)

---

## ✅ Checklist

- [ ] ติดตั้ง dependencies (`npm install`)
- [ ] สร้าง Supabase project
- [ ] Run SQL migrations (tables + RLS)
- [ ] สร้างไฟล์ `.env.local`
- [ ] Run `npm run dev`
- [ ] Setup Google OAuth (optional)
- [ ] Test login + profile
- [ ] Deploy to Vercel (optional)

---

## 🎉 Done!

เว็บพร้อมใช้งานแล้ว ✅

**Next Steps:**
1. ดูเอกสารเพิ่มเติมใน `README.md`
2. Deploy production ใน `SETUP_GUIDE.md`
3. Customize UI/UX ตามต้องการ
4. เพิ่ม SEO pages `/menu/[slug]`

Happy coding! 🚀
