// src/lib/data/ingredients.ts
import { Ingredient } from '@/types'

export const INGREDIENTS: Ingredient[] = [
  { id: 'egg', name: 'ไข่', emoji: '🥚', category: 'โปรตีน' },
  { id: 'pork', name: 'หมู', emoji: '🥩', category: 'โปรตีน' },
  { id: 'chicken', name: 'ไก่', emoji: '🍗', category: 'โปรตีน' },
  { id: 'rice', name: 'ข้าว', emoji: '🍚', category: 'คาร์บ' },
  { id: 'noodle', name: 'เส้น', emoji: '🍜', category: 'คาร์บ' },
  { id: 'garlic', name: 'กระเทียม', emoji: '🧄', category: 'เครื่องเทศ' },
  { id: 'chili', name: 'พริก', emoji: '🌶️', category: 'เครื่องเทศ' },
  { id: 'basil', name: 'กะเพรา', emoji: '🌿', category: 'ผัก' },
  { id: 'onion', name: 'หัวหอม', emoji: '🧅', category: 'ผัก' },
  { id: 'soysauce', name: 'ซีอิ๊ว', emoji: '🫙', category: 'เครื่องปรุง' },
  { id: 'shrimp', name: 'กุ้ง', emoji: '🦐', category: 'โปรตีน' },
  { id: 'mushroom', name: 'เห็ด', emoji: '🍄', category: 'ผัก' },
  { id: 'coconut', name: 'กะทิ', emoji: '🥥', category: 'อื่นๆ' },
  { id: 'lemon', name: 'มะนาว', emoji: '🍋', category: 'ผลไม้' },
  { id: 'tomato', name: 'มะเขือเทศ', emoji: '🍅', category: 'ผัก' },
  { id: 'tofu', name: 'เต้าหู้', emoji: '⬜', category: 'โปรตีน' },
  { id: 'beansprout', name: 'ถั่วงอก', emoji: '🌱', category: 'ผัก' },
  { id: 'duck', name: 'เป็ด', emoji: '🦆', category: 'โปรตีน' },
]

export const INGREDIENT_MAP: Record<string, string[]> = {
  egg: ['ข้าว', 'ไข่'],
  pork: ['หมู'],
  chicken: ['ไก่'],
  rice: ['ข้าว'],
  noodle: ['เส้น', 'เส้นเล็ก', 'เส้นจันท์', 'วุ้นเส้น'],
  garlic: ['กระเทียม'],
  chili: ['พริก'],
  basil: ['ใบกะเพรา', 'ใบโหระพา'],
  onion: ['หัวหอม', 'หอม', 'ต้นหอม'],
  soysauce: ['ซีอิ๊ว'],
  shrimp: ['กุ้ง'],
  mushroom: ['เห็ด'],
  coconut: ['กะทิ'],
  lemon: ['น้ำมะนาว'],
  tomato: ['มะเขือเทศ', 'มะเขือ'],
  tofu: ['เต้าหู้'],
  beansprout: ['ถั่วงอก'],
  duck: ['เป็ด'],
}
