import { dayKey, sortUniqueDateKeys } from "@/lib/habit-logic";

/** Max length per motivation answer (persist + UI). */
export const MOTIVATION_ANSWER_MAX_CHARS = 800;

export type HabitMotivation = {
  why: string;
  benefit: string;
  loss: string;
};

/** Reflection check-in for a calendar day (anti-autopilot). */
export type AntiSryvDayEntry = {
  answers: string[];
  /** Optional snapshot of which prompts were shown */
  questions?: string[];
};

/** Morning + evening ritual fields for one calendar day. */
export type RitualDayEntry = {
  morningFocus: string;
  /** "yes" | "no" | "" */
  eveningResult: string;
  eveningNote: string;
};

export type Habit = {
  id: string;
  name: string;
  /** `null` = lifetime / no fixed goal (infinite mode) */
  goalDays: number | null;
  /** YYYY-MM-DD — unique, sorted */
  completedDays: string[];
  startedAt: string;
  /** Journal entries keyed by YYYY-MM-DD */
  notes: Record<string, string>;
  /** Written at creation — surfaced in recovery mode */
  motivation: HabitMotivation;
  /** YYYY-MM-DD → reflection answers */
  antiSryvCheckins: Record<string, AntiSryvDayEntry>;
  /** YYYY-MM-DD → rituals */
  rituals: Record<string, RitualDayEntry>;
};

/** Legacy persisted shape before `completedDays` + `notes`. */
export type LegacyHabit = Partial<Habit> & {
  successDates?: string[];
};

export function emptyMotivation(): HabitMotivation {
  return { why: "", benefit: "", loss: "" };
}

const RITUAL_FIELD_MAX = 600;

export function emptyRitualDay(): RitualDayEntry {
  return { morningFocus: "", eveningResult: "", eveningNote: "" };
}

function normalizeAntiSryv(raw: unknown): Record<string, AntiSryvDayEntry> {
  const out: Record<string, AntiSryvDayEntry> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!k.match(/^\d{4}-\d{2}-\d{2}$/) || !v || typeof v !== "object" || Array.isArray(v)) continue;
    const o = v as Record<string, unknown>;
    const answers = Array.isArray(o.answers)
      ? o.answers.map((a) => String(a ?? "").trim().slice(0, RITUAL_FIELD_MAX)).filter(Boolean)
      : [];
    const questions = Array.isArray(o.questions)
      ? o.questions.map((q) => String(q ?? "").trim().slice(0, 120)).filter(Boolean)
      : undefined;
    if (answers.length) out[k] = { answers, ...(questions?.length ? { questions } : {}) };
  }
  return out;
}

function normalizeRituals(raw: unknown): Record<string, RitualDayEntry> {
  const out: Record<string, RitualDayEntry> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!k.match(/^\d{4}-\d{2}-\d{2}$/) || !v || typeof v !== "object" || Array.isArray(v)) continue;
    const o = v as Record<string, unknown>;
    const eveningResultRaw = String(o.eveningResult ?? "").toLowerCase();
    const eveningResult = eveningResultRaw === "yes" || eveningResultRaw === "no" ? eveningResultRaw : "";
    out[k] = {
      morningFocus: String(o.morningFocus ?? "")
        .trim()
        .slice(0, RITUAL_FIELD_MAX),
      eveningResult,
      eveningNote: String(o.eveningNote ?? "")
        .trim()
        .slice(0, RITUAL_FIELD_MAX),
    };
  }
  return out;
}

function normalizeMotivation(raw: unknown): HabitMotivation {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return emptyMotivation();
  }
  const o = raw as Record<string, unknown>;
  const clip = (v: unknown) =>
    String(v ?? "")
      .trim()
      .slice(0, MOTIVATION_ANSWER_MAX_CHARS);
  return {
    why: clip(o.why),
    benefit: clip(o.benefit),
    loss: clip(o.loss),
  };
}

function normalizeGoalDays(raw: LegacyHabit): number | null {
  if (raw.goalDays === null) return null;
  if (typeof raw.goalDays === "number" && Number.isFinite(raw.goalDays)) {
    return Math.max(1, Math.min(3650, Math.round(raw.goalDays)));
  }
  if (raw.goalDays === undefined) {
    return Math.max(1, Math.min(3650, 30));
  }
  return Math.max(1, Math.min(3650, Number(raw.goalDays) || 30));
}

/**
 * Normalizes persisted habits: maps legacy `successDates` → `completedDays`, fills `notes`, preserves `goalDays: null`.
 */
export function ensureHabit(raw: LegacyHabit): Habit {
  const legacyDays = Array.isArray(raw.successDates) ? raw.successDates : [];
  const nextDays = Array.isArray(raw.completedDays) ? raw.completedDays : legacyDays;
  const completedDays = sortUniqueDateKeys(nextDays);

  const notes: Record<string, string> = {};
  if (raw.notes && typeof raw.notes === "object" && !Array.isArray(raw.notes)) {
    for (const [k, v] of Object.entries(raw.notes)) {
      if (typeof v === "string" && k.match(/^\d{4}-\d{2}-\d{2}$/)) {
        notes[k] = v;
      }
    }
  }

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    goalDays: normalizeGoalDays(raw),
    completedDays,
    startedAt: String(raw.startedAt || dayKey(new Date())),
    notes,
    motivation: normalizeMotivation(raw.motivation),
    antiSryvCheckins: normalizeAntiSryv(raw.antiSryvCheckins),
    rituals: normalizeRituals(raw.rituals),
  };
}
