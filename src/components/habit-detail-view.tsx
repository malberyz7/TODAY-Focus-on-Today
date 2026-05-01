"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useHabitsReady } from "@/components/habit-provider";
import { AnimatedProgressBar } from "@/components/animated-progress-bar";
import { DailyNotesPanel } from "@/components/daily-notes-panel";
import { DeleteHabitDialog } from "@/components/delete-habit-dialog";
import { HonestStatsPanel } from "@/components/honest-stats-panel";
import { HabitLevelBadge } from "@/components/habit-level-badge";
import { RitualsPanel } from "@/components/rituals-panel";
import { StrugglingRecoveryDialog, type RecoveryStats } from "@/components/struggling-recovery-dialog";
import { HabitCalendar } from "@/components/habit-calendar";
import { InfiniteHabitSummary } from "@/components/infinite-habit-summary";
import { useLanguage } from "@/components/language-provider";
import { ProgressRing } from "@/components/progress-ring";
import { TodayCheckInButton } from "@/components/today-check-in-button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { isAntiSryvDue } from "@/lib/anti-sryv-logic";
import {
  calculateFiniteProgress,
  calculateLongestStreak,
  calculateStreak,
  dayKey,
  getInfiniteMilestoneProgress,
  hasMissedPastDays,
  isInfiniteGoal,
  isTodaySuccess,
  uniqueSuccessCount,
  unlockedMilestones,
} from "@/lib/habit-logic";
import { getMotivationMessage, interpolate } from "@/lib/i18n-messages";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/habit-store";
import { ArrowLeftIcon, FlameIcon, TrophyIcon } from "lucide-react";

type HabitDetailViewProps = {
  habitId: string;
};

