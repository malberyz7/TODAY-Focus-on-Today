"use client";

import { AntiSryvDialog } from "@/components/anti-sryv-dialog";
import { dismissAntiSryvForToday } from "@/lib/anti-sryv-session";
import { useHabitStore } from "@/store/habit-store";

/**
 * Single global reflection modal (opened from dashboard queue or check-in gate).
 */
export function AntiSryvDialogHost() {
  const id = useHabitStore((s) => s.antiSryvModalHabitId);
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === id));
  const closeAntiSryvModal = useHabitStore((s) => s.closeAntiSryvModal);

  if (!habit || !id) return null;

  return (
    <AntiSryvDialog
      habit={habit}
      open
      onOpenChange={(open) => {
        if (!open) {
          dismissAntiSryvForToday(id);
          closeAntiSryvModal();
        }
      }}
      onSubmitted={closeAntiSryvModal}
    />
  );
}
