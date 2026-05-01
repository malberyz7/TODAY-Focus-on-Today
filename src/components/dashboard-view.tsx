"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { AddHabitDialog } from "@/components/add-habit-dialog";
import { AntiSryvQueue } from "@/components/anti-sryv-queue";
import { EmptyHabits, HabitCard } from "@/components/habit-card";
import { useHabitsReady } from "@/components/habit-provider";
import { LanguageToggle, useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { useHabitStore } from "@/store/habit-store";
import type { AntiSryvIntervalDays } from "@/store/habit-store";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
      <div className="h-24 animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10" />
      <div className="h-64 animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10" />
    </div>
  );
}

export function DashboardView() {
  const { t } = useLanguage();
  const ready = useHabitsReady();
  const habits = useHabitStore((s) => s.habits);
  const interval = useHabitStore((s) => s.settings.antiSryvIntervalDays);
  const setAntiSryvInterval = useHabitStore((s) => s.setAntiSryvInterval);

  if (!ready) {
    return <DashboardSkeleton />;
  }

  const goalsLabel =
    habits.length === 1 ? `1 ${t("activeGoalsOne")}` : `${habits.length} ${t("activeGoals")}`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <AntiSryvQueue />
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-white/10 backdrop-blur-sm"
          >
            <SparklesIcon className="size-3.5 text-emerald-300" />
            {t("disciplineTag")}
          </motion.div>
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("titleDashboard")}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitleDashboard")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle />
            <Link
              href="/about"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("aboutAuthorNav")}
            </Link>
            <Link
              href="/how"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("howItWorksNav")}
            </Link>
            <p className="text-xs tabular-nums text-muted-foreground">{goalsLabel}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
              {t("antiSryvIntervalLabel")}
            </span>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 ring-1 ring-white/10">
              {([2, 3] as AntiSryvIntervalDays[]).map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className={cn(
                    "h-7 rounded-full px-2.5 text-xs",
                    interval === d && "bg-white/15 text-foreground shadow-sm"
                  )}
                  onClick={() => setAntiSryvInterval(d)}
                >
                  {d === 2 ? t("antiSryvInterval2") : t("antiSryvInterval3")}
                </Button>
              ))}
            </div>
          </div>
          <AddHabitDialog />
        </div>
      </header>

      {habits.length === 0 ? (
        <EmptyHabits />
      ) : (
        <ul className="grid list-none gap-6">
          <AnimatePresence mode="popLayout">
            {habits.map((habit) => (
              <motion.li
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(4px)" }}
                transition={{
                  layout: { type: "spring", stiffness: 320, damping: 30 },
                  opacity: { duration: 0.22 },
                }}
                className="list-none"
              >
                <HabitCard habit={habit} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