export function HabitDetailView({ habitId }: HabitDetailViewProps) {
  const { locale, t } = useLanguage();
  const ready = useHabitsReady();
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === habitId));
  const interval = useHabitStore((s) => s.settings.antiSryvIntervalDays);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const infinite = habit ? isInfiniteGoal(habit.goalDays) : false;

  const stats = useMemo(() => {
    if (!habit) return null;
    const streak = calculateStreak(habit.completedDays);
    const missed = hasMissedPastDays(habit.startedAt, habit.completedDays);
    const todayDone = isTodaySuccess(habit.completedDays);
    if (isInfiniteGoal(habit.goalDays)) {
      const total = uniqueSuccessCount(habit.completedDays);
      const longest = calculateLongestStreak(habit.completedDays);
      const milestone = getInfiniteMilestoneProgress(total);
      const line = getMotivationMessage(locale, 0, missed, { infinite: true });
      return { mode: "infinite" as const, streak, missed, todayDone, total, longest, milestone, line };
    }
    const { percent, completed, remaining } = calculateFiniteProgress(habit.completedDays, habit.goalDays);
    const line = getMotivationMessage(locale, percent, missed);
    const milestones = unlockedMilestones(percent);
    return {
      mode: "finite" as const,
      percent,
      completed,
      remaining,
      streak,
      missed,
      todayDone,
      line,
      milestones,
    };
  }, [habit, locale]);

  const recoveryStats: RecoveryStats | null = useMemo(() => {
    if (!habit || !stats) return null;
    if (stats.mode === "infinite") {
      return {
        mode: "infinite",
        streak: stats.streak,
        total: stats.total,
        longest: stats.longest,
      };
    }
    return {
      mode: "finite",
      streak: stats.streak,
      percent: stats.percent,
      completed: stats.completed,
      remaining: stats.remaining,
      goal: habit.goalDays as number,
    };
  }, [habit, stats]);

  const ritualDateKey = selectedDate ?? dayKey(new Date());
  const antiSryvGate = useMemo(
    () => (habit ? isAntiSryvDue(habit, interval) : false),
    [habit, interval]
  );

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-3xl bg-white/5 ring-1 ring-white/10" />
          <div className="h-72 animate-pulse rounded-3xl bg-white/5 ring-1 ring-white/10" />
        </div>
      </div>
    );
  }

  if (!habit || !stats) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">{t("habitNotFound")}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
          <ArrowLeftIcon className="size-4" />
          {t("notFoundBack")}
        </Link>
      </div>
    );
  }

  const showRepair =
    stats.missed && (stats.mode === "infinite" || (stats.mode === "finite" && stats.percent < 100));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "rounded-full text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeftIcon className="size-4" />
          {t("backDashboard")}
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {showRepair ? (
            <Badge className="rounded-full border-amber-400/40 bg-amber-500/10 text-amber-100">
              {t("repairStreak")}
            </Badge>
          ) : (
            <Badge className="rounded-full border-emerald-400/35 bg-emerald-500/10 text-emerald-50">
              {t("lockedIn")}
            </Badge>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-white/12 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground"
            onClick={() => setRecoveryOpen(true)}
          >
            {t("strugglingButton")}
          </Button>
          <DeleteHabitDialog
            habitId={habit.id}
            habitName={habit.name}
            navigateHome
            triggerVariant="text"
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-card/60 p-6 text-center ring-1 ring-white/5 backdrop-blur-md sm:p-8 sm:pb-9 sm:pt-9 lg:items-stretch lg:p-9 lg:text-left"
        >
          <div className="flex w-full max-w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="shrink-0 pt-0.5">
              {stats.mode === "infinite" ? (
                <ProgressRing
                  variant="infinite"
                  milestoneFill={stats.milestone.progressToNext}
                  centerNumber={stats.total}
                  centerHint={interpolate(t("holdingDaysSubtitle"), { n: stats.total })}
                  size={140}
                  strokeWidth={12}
                  warn={stats.missed && !stats.todayDone}
                />
              ) : (
                <ProgressRing percent={stats.percent} size={140} strokeWidth={12} warn={stats.missed && !stats.todayDone} />
              )}
            </div>
            <div className="flex w-full min-w-0 max-w-full flex-col gap-2.5 text-pretty sm:gap-3 lg:flex-1 lg:text-left">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t("habitDetail")}
                </p>
                {infinite ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-violet-400/35 bg-violet-500/10 px-2 py-0 text-[0.65rem] text-violet-100"
                  >
                    {t("lifetimeMode")}
                  </Badge>
                ) : null}
                <HabitLevelBadge habit={habit} />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight break-words sm:text-3xl">
                {habit.name}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">{stats.line}</p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {stats.mode === "finite" ? (
            <div className="grid gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("completion")}</span>
                <span className="tabular-nums font-medium">{stats.percent}%</span>
              </div>
              <AnimatedProgressBar value={stats.percent} warn={stats.missed && !stats.todayDone} />
              <p className="text-xs text-muted-foreground">
                {interpolate(t("successfulDaysLine"), { completed: stats.completed, remaining: stats.remaining })}
              </p>
            </div>
          ) : (
            <InfiniteHabitSummary
              totalClean={stats.total}
              streak={stats.streak}
              longest={stats.longest}
              milestone={stats.milestone}
              omitHero
            />
          )}

          {stats.mode === "finite" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FlameIcon className="size-3.5 text-orange-300" />
                  {t("currentStreak")}
                </div>
                <motion.p
                  key={stats.streak}
                  initial={{ scale: 0.95, opacity: 0.75 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-2 text-2xl font-semibold tabular-nums"
                >
                  {stats.streak}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{t("daysShort")}</span>
                </motion.p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrophyIcon className="size-3.5 text-amber-300" />
                  {t("badges")}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {[25, 50, 75, 100].map((m) => (
                    <span
                      key={m}
                      className={
                        stats.milestones.includes(m)
                          ? "rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber-100"
                          : "rounded-md bg-white/5 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
                      }
                    >
                      {m}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <TodayCheckInButton
            habitId={habit.id}
            checked={stats.todayDone}
            className="w-full"
            antiSryvGate={antiSryvGate}
          />
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="flex flex-col gap-6"
        >
          <HonestStatsPanel habit={habit} />
          <RitualsPanel habit={habit} dateKey={ritualDateKey} />
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("dailyNotes")}
            </p>
            <p className="mb-3 text-sm text-muted-foreground">{t("dailyNotesSubtitle")}</p>
            <HabitCalendar
              completedDays={habit.completedDays}
              notes={habit.notes}
              startedAt={habit.startedAt}
              selectedDate={selectedDate}
              onSelectDay={setSelectedDate}
            />
          </div>

          {!selectedDate ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center"
            >
              <p className="text-sm text-muted-foreground">{t("selectDay")}</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-4 rounded-full"
                onClick={() => setSelectedDate(dayKey(new Date()))}
              >
                {t("pickToday")}
              </Button>
            </motion.div>
          ) : null}

          <AnimatePresence mode="wait">
            {selectedDate ? (
              <DailyNotesPanel
                key={selectedDate}
                habitId={habit.id}
                dateKey={selectedDate}
                onClose={() => setSelectedDate(null)}
              />
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {recoveryStats ? (
        <StrugglingRecoveryDialog
          habit={habit}
          stats={recoveryStats}
          open={recoveryOpen}
          onOpenChange={setRecoveryOpen}
        />
      ) : null}
    </div>
  );
}
