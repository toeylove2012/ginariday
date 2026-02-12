// src/lib/scoring.ts
import { Menu, Filters } from '@/types'

export function scoreMenu(
  menu: Menu,
  filters: Filters,
  recentIds: number[] = []
): number {
  let score = 50

  // Hard filter: Budget
  const budgetPass: Record<string, boolean> = {
    low: menu.price_min <= 50,
    mid: menu.price_min <= 100,
    high: true,
  }
  if (!budgetPass[filters.budget]) return -1

  // Spicy preference
  if (filters.spicy === 'spicy') {
    score += menu.spicy_level >= 3 ? 20 : menu.spicy_level < 2 ? -15 : 0
  }
  if (filters.spicy === 'mild') {
    score += menu.spicy_level <= 1 ? 20 : menu.spicy_level > 2 ? -15 : 0
  }

  // Goal: diet or protein
  if (filters.goal === 'diet') {
    if (menu.calories < 300) score += 25
    else if (menu.calories < 450) score += 10
    else if (menu.calories > 600) score -= 15
  }
  if (filters.goal === 'protein') {
    score += menu.protein >= 25 ? 25 : menu.protein >= 18 ? 12 : 0
  }

  // Location bonus
  if (menu.available_at.includes(filters.location)) score += 15

  // Anti-repeat penalty
  if (recentIds.includes(menu.id)) score -= 30

  // Controlled randomness
  score += (Math.random() - 0.5) * 30

  return Math.max(0, score)
}

export function pickRandomMenu(
  menus: Menu[],
  filters: Filters,
  recentIds: number[] = []
): Menu | null {
  const scored = menus
    .map((m) => ({ menu: m, score: scoreMenu(m, filters, recentIds) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  if (!scored.length) return null

  const top3 = scored.slice(0, Math.min(3, scored.length))
  return top3[Math.floor(Math.random() * top3.length)].menu
}
