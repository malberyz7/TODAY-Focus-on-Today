"use client";

import { motion } from "framer-motion";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { todayCompletionDateKey } from "@/lib/habit-logic";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/habit-store";

type TodayCheckInButtonProps = {
  habitId: string;
  checked: boolean;
  className?: string;
  /** When true, first tap opens anti-sryv reflection instead of toggling today. */
  antiSryvGate?: boolean;
};

/** Toggles today in `completedDays` — second tap undoes. */
export function TodayCheckInButton({ habitId, checked, className, antiSryvGate }: TodayCheckInButtonProps) {
  const { t } = useLanguage();
  const toggleDay = useHabitStore((s) => s.toggleDay);
  const openAntiSryvModal = useHabitStore((s) => s.openAntiSryvModal);

  function handleClick() {
    if (antiSryvGate) {
      openAntiSryvModal(habitId);
      return;
    }
    toggleDay(habitId, todayCompletionDateKey());
  }

  return (
    <motion.div layout className={cn("w-full sm:w-auto", className)} whileTap={{ scale: 0.98 }}>
      <motion.div
        key={checked ? "done" : "open"}
        initial={{ scale: 0.96, opacity: 0.88 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        className="w-full"
      >
        <Button
          type="button"
          size="lg"
          onClick={handleClick}
          className={cn(
            "h-11 w-full rounded-full text-base sm:w-auto",
            checked
              ? "border border-emerald-500/45 bg-emerald-500/15 text-emerald-50 shadow-inner shadow-emerald-900/20 hover:bg-emerald-500/25"
              : "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
          )}
        >
          {checked ? t("completedToday") : t("stayedCleanToday")}
        </Button>
      </motion.div>
    </motion.div>
  );
}
