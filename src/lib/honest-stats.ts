import { eachDayOfInterval, isBefore, startOfDay, subDays } from "date-fns";

import { calculateLongestStreak, dayKey, parseDayKey, uniqueSuccessCount } from "@/lib/habit-logic";
import type { Habit } from "@/lib/habit-model";

export type HonestStats = {
  totalCleanDays: number;
  failureDays: number;
  longestStreak: number;
  returnsAfterFailure: number;
};

/**
 * Failures = past calendar days from `startedAt` through yesterday not marked clean (today excluded).
 * Returns = times a clean day followed one or more consecutive missed days in that window.
 */
export function computeHonestStats(habit: Habit, today: Date = new Date()): HonestStats {
  const totalCleanDays = uniqueSuccessCount(habit.completedDays);
  const longestStreak = calculateLongestStreak(habit.completedDays);
  const start = parseDayKey(habit.startedAt);
  const todayStart = startOfDay(today);
  const end = subDays(todayStart, 1);
  const completed = new Set(habit.completedDays);

  if (isBefore(end, start)) {
    return { totalCleanDays, failureDays: 0, longestStreak, returnsAfterFailure: 0 };
  }

  const days = eachDayOfInterval({ start, end });
  let failureDays = 0;
  let returnsAfterFailure = 0;
  let missRun = 0;

  for (const d of days) {
    const k = dayKey(d);
    if (completed.has(k)) {
      if (missRun >= 1) returnsAfterFailure += 1;
      missRun = 0;
    } else {
      failureDays += 1;
      missRun += 1;
    }
  }

  return { totalCleanDays, failureDays, longestStreak, returnsAfterFailure };
}
