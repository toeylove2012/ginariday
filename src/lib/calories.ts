// src/lib/calories.ts
import { Modifier } from '@/types'

const MODIFIER_MULTIPLIER: Record<Modifier, number> = {
  normal: 1.0,
  'extra-oil': 1.2,
  'less-rice': 0.85,
  'add-egg': 1.12,
}

const MET_VALUES: Record<string, number> = {
  walking: 3.5,
  running: 8.0,
  cycling: 6.0,
  swimming: 7.0,
  yoga: 2.5,
}

export function calculateCalories(
  baseCalories: number,
  baseProtein: number,
  baseCarb: number,
  baseFat: number,
  modifier: Modifier,
  weightKg: number
) {
  const mult = MODIFIER_MULTIPLIER[modifier]

  const finalCal = Math.round(baseCalories * mult)
  const finalProtein = Math.round(baseProtein * mult)
  const finalCarb = Math.round(baseCarb * mult)
  const finalFat = Math.round(baseFat * mult)

  // Total calories from macros
  const totalMacroCalories =
    finalCarb * 4 + finalProtein * 4 + finalFat * 9

  // Macro percentages
  const macroPercent = {
    carb: Math.round((finalCarb * 4 / totalMacroCalories) * 100),
    protein: Math.round((finalProtein * 4 / totalMacroCalories) * 100),
    fat: Math.round((finalFat * 9 / totalMacroCalories) * 100),
  }

  // Burn time calculation (minutes)
  const burnMinutes = Object.fromEntries(
    Object.entries(MET_VALUES).map(([activity, met]) => [
      activity,
      Math.round(finalCal / (met * weightKg / 60)),
    ])
  )

  return {
    calories: finalCal,
    macros: {
      protein: finalProtein,
      carb: finalCarb,
      fat: finalFat,
    },
    macroPercent,
    burnMinutes,
  }
}
