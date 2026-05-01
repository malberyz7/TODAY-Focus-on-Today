"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { enUS, ru as ruLocale } from "date-fns/locale";

import { NotesInput } from "@/components/notes-input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/habit-store";
import { CheckIcon, XIcon } from "lucide-react";

type DailyNotesPanelProps = {
  habitId: string;
  dateKey: string;
  onClose: () => void;
  className?: string;
};

export function DailyNotesPanel({ habitId, dateKey, onClose, className }: DailyNotesPanelProps) {
  const { locale, t } = useLanguage();
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === habitId));
  const toggleDay = useHabitStore((s) => s.toggleDay);

  const dfLocale = locale === "ru" ? ruLocale : enUS;
  const title = format(parseISO(`${dateKey}T12:00:00`), "d MMMM yyyy", { locale: dfLocale });
  const isClean = habit?.completedDays.includes(dateKey) ?? false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-card/95 to-black/30 p-5 ring-1 ring-white/10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.75)] backdrop-blur-md",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("dailyNotes")}
          </p>
          <p className="mt-1 font-heading text-lg font-semibold tracking-tight">{title}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full"
          onClick={onClose}
          aria-label={t("close")}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={isClean ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "rounded-full gap-1.5",
            isClean && "border-emerald-500/40 bg-emerald-500/15 text-emerald-50"
          )}
          onClick={() => toggleDay(habitId, dateKey)}
        >
          {isClean ? <CheckIcon className="size-3.5" /> : null}
          {isClean ? t("cleanDayOn") : t("cleanDayOff")}
        </Button>
        <span className="text-xs text-muted-foreground">{t("cleanDay")}</span>
      </div>

      <NotesInput key={`${habitId}-${dateKey}`} habitId={habitId} dateKey={dateKey} />
    </motion.div>
  );
}
