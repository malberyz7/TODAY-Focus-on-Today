"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AnimatedProgressBar } from "@/components/animated-progress-bar";
import { useLanguage } from "@/components/language-provider";
import {
  INFINITE_MILESTONE_DAYS,
  type InfiniteMilestoneProgress,
} from "@/lib/habit-logic";
import { interpolate } from "@/lib/i18n-messages";
import { cn } from "@/lib/utils";

type InfiniteHabitSummaryProps = {
  totalClean: number;
  streak: number;
  longest: number;
  milestone: InfiniteMilestoneProgress;
  /** Tighter layout for dashboard cards */
  compact?: boolean;
  /** Hide the large hero count (e.g. when the ring already shows it). */
  omitHero?: boolean;
};

export function InfiniteHabitSummary({
  totalClean,
  streak,
  longest,
  milestone,
  compact,
  omitHero,
}: InfiniteHabitSummaryProps) {
  const { t } = useLanguage();
  const prev = useRef(totalClean);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (totalClean > prev.current) {
      const crossed = INFINITE_MILESTONE_DAYS.some((m) => prev.current < m && totalClean >= m);
      if (crossed) {
        setCelebrate(true);
        const id = window.setTimeout(() => setCelebrate(false), 900);
        prev.current = totalClean;
        return () => window.clearTimeout(id);
      }
    }
    prev.current = totalClean;
  }, [totalClean]);

  return (
    <div className={cn("grid gap-4", compact ? "gap-3" : "gap-5")}>
      {!omitHero ? (
        <div className="text-center lg:text-left">
          <motion.div
            animate={celebrate ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="inline-flex flex-col items-center gap-1 lg:items-start"
          >
            <p className="text-[0.7rem] font-medium uppercase tracking-widest text-muted-foreground">
              {t("cleanDaysTotal")}
            </p>
            <p
              className={cn(
                "font-semibold tabular-nums tracking-tight text-foreground",
                compact ? "text-4xl" : "text-5xl sm:text-6xl"
              )}
            >
              {totalClean}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {interpolate(t("holdingDaysSubtitle"), { n: totalClean })}
            </p>
          </motion.div>
        </div>
      ) : null}

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t("milestoneProgress")}</span>
          {milestone.allUnlocked ? (
            <span className="text-emerald-400/90">{t("allMilestonesDone")}</span>
          ) : milestone.next !== null ? (
            <span className="tabular-nums text-foreground/90">
              {interpolate(t("nextMilestone"), { n: milestone.next })}
            </span>
          ) : null}
        </div>
        <AnimatedProgressBar value={milestone.progressToNext} warn={false} />
      </div>

      <div className={cn("grid grid-cols-2 gap-3", compact && "gap-2")}>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
          <p className="text-xs text-muted-foreground">{t("currentStreak")}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums">
            {streak}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{t("daysShort")}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
          <p className="text-xs text-muted-foreground">{t("longestStreak")}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums">
            {longest}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{t("daysShort")}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {INFINITE_MILESTONE_DAYS.map((m) => {
          const done = totalClean >= m;
          return (
            <span
              key={m}
              className={cn(
                "rounded-full px-2 py-0.5 text-[0.7rem] font-medium tabular-nums transition-colors",
                done
                  ? "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/35"
                  : "bg-white/5 text-muted-foreground"
              )}
            >
              {m}
            </span>
          );
        })}
      </div>
    </div>
  );
}
