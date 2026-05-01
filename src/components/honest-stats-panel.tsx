"use client";

import { useMemo } from "react";

import { useLanguage } from "@/components/language-provider";
import { computeHonestStats } from "@/lib/honest-stats";
import type { Habit } from "@/lib/habit-model";
import { cn } from "@/lib/utils";

type HonestStatsPanelProps = {
  habit: Habit;
  className?: string;
};

export function HonestStatsPanel({ habit, className }: HonestStatsPanelProps) {
  const { t } = useLanguage();
  const stats = useMemo(() => computeHonestStats(habit), [habit]);
  const total = stats.totalCleanDays + stats.failureDays;
  const successPct = total > 0 ? Math.round((stats.totalCleanDays / total) * 100) : 50;
  const failPct = 100 - successPct;

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5",
        className
      )}
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {t("honestStatsTitle")}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("honestStatsSubtitle")}</p>

      <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        {total > 0 ? (
          <>
            <div
              className="h-full shrink-0 bg-emerald-500/85 transition-[width] duration-500 ease-out"
              style={{ width: `${successPct}%` }}
            />
            <div className="h-full min-w-0 flex-1 bg-red-500/75" />
          </>
        ) : (
          <div className="h-full w-full bg-white/15" />
        )}
      </div>
      <div className="mt-2 flex justify-between gap-3 text-[0.7rem] text-muted-foreground">
        <span className="text-emerald-400/95">
          {t("honestStatsClean")}: <span className="tabular-nums font-medium text-emerald-200">{stats.totalCleanDays}</span>
        </span>
        <span className="text-red-400/90">
          {t("honestStatsMissed")}: <span className="tabular-nums font-medium text-red-200/95">{stats.failureDays}</span>
        </span>
      </div>
      {total > 0 ? (
        <p className="mt-1 text-[0.65rem] tabular-nums text-muted-foreground/80">
          {successPct}% / {failPct}%
        </p>
      ) : null}

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <dt className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{t("longestStreak")}</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {stats.longestStreak} <span className="text-sm font-normal text-muted-foreground">{t("daysShort")}</span>
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
          <dt className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{t("honestStatsReturns")}</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">{stats.returnsAfterFailure}</dd>
        </div>
      </dl>
    </section>
  );
}
