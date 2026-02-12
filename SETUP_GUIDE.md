# 🚀 กินอะไรดีวันนี้ — Next.js + Supabase Setup Guide

## 📋 Table of Contents
1. [Supabase Setup](#1-supabase-setup)
2. [Database Schema & Migrations](#2-database-schema)
3. [Environment Variables](#3-environment-variables)
4. [Local Development](#4-local-development)
5. [Deploy to Vercel](#5-deploy-to-vercel)
6. [Google OAuth Setup](#6-google-oauth-setup)

---

## 1. Supabase Setup

### Step 1.1: Create Supabase Project
1. ไปที่ https://supabase.com
2. คลิก **New Project**
3. กรอกข้อมูล:
   - **Name**: `ginariday`
   - **Database Password**: สร้างรหัสผ่านที่แข็งแรง (เก็บไว้)
   - **Region**: `Southeast Asia (Singapore)`
4. คลิก **Create new project** → รอ 2-3 นาที

### Step 1.2: เก็บ API Keys
1. ไปที่ **Settings** → **API**
2. Copy ค่าเหล่านี้:
   - `Project URL` → เป็น `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → เป็น `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Database Schema

### Step 2.1: Create Tables

ไปที่ **SQL Editor** ใน Supabase Dashboard แล้ว Run SQL ทีละขั้นตอน:

#### 2.1.1: Menus Table

\`\`\`sql
-- สร้างตาราง menus
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  spicy_level INT DEFAULT 0,
  price_min INT,
  price_max INT,
  calories INT NOT NULL,
  protein DECIMAL(5,1),
  carb DECIMAL(5,1),
  fat DECIMAL(5,1),
  ingredients TEXT[],
  available_at TEXT[],
  reasons JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- สร้าง indexes
CREATE INDEX idx_menus_type ON menus(type);
CREATE INDEX idx_menus_calories ON menus(calories);
CREATE INDEX idx_menus_spicy ON menus(spicy_level);
\`\`\`

#### 2.1.2: User History Table

\`\`\`sql
CREATE TABLE user_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_id INT REFERENCES menus(id),
  menu_name TEXT NOT NULL,
  calories INT NOT NULL,
  action TEXT NOT NULL, -- 'random' | 'fridge' | 'calorie'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_user ON user_history(user_id, created_at DESC);
\`\`\`

#### 2.1.3: User Favourites Table

\`\`\`sql
CREATE TABLE user_favourites (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_id INT REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, menu_id)
);

CREATE INDEX idx_fav_user ON user_favourites(user_id);
\`\`\`

---

### Step 2.2: Insert Sample Data

\`\`\`sql
INSERT INTO menus (slug, name, type, spicy_level, price_min, price_max, calories, protein, carb, fat, ingredients, available_at, reasons) VALUES
('khao-krapao-moo-grob', 'ข้าวกะเพราหมูกรอบ', 'ข้าว', 3, 50, 80, 620, 28.0, 72.0, 22.0, 
 ARRAY['หมู','กระเทียม','พริก','ใบกะเพรา','ข้าว','ไข่'], 
 ARRAY['condo','office','uni'],
 '{"any":"เมนูยอดนิยม อร่อยครบรส ทั้งหวาน เค็ม เผ็ด","diet":"ระวังน้ำมันหน่อย แต่โปรตีนสูงดี","protein":"หมูกรอบให้โปรตีน 28g ต่อจาน"}'::jsonb),

('pad-thai-goong-sod', 'ผัดไทยกุ้งสด', 'เส้น', 1, 60, 100, 490, 22.0, 68.0, 12.0,
 ARRAY['เส้นจันท์','กุ้ง','ไข่','ถั่วงอก','เต้าหู้','ต้นหอม'],
 ARRAY['condo','office','uni'],
 '{"any":"คลาสสิกอาหารไทย อร่อยไม่เบื่อ","diet":"แคลอรี่ปานกลาง ถ้าบอกน้ำตาลน้อยยิ่งดี"}'::jsonb),

('khao-man-gai', 'ข้าวมันไก่', 'ข้าว', 0, 40, 60, 520, 32.0, 65.0, 10.0,
 ARRAY['ไก่','ข้าว','ขิง','กระเทียม','ต้นหอม'],
 ARRAY['condo','office','uni'],
 '{"any":"ง่าย ไม่เผ็ด เหมาะทุกวัน","diet":"ไขมันต่ำที่สุดในบรรดาข้าวจานเดียว","protein":"อกไก่ให้โปรตีนสูงมากถึง 32g"}'::jsonb),

('tom-yum-goong', 'ต้มยำกุ้ง', 'ซุป', 4, 80, 150, 180, 18.0, 8.0, 8.0,
 ARRAY['กุ้ง','เห็ด','ข่า','ตะไคร้','ใบมะกรูด','พริก'],
 ARRAY['condo','office'],
 '{"any":"เมนูอาหารไทยแท้ อร่อยร้อนๆ","diet":"แคลต่ำมาก เหมาะมากสำหรับลดน้ำหนัก"}'::jsonb),

('khao-pad-khai', 'ข้าวผัดไข่', 'ข้าว', 0, 35, 50, 420, 14.0, 60.0, 14.0,
 ARRAY['ข้าว','ไข่','ต้นหอม','กระเทียม','ซีอิ๊ว'],
 ARRAY['condo','office','uni'],
 '{"any":"ทำง่าย หาได้ทุกที่ อิ่มไว ราคาถูก"}'::jsonb),

('somtum-poo-plara', 'ส้มตำปูปลาร้า', 'ยำ', 5, 40, 70, 160, 8.0, 18.0, 5.0,
 ARRAY['มะละกอ','พริก','มะเขือเทศ','ถั่วฝักยาว','ปู','ปลาร้า'],
 ARRAY['office','uni'],
 '{"any":"เมนูอีสานจัดจ้าน ถ้าชอบเผ็ดต้องลอง","diet":"แคลน้อยมากเพียง 160 kcal"}'::jsonb),

('moo-satay', 'หมูสะเต๊ะ', 'กับข้าว', 1, 50, 80, 350, 24.0, 20.0, 18.0,
 ARRAY['หมู','กะทิ','ผงกะหรี่','ผักชี','หอม'],
 ARRAY['office','uni'],
 '{"any":"หอมกลิ่นเครื่องเทศ อร่อยกลมกล่อม","protein":"เนื้อหมูล้วนๆ โปรตีนดีสำหรับฟิตเนส"}'::jsonb),

('guay-tiaw-rua', 'ก๋วยเตี๋ยวเรือหมู', 'เส้น', 2, 40, 60, 380, 20.0, 55.0, 8.0,
 ARRAY['เส้นเล็ก','หมู','เลือด','ถั่วงอก','ผักชี'],
 ARRAY['condo','office','uni'],
 '{"any":"น้ำซุปเข้มข้น อิ่มนาน คุ้มราคา"}'::jsonb),

('khao-na-ped-palo', 'ข้าวหน้าเป็ดพะโล้', 'ข้าว', 0, 60, 90, 580, 30.0, 70.0, 16.0,
 ARRAY['เป็ด','ข้าว','ห้าเครื่อง','ซีอิ๊ว','น้ำตาล'],
 ARRAY['office','uni'],
 '{"any":"เนื้อเป็ดนุ่ม น้ำพะโล้หอมหวาน","protein":"เป็ดให้โปรตีนสูงดีสำหรับวันออกกำลังกาย"}'::jsonb),

('tom-kha-gai', 'ต้มข่าไก่', 'ซุป', 2, 70, 120, 280, 20.0, 12.0, 16.0,
 ARRAY['ไก่','กะทิ','ข่า','ตะไคร้','เห็ด','พริก'],
 ARRAY['condo','office'],
 '{"any":"กลมกล่อม หอมกะทิ เหมาะวันที่อยากอาหารอ่อนๆ","diet":"ถ้าขอกะทิน้อยแคลจะลดได้","protein":"ไก่ + กะทิ ให้ทั้งโปรตีนและพลังงาน"}'::jsonb),

('kaeng-kheow-wan-gai', 'แกงเขียวหวานไก่', 'แกง', 3, 50, 80, 430, 22.0, 30.0, 24.0,
 ARRAY['ไก่','กะทิ','พริกแกงเขียว','มะเขือ','ใบโหระพา'],
 ARRAY['condo','office','uni'],
 '{"any":"แกงไทยสีเขียว หอมโหระพา รสชาติดีมาก"}'::jsonb),

('yam-woon-sen', 'ยำวุ้นเส้น', 'ยำ', 3, 40, 70, 240, 12.0, 32.0, 6.0,
 ARRAY['วุ้นเส้น','กุ้ง','หมูบด','ต้นหอม','พริก','น้ำมะนาว'],
 ARRAY['condo','office','uni'],
 '{"any":"เปรี้ยวเผ็ดหอม เรียกน้ำย่อยดีมาก","diet":"แคลปานกลาง วุ้นเส้นคาร์บต่ำกว่าเส้นทั่วไป"}'::jsonb);
\`\`\`

---

### Step 2.3: Enable Row Level Security (RLS)

**สำคัญมาก!** เพื่อความปลอดภัย ต้องเปิด RLS และสร้าง policies:

\`\`\`sql
-- Enable RLS
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favourites ENABLE ROW LEVEL SECURITY;

-- Policies สำหรับ user_history
CREATE POLICY "Users can view own history"
  ON user_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
  ON user_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history"
  ON user_history FOR DELETE
  USING (auth.uid() = user_id);

-- Policies สำหรับ user_favourites
CREATE POLICY "Users can view own favourites"
  ON user_favourites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favourites"
  ON user_favourites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favourites"
  ON user_favourites FOR DELETE
  USING (auth.uid() = user_id);

-- Menus เป็น public (ทุกคนอ่านได้)
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menus"
  ON menus FOR SELECT
  USING (true);
\`\`\`

---

## 3. Environment Variables

### Step 3.1: สร้างไฟล์ `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For local dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ อย่า commit ไฟล์นี้!** มันอยู่ใน `.gitignore` อยู่แล้ว

---

## 4. Local Development

### Step 4.1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 4.2: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

เปิด http://localhost:3000

---

## 5. Deploy to Vercel

### Step 5.1: Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ginariday.git
git push -u origin main
\`\`\`

### Step 5.2: Deploy

1. ไปที่ https://vercel.com
2. คลิก **Import Project**
3. เลือก GitHub repo `ginariday`
4. ใส่ Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → `https://ginariday.vercel.app`
5. คลิก **Deploy**

---

## 6. Google OAuth Setup

### Step 6.1: สร้าง Google OAuth Client

1. ไปที่ https://console.cloud.google.com
2. สร้าง Project ใหม่ชื่อ `ginariday`
3. ไปที่ **APIs & Services** → **Credentials**
4. คลิก **Create Credentials** → **OAuth Client ID**
5. Application type: **Web application**
6. กรอก:
   - **Name**: `Ginariday Production`
   - **Authorized redirect URIs**:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (แทน xxxxx ด้วย project ref ของคุณ)
7. Copy **Client ID** และ **Client Secret**

### Step 6.2: เพิ่มใน Supabase

1. ไปที่ Supabase Dashboard → **Authentication** → **Providers**
2. เปิด **Google**
3. วาง:
   - **Client ID**: `xxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxx`
4. คลิก **Save**

### Step 6.3: ทดสอบ

1. ไปที่ https://ginariday.vercel.app
2. คลิก **เข้าสู่ระบบ**
3. เลือก Google account
4. ควรกลับมาที่ homepage พร้อม avatar ขวาบน ✅

---

## 🎉 เสร็จแล้ว!

ตอนนี้เว็บใช้งานได้เต็มรูปแบบ:
- ✅ Login ด้วย Google OAuth
- ✅ บันทึกประวัติข้าม device
- ✅ เมนูโปรด sync ทุกเครื่อง
- ✅ Row Level Security ป้องกันข้อมูล
- ✅ Deploy บน Vercel

---

## 📚 Next Steps

### เพิ่ม Features:
- [ ] SEO: สร้างหน้า `/menu/[slug]` สำหรับแต่ละเมนู
- [ ] Analytics: เพิ่ม Vercel Analytics
- [ ] PWA: ติดตั้งเป็น app ได้
- [ ] Share: ปุ่มแชร์เมนูไป LINE/Facebook
- [ ] Export: ส่งออกประวัติเป็น CSV

### Monitoring:
- Supabase Dashboard → **Database** → ดู real-time queries
- Vercel Dashboard → **Analytics** → ดู traffic
- Vercel Dashboard → **Logs** → debug errors
