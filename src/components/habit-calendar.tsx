"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { enUS as enUSLocale, ru as ruLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { dayKey, datesWithNotes } from "@/lib/habit-logic";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";

type HabitCalendarProps = {
  completedDays: string[];
  notes: Record<string, string>;
  startedAt: string;
  selectedDate: string | null;
  onSelectDay: (key: string) => void;
};

export function HabitCalendar({
  completedDays,
  notes,
  startedAt,
  selectedDate,
  onSelectDay,
}: HabitCalendarProps) {
  const { locale, t } = useLanguage();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const dfLocale = locale === "ru" ? ruLocale : enUSLocale;
  const weekdayLabels = useMemo(
    () => (locale === "ru" ? ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] : ["S", "M", "T", "W", "T", "F", "S"]),
    [locale]
  );

  const completed = useMemo(() => new Set(completedDays), [completedDays]);
  const noteDates = useMemo(() => datesWithNotes(notes), [notes]);
  const today = new Date();

  const grid = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [cursor]);

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-4 ring-1 ring-white/5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => setCursor((d) => addMonths(d, -1))}
          aria-label={t("calendarPrev")}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <p className="text-sm font-medium tracking-tight">
          {format(cursor, "LLLL yyyy", { locale: dfLocale })}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={() => setCursor((d) => addMonths(d, 1))}
          aria-label={t("calendarNext")}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
        {weekdayLabels.map((d, i) => (
          <div key={`${d}-${i}`} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map((day) => {
          const key = dayKey(day);
          const inMonth = isSameMonth(day, cursor);
          const isFuture = isAfter(day, today);
          const beforeStart = isBefore(day, new Date(`${startedAt}T12:00:00`));
          const disabled = isFuture || beforeStart;
          const isClean = completed.has(key);
          const hasNote = noteDates.has(key);
          const isSelected = selectedDate === key;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelectDay(key)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-xl text-xs font-medium transition-colors",
                !inMonth && "text-muted-foreground/40",
                inMonth && !disabled && "text-foreground hover:bg-white/10",
                disabled && "cursor-not-allowed opacity-40",
                isSelected && inMonth && "ring-2 ring-violet-400/70 ring-offset-2 ring-offset-background",
                isClean &&
                  inMonth &&
                  "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/40 shadow-[0_0_20px_-6px_rgba(52,211,153,0.65)]",
                !isClean && inMonth && !disabled && !isFuture && key < dayKey(today) && "text-rose-200/80"
              )}
            >
              {format(day, "d")}
              {hasNote && inMonth && !disabled ? (
                <span
                  className="absolute bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]"
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{t("calendarHint")}</p>
    </div>
  );
}
