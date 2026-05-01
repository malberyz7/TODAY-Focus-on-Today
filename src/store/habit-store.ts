"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { format, startOfDay, subDays } from "date-fns";

import {
  ensureHabit,
  type AntiSryvDayEntry,
  type Habit,
  type HabitMotivation,
  type LegacyHabit,
  type RitualDayEntry,
  emptyRitualDay,
} from "@/lib/habit-model";
import { dayKey, sortUniqueDateKeys, toggleDateInList } from "@/lib/habit-logic";
import { NOTE_MAX_CHARS } from "@/lib/note-limits";

export type { Habit, HabitMotivation, AntiSryvDayEntry, RitualDayEntry } from "@/lib/habit-model";

export type AntiSryvIntervalDays = 2 | 3;
const HAS_INITIALIZED_APP_KEY = "hasInitializedApp";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Demo habits with realistic gaps + a sample journal line */
function createSeedHabits(now: Date = new Date()): Habit[] {
  const today = startOfDay(now);
  const k = (n: number) => format(subDays(today, n), "yyyy-MM-dd");
  const todayKey = k(0);

  return [
    {
      id: "seed-scroll",
      name: "Бессмысленный скроллинг ночью",
      goalDays: 30,
      startedAt: k(14),
      completedDays: sortUniqueDateKeys([
        k(13),
        k(12),
        k(11),
        k(10),
        k(9),
        k(8),
        k(6),
        k(5),
        k(4),
        k(3),
        k(2),
        k(1),
      ]),
      notes: {
        [todayKey]: "Сегодня спокойнее — книга вместо ленты.",
      },
      antiSryvCheckins: {
        [todayKey]: {
          answers: ["Да, осознанно.", "Вечер — главный триггер."],
          questions: ["antiSryvQ1", "antiSryvQ2"],
        },
      },
      motivation: {
        why: "Хочу просыпаться ясным, а не разбитым от бессонницы в телефоне.",
        benefit: "Больше энергии утром и спокойнее голова перед сном.",
        loss: "Потеряю здоровье сна и чувство контроля над вечером.",
      },
      rituals: {},
    },
    {
      id: "seed-sugar",
      name: "Стресс-перекусы и лишний сахар",
      goalDays: 60,
      startedAt: k(22),
      completedDays: sortUniqueDateKeys(
        Array.from({ length: 18 }, (_, i) => k(21 - i)).filter((_, idx) => idx !== 6)
      ),
      notes: {
        [k(2)]: "Тяга была, но прошла после прогулки.",
      },
      antiSryvCheckins: {
        [todayKey]: {
          answers: ["Стараюсь честно отмечать.", "Стресс на работе."],
          questions: ["antiSryvQ1", "antiSryvQ3"],
        },
      },
      motivation: {
        why: "Хочу перестать «заедать» стресс и чувствовать тяжесть после сладкого.",
        benefit: "Ровнее энергия и уважение к своему телу.",
        loss: "Сахар снова будет управлять настроением и самооценкой.",
      },
      rituals: {},
    },
    {
      id: "seed-procrastination",
      name: "Откладывание глубокой работы",
      goalDays: 90,
      startedAt: k(9),
      completedDays: sortUniqueDateKeys([k(8), k(7), k(5), k(4), k(3), k(2), k(1)]),
      notes: {},
      antiSryvCheckins: {
        [todayKey]: {
          answers: ["Да.", "Старт дня — самое сложное."],
          questions: ["antiSryvQ1", "antiSryvQ2"],
        },
      },
      motivation: {
        why: "Хочу начинать важное без бесконечного «ещё минуту».",
        benefit: "Глубокая работа станет привычкой, не исключением.",
        loss: "Так и останусь в режиме срочного, но не важного.",
      },
      rituals: {},
    },
  ];
}

