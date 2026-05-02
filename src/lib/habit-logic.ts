import {
  eachDayOfInterval,
  differenceInCalendarDays,
  format,
  isBefore,
  isValid,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";

/** Calendar day key in local timezone — YYYY-MM-DD (matches calendar cells; not UTC `toISOString().split("T")[0]`). */
export function dayKey(d: Date): string {
  return format(startOfDay(d), "yyyy-MM-dd");
}

/** Today’s completion key — local YYYY-MM-DD, same format as `HabitCalendar` day keys. */
export function todayCompletionDateKey(): string {
  return dayKey(new Date());
}

/**
 * Coerces stored / legacy date strings to canonical YYYY-MM-DD (zero-padded).
 * Rejects invalid calendar dates.
 */
export function normalizeCalendarDateKey(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = parseISO(`${s}T12:00:00`);
    return isValid(d) ? format(startOfDay(d), "yyyy-MM-dd") : null;
  }
  const loose = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (loose) {
    const y = Number(loose[1]);
    const mo = Number(loose[2]);
    const da = Number(loose[3]);
    if (!Number.isFinite(y) || mo < 1 || mo > 12 || da < 1 || da > 31) return null;
    const key = `${y}-${String(mo).padStart(2, "0")}-${String(da).padStart(2, "0")}`;
    const d = parseISO(`${key}T12:00:00`);
    return isValid(d) ? format(startOfDay(d), "yyyy-MM-dd") : null;
  }
  const d = parseISO(s.includes("T") ? s : `${s}T12:00:00`);
  return isValid(d) ? format(startOfDay(d), "yyyy-MM-dd") : null;
}

export function parseDayKey(key: string): Date {
  return startOfDay(parseISO(`${key}T12:00:00`));
}

/** Dedupe + sort date keys for stable storage (canonical YYYY-MM-DD). */
export function sortUniqueDateKeys(dates: readonly string[]): string[] {
  const normalized = dates
    .map((d) => normalizeCalendarDateKey(d))
    .filter((x): x is string => x != null);
  return [...new Set(normalized)].sort();
}

/**
 * Toggle a calendar day in the completed-days list (add if missing, remove if present).
 */
export function toggleDateInList(dates: readonly string[], dateKey: string): string[] {
  const k = normalizeCalendarDateKey(dateKey);
  if (!k) return sortUniqueDateKeys([...dates]);
  const set = new Set(sortUniqueDateKeys([...dates]));
  if (set.has(k)) set.delete(k);
  else set.add(k);
  return [...set].sort();
}

export function uniqueSuccessCount(completedDays: string[]): number {
  return new Set(completedDays).size;
}

export function isInfiniteGoal(goalDays: number | null): goalDays is null {
  return goalDays === null;
}

/** Finite goal only — percent toward fixed day count. */
export function calculateFiniteProgress(completedDays: string[], goalDays: number) {
  const completed = uniqueSuccessCount(completedDays);
  const percent = goalDays > 0 ? Math.min(100, Math.round((completed / goalDays) * 100)) : 0;
  const remaining = Math.max(0, goalDays - completed);
  return { completed, percent, remaining };
}

/** @deprecated Use calculateFiniteProgress + isInfiniteGoal; kept for clarity in call sites. */
export function calculateProgress(completedDays: string[], goalDays: number) {
  return calculateFiniteProgress(completedDays, goalDays);
}

/**
 * Streak: consecutive completed days ending at the most recent applicable day.
 * Today is skipped if not yet marked so yesterday can still continue the run.
 */
export function calculateStreak(completedDays: string[], today: Date = new Date()): number {
  const set = new Set(completedDays);
  const todayK = dayKey(today);
  let cursor = startOfDay(today);
  let streak = 0;
  let allowSkipToday = !set.has(todayK);

  for (let i = 0; i < 4000; i++) {
    const k = dayKey(cursor);
    if (set.has(k)) {
      streak += 1;
      cursor = subDays(cursor, 1);
      continue;
    }
    if (allowSkipToday && k === todayK) {
      cursor = subDays(cursor, 1);
      allowSkipToday = false;
      continue;
    }
    break;
  }

  return streak;
}

/** Longest run of consecutive calendar days present in `completedDays`. */
export function calculateLongestStreak(completedDays: string[]): number {
  const sorted = sortUniqueDateKeys([...completedDays]);
  if (sorted.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const d0 = parseDayKey(sorted[i - 1]);
    const d1 = parseDayKey(sorted[i]);
    if (differenceInCalendarDays(d1, d0) === 1) {
      run += 1;
    } else {
      best = Math.max(best, run);
      run = 1;
    }
  }
  return Math.max(best, run);
}

/** Milestone day counts for lifetime mode. */
export const INFINITE_MILESTONE_DAYS = [7, 14, 30, 60, 90, 180, 365] as const;

export type InfiniteMilestoneProgress = {
  prev: number;
  next: number | null;
  /** 0–100 between `prev` and `next` (or 100 if all unlocked). */
  progressToNext: number;
  allUnlocked: boolean;
};

export function getInfiniteMilestoneProgress(totalCleanDays: number): InfiniteMilestoneProgress {
  const tiers = INFINITE_MILESTONE_DAYS;
  const last = tiers[tiers.length - 1];
  if (totalCleanDays >= last) {
    return { prev: last, next: null, progressToNext: 100, allUnlocked: true };
  }
  let prev = 0;
  let next: number = tiers[0];
  for (let i = 0; i < tiers.length; i++) {
    if (totalCleanDays < tiers[i]) {
      next = tiers[i];
      prev = i === 0 ? 0 : tiers[i - 1];
      break;
    }
  }
  const span = next - prev;
  const raw = span <= 0 ? 100 : ((totalCleanDays - prev) / span) * 100;
  const progressToNext = Math.min(100, Math.max(0, Math.round(raw)));
  return { prev, next, progressToNext, allUnlocked: false };
}

export function missedDaysInPast(
  startedAtKey: string,
  completedDays: string[],
  today: Date = new Date()
): number {
  const set = new Set(completedDays);
  const start = parseDayKey(startedAtKey);
  const yesterday = subDays(startOfDay(today), 1);
  if (isBefore(yesterday, start)) return 0;

  const days = eachDayOfInterval({ start, end: yesterday });
  return days.filter((d) => !set.has(dayKey(d))).length;
}

export function hasMissedPastDays(
  startedAtKey: string,
  completedDays: string[],
  today: Date = new Date()
): boolean {
  return missedDaysInPast(startedAtKey, completedDays, today) > 0;
}

export function isTodaySuccess(completedDays: string[], today: Date = new Date()): boolean {
  return new Set(completedDays).has(dayKey(today));
}

export function unlockedMilestones(percent: number): number[] {
  const tiers = [25, 50, 75, 100];
  return tiers.filter((t) => percent >= t);
}

/** Keys (YYYY-MM-DD) that have a non-empty trimmed note */
export function datesWithNotes(notes: Record<string, string>): Set<string> {
  const s = new Set<string>();
  for (const [k, v] of Object.entries(notes)) {
    if (v && v.trim()) s.add(k);
  }
  return s;
}
