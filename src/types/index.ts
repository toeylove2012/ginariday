// src/types/index.ts

export interface Menu {
  id: number
  slug: string
  name: string
  type: 'ข้าว' | 'เส้น' | 'ซุป' | 'ยำ' | 'แกง' | 'กับข้าว' | 'ของหวาน'
  spicy_level: number
  price_min: number
  price_max: number
  calories: number
  protein: number
  carb: number
  fat: number
  ingredients: string[]
  available_at: ('condo' | 'office' | 'uni' | 'market')[]
  reasons: {
    any: string
    diet?: string
    protein?: string
  }
}

export interface Ingredient {
  id: string
  name: string
  emoji: string
  category: string
}

export interface UserHistory {
  id: string
  user_id: string
  menu_id: number
  menu_name: string
  calories: number
  action: 'random' | 'fridge' | 'calorie'
  created_at: string
}

export interface UserFavourite {
  user_id: string
  menu_id: number
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Filters {
  budget: 'low' | 'mid' | 'high'
  location: 'condo' | 'office' | 'uni'
  spicy: 'any' | 'spicy' | 'mild'
  goal: 'any' | 'diet' | 'protein'
}

export type Modifier = 'normal' | 'extra-oil' | 'less-rice' | 'add-egg'

export interface CookStep {
  step_num: number
  content: string
  duration_min?: number
}
