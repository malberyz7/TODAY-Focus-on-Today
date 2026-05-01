import { calculateLongestStreak, uniqueSuccessCount } from "@/lib/habit-logic";
import type { Habit } from "@/lib/habit-model";

/** Consistency signal: best streak or total clean days, whichever is higher. */
export function habitLevelScore(habit: Habit): number {
  const longest = calculateLongestStreak(habit.completedDays);
  const total = uniqueSuccessCount(habit.completedDays);
  return Math.max(longest, total);
}

export type HabitLevelTier = 1 | 2 | 3 | 4 | 5;

/**
 * Tier boundaries (days): [0,7), [7,30), [30,90), [90,180), [180,∞).
 * Matches: Новичок → Стабильный → Сильная воля → Дисциплина → Мастер.
 */
export function getHabitLevelTier(score: number): HabitLevelTier {
  if (score < 7) return 1;
  if (score < 30) return 2;
  if (score < 90) return 3;
  if (score < 180) return 4;
  return 5;
}
