import { differenceInCalendarDays } from "date-fns";

import { dayKey, parseDayKey } from "@/lib/habit-logic";
import type { Habit } from "@/lib/habit-model";

export const ANTI_SRYV_QUESTION_KEYS = ["antiSryvQ1", "antiSryvQ2", "antiSryvQ3"] as const;
export type AntiSryvQuestionKey = (typeof ANTI_SRYV_QUESTION_KEYS)[number];

export function getAntiSryvQuestionPair(habitId: string, dateKey: string): [AntiSryvQuestionKey, AntiSryvQuestionKey] {
  const n = (habitId.length + dateKey.charCodeAt(8) + dateKey.charCodeAt(9)) % 3;
  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
  ];
  const [a, b] = pairs[n];
  return [ANTI_SRYV_QUESTION_KEYS[a], ANTI_SRYV_QUESTION_KEYS[b]];
}

export function hasAntiSryvForDate(habit: Habit, dateKey: string): boolean {
  const entry = habit.antiSryvCheckins[dateKey];
  return Boolean(entry?.answers?.length);
}

/**
 * Reflection is due when there is no entry for `todayKey` yet and at least `intervalDays`
 * calendar days have passed since the last check-in date (or `startedAt` if none).
 */
export function isAntiSryvDue(
  habit: Habit,
  intervalDays: 2 | 3,
  today: Date = new Date()
): boolean {
  const todayKey = dayKey(today);
  if (hasAntiSryvForDate(habit, todayKey)) return false;

  const priorKeys = Object.keys(habit.antiSryvCheckins)
    .filter((k) => k < todayKey)
    .sort();
  const anchor = priorKeys.length > 0 ? priorKeys[priorKeys.length - 1]! : habit.startedAt;
  const daysSince = differenceInCalendarDays(parseDayKey(todayKey), parseDayKey(anchor));
  return daysSince >= intervalDays;
}
