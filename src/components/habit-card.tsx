"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AddHabitDialog } from "@/components/add-habit-dialog";
import { AnimatedProgressBar } from "@/components/animated-progress-bar";
import { DeleteHabitDialog } from "@/components/delete-habit-dialog";
import { HabitLevelBadge } from "@/components/habit-level-badge";
import { InfiniteHabitSummary } from "@/components/infinite-habit-summary";
import { StrugglingRecoveryDialog, type RecoveryStats } from "@/components/struggling-recovery-dialog";
import { NotesInput } from "@/components/notes-input";
import { TodayCheckInButton } from "@/components/today-check-in-button";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isAntiSryvDue } from "@/lib/anti-sryv-logic";
import { computeHonestStats } from "@/lib/honest-stats";
import {
  calculateFiniteProgress,
  calculateLongestStreak,
  calculateStreak,
  getInfiniteMilestoneProgress,
  isInfiniteGoal,
  uniqueSuccessCount,
  dayKey,
  hasMissedPastDays,
  isTodaySuccess,
  unlockedMilestones,
} from "@/lib/habit-logic";
import { getMotivationMessage, interpolate } from "@/lib/i18n-messages";
import type { Habit } from "@/store/habit-store";
import { useHabitStore } from "@/store/habit-store";
import { ArrowRightIcon, FlameIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type HabitCardProps = {
  habit: Habit;
};

export function HabitCard({ habit }: HabitCardProps) {
  const { locale, t } = useLanguage();
  const interval = useHabitStore((s) => s.settings.antiSryvIntervalDays);
  const [journalOpen, setJournalOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const todayKey = dayKey(new Date());
  const infinite = isInfiniteGoal(habit.goalDays);

  const stats = useMemo(() => {
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

  const recoveryStats: RecoveryStats = useMemo(() => {
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
  }, [stats, habit.goalDays]);

  const honest = useMemo(() => computeHonestStats(habit), [habit]);
  const antiSryvGate = useMemo(
    () => isAntiSryvDue(habit, interval),
    [habit, interval]
  );

  const showRepair =
    stats.missed && (stats.mode === "infinite" || (stats.mode === "finite" && stats.percent < 100));

  return (
    <>
    <Card className="border-white/10 bg-card/70 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] ring-white/10 backdrop-blur-md transition-shadow hover:shadow-[0_28px_90px_-44px_rgba(16,185,129,0.22)]">
      <CardHeader className="gap-0 border-b border-white/5 px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2 text-pretty">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {t("habit")}
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
            <h2 className="font-heading text-lg font-semibold tracking-tight break-words">{habit.name}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{stats.line}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
            {showRepair ? (
              <Badge
                variant="outline"
                className="rounded-full border-amber-400/40 bg-amber-500/10 text-amber-100"
              >
                {t("missedDay")}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
              >
                {t("onPath")}
              </Badge>
            )}
            <DeleteHabitDialog habitId={habit.id} habitName={habit.name} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 px-5 pb-1 pt-6 sm:px-6">
        {stats.mode === "finite" ? (
          <>
            <div className="grid gap-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">{t("progress")}</span>
                <span className="tabular-nums font-medium text-foreground">{stats.percent}%</span>
              </div>
              <AnimatedProgressBar value={stats.percent} warn={stats.missed && !stats.todayDone} />
              <p className="text-xs text-muted-foreground">
                {interpolate(t("cleanDaysLine"), {
                  completed: stats.completed,
                  goal: habit.goalDays as number,
                  remaining: stats.remaining,
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <FlameIcon className="size-3.5 text-orange-300" />
                  {t("streak")}
                </div>
                <motion.p
                  key={stats.streak}
                  initial={{ scale: 0.92, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-2 text-2xl font-semibold tabular-nums"
                >
                  {stats.streak}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{t("daysShort")}</span>
                </motion.p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <SparklesIcon className="size-3.5 text-violet-300" />
                  {t("milestones")}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[25, 50, 75, 100].map((m) => (
                    <span
                      key={m}
                      className={
                        stats.milestones.includes(m)
                          ? "rounded-full bg-violet-500/20 px-2 py-0.5 text-[0.7rem] font-medium text-violet-100 ring-1 ring-violet-400/35"
                          : "rounded-full bg-white/5 px-2 py-0.5 text-[0.7rem] text-muted-foreground"
                      }
                    >
                      {m}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <InfiniteHabitSummary
            totalClean={stats.total}
            streak={stats.streak}
            longest={stats.longest}
            milestone={stats.milestone}
            compact
          />
        )}

        <Dialog open={journalOpen} onOpenChange={setJournalOpen}>
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center rounded-full border-violet-500/25 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20"
              >
                {t("todayNote")}
              </Button>
            }
          />
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("dailyNotes")}</DialogTitle>
            </DialogHeader>
            <NotesInput key={`${habit.id}-${todayKey}`} habitId={habit.id} dateKey={todayKey} />
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-white/12 bg-white/[0.03] text-sm font-normal text-muted-foreground shadow-none hover:bg-white/[0.06] hover:text-foreground"
          onClick={() => setRecoveryOpen(true)}
        >
          {t("strugglingButton")}
        </Button>
        <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
          {interpolate(t("honestCardLine"), { clean: honest.totalCleanDays, miss: honest.failureDays })}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-white/5 bg-muted/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <TodayCheckInButton habitId={habit.id} checked={stats.todayDone} antiSryvGate={antiSryvGate} />
        <Link
          href={`/habits/${habit.id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 w-full rounded-full border-white/15 bg-white/5 sm:w-auto"
          )}
        >
          {t("openDetail")}
          <ArrowRightIcon className="size-4" />
        </Link>
      </CardFooter>
    </Card>
    <StrugglingRecoveryDialog
      habit={habit}
      stats={recoveryStats}
      open={recoveryOpen}
      onOpenChange={setRecoveryOpen}
    />
    </>
  );
}

export function EmptyHabits() {
  const { t } = useLanguage();
  return (
    <Card className="border-dashed border-white/20 bg-card/40 py-12 text-center backdrop-blur-sm">
      <CardContent className="grid gap-4">
        <p className="text-sm text-muted-foreground">{t("emptyHabits")}</p>
        <div className="flex justify-center">
          <AddHabitDialog />
        </div>
      </CardContent>
    </Card>
  );
}
