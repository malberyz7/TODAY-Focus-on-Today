"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  isValid,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { enUS as enUSLocale, ru as ruLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { datesWithNotes, dayKey, normalizeCalendarDateKey, parseDayKey } from "@/lib/habit-logic";
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
  /** Start-of first trackable calendar day — must not compare cell midnight to “noon same day” or the start day stays disabled. */
  const habitStartedAt = useMemo(() => {
    const k = normalizeCalendarDateKey(startedAt);
    if (!k) return null;
    const d = parseDayKey(k);
    return isValid(d) ? d : null;
  }, [startedAt]);

  /** Month-only days + pad slots (null) for 7-column layout; week starts Sunday to match headers. */
  const gridCells = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const leading = getDay(monthStart);
    const total = leading + monthDays.length;
    const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
    const monthKey = format(monthStart, "yyyy-MM");
    const cells: ({ kind: "pad" } | { kind: "day"; date: Date })[] = [];
    for (let i = 0; i < leading; i++) cells.push({ kind: "pad" });
    for (const date of monthDays) cells.push({ kind: "day", date });
    for (let i = 0; i < trailing; i++) cells.push({ kind: "pad" });
    return { cells, monthKey };
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
        {gridCells.cells.map((cell, index) => {
          if (cell.kind === "pad") {
            return (
              <div
                key={`${gridCells.monthKey}-pad-${index}`}
                className="aspect-square rounded-xl"
                aria-hidden
              />
            );
          }
          const day = cell.date;
          const key = dayKey(day);
          const isFuture = isAfter(day, startOfDay(today));
          const beforeStart = habitStartedAt != null && isBefore(day, habitStartedAt);
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
                !disabled && "text-foreground hover:bg-white/10",
                disabled && "cursor-not-allowed opacity-40",
                isClean &&
                  !disabled &&
                  "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-sm ring-1 ring-emerald-300",
                isSelected &&
                  !disabled &&
                  "z-[1] ring-2 ring-violet-400 ring-offset-2 ring-offset-background",
                !isClean && !disabled && !isFuture && key < dayKey(today) && "text-rose-200/80"
              )}
            >
              {format(day, "d")}
              {hasNote && !disabled ? (
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
