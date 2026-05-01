"use client";

import { useEffect } from "react";

import { isAntiSryvDue } from "@/lib/anti-sryv-logic";
import { dayKey } from "@/lib/habit-logic";
import { isAntiSryvDismissedToday } from "@/lib/anti-sryv-session";
import { useHabitStore } from "@/store/habit-store";

/** Opens the next due reflection on the dashboard when none is active. */
export function AntiSryvQueue() {
  const habits = useHabitStore((s) => s.habits);
  const interval = useHabitStore((s) => s.settings.antiSryvIntervalDays);
  const modalId = useHabitStore((s) => s.antiSryvModalHabitId);
  const openAntiSryvModal = useHabitStore((s) => s.openAntiSryvModal);
  const todayKey = dayKey(new Date());

  useEffect(() => {
    if (modalId) return;
    const next = habits.find(
      (h) => isAntiSryvDue(h, interval) && !isAntiSryvDismissedToday(h.id)
    );
    if (next) openAntiSryvModal(next.id);
  }, [habits, interval, modalId, openAntiSryvModal, todayKey]);

  return null;
}