type HabitState = {
  habits: Habit[];
  settings: { antiSryvIntervalDays: AntiSryvIntervalDays };
  antiSryvModalHabitId: string | null;
  openAntiSryvModal: (habitId: string) => void;
  closeAntiSryvModal: () => void;
  setAntiSryvInterval: (days: AntiSryvIntervalDays) => void;
  saveAntiSryvCheckin: (habitId: string, dateKey: string, entry: AntiSryvDayEntry) => void;
  patchRitual: (habitId: string, dateKey: string, patch: Partial<RitualDayEntry>) => void;
  /** Run once after hydration: migrate + first-launch seeding guarded by localStorage flag. */
  initializeApp: () => void;
  /** Maps legacy `successDates` → `completedDays`, fills `notes`. */
  migrateLegacyHabits: () => void;
  addHabit: (name: string, goalDays: number | null, motivation: HabitMotivation) => void;
  removeHabit: (id: string) => void;
  toggleDay: (habitId: string, dateKey: string) => void;
  /** Persist trimmed note; empty / whitespace removes that date key. */
  setNote: (habitId: string, dateKey: string, text: string) => void;
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      settings: { antiSryvIntervalDays: 2 },
      antiSryvModalHabitId: null,

      openAntiSryvModal: (habitId) => set({ antiSryvModalHabitId: habitId }),

      closeAntiSryvModal: () => set({ antiSryvModalHabitId: null }),

      setAntiSryvInterval: (days) =>
        set(() => ({
          settings: { antiSryvIntervalDays: days === 3 ? 3 : 2 },
        })),

      saveAntiSryvCheckin: (habitId, dateKey, entry) => {
        if (!entry.answers.length) return;
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            return {
              ...h,
              antiSryvCheckins: {
                ...h.antiSryvCheckins,
                [dateKey]: {
                  answers: entry.answers,
                  ...(entry.questions?.length ? { questions: entry.questions } : {}),
                },
              },
            };
          }),
        }));
      },

      patchRitual: (habitId, dateKey, patch) => {
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const prev = h.rituals[dateKey] ?? emptyRitualDay();
            const merged: RitualDayEntry = { ...prev, ...patch };
            const rituals = { ...h.rituals };
            const emptyEvening = !merged.eveningResult;
            const noText = !merged.morningFocus.trim() && !merged.eveningNote.trim();
            if (emptyEvening && noText) {
              delete rituals[dateKey];
            } else {
              rituals[dateKey] = merged;
            }
            return { ...h, rituals };
          }),
        }));
      },

      initializeApp: () => {
        // 1) Normalize persisted shape first.
        get().migrateLegacyHabits();

        // 2) Respect one-time first-launch seeding.
        const hasInitialized = (() => {
          try {
            return localStorage.getItem(HAS_INITIALIZED_APP_KEY) === "true";
          } catch {
            return true;
          }
        })();

        if (!hasInitialized && get().habits.length === 0) {
          set({ habits: createSeedHabits() });
        }

        try {
          localStorage.setItem(HAS_INITIALIZED_APP_KEY, "true");
        } catch {
          /* ignore */
        }
      },

      migrateLegacyHabits: () => {
        set((s) => ({
          habits: s.habits
            .map((h) => ensureHabit(h as LegacyHabit))
            .filter((h) => Boolean(h.id)),
          settings: {
            antiSryvIntervalDays: s.settings?.antiSryvIntervalDays === 3 ? 3 : 2,
          },
        }));
      },

      addHabit: (name, goalDays, motivation) => {
        const trimmed = name.trim();
        const why = motivation.why.trim();
        const benefit = motivation.benefit.trim();
        const loss = motivation.loss.trim();
        if (!trimmed || !why || !benefit || !loss) return;
        const resolvedGoal =
          goalDays === null
            ? null
            : Math.max(1, Math.min(3650, Math.round(Number(goalDays) || 30)));
        const start = dayKey(new Date());
        set((s) => ({
          habits: [
            ...s.habits,
            {
              id: newId(),
              name: trimmed,
              goalDays: resolvedGoal,
              completedDays: [],
              startedAt: start,
              notes: {},
              motivation: { why, benefit, loss },
              antiSryvCheckins: {},
              rituals: {},
            },
          ],
        }));
      },

      removeHabit: (id) => {
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
      },

      toggleDay: (habitId, dateKey) => {
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id !== habitId ? h : { ...h, completedDays: toggleDateInList(h.completedDays, dateKey) }
          ),
        }));
      },

      setNote: (habitId, dateKey, text) => {
        const capped = text.slice(0, NOTE_MAX_CHARS);
        const trimmed = capped.trim();
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const notes = { ...h.notes };
            if (!trimmed) {
              delete notes[dateKey];
            } else {
              notes[dateKey] = trimmed;
            }
            return { ...h, notes };
          }),
        }));
      },
    }),
    {
      name: "habit-break-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        habits: state.habits,
        settings: state.settings,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<Pick<HabitState, "habits" | "settings">> | undefined;
        return {
          ...current,
          habits: Array.isArray(p?.habits)
            ? p.habits.map((h) => ensureHabit(h as LegacyHabit))
            : current.habits,
          settings: {
            antiSryvIntervalDays: p?.settings?.antiSryvIntervalDays === 3 ? 3 : 2,
          },
          antiSryvModalHabitId: null,
        };
      },
    }
  )
);
