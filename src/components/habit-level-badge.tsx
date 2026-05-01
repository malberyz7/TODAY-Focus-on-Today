"use client";

import { useMemo } from "react";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { getHabitLevelTier, habitLevelScore } from "@/lib/habit-levels";
import type { MessageKey } from "@/lib/i18n-messages";
import { interpolate } from "@/lib/i18n-messages";
import type { Habit } from "@/lib/habit-model";
import { cn } from "@/lib/utils";

const LEVEL_KEYS: readonly MessageKey[] = [
  "levelTier1",
  "levelTier2",
  "levelTier3",
  "levelTier4",
  "levelTier5",
] as const;

const tierRing: Record<number, string> = {
  1: "border-white/15 bg-white/[0.06] text-muted-foreground",
  2: "border-sky-400/25 bg-sky-500/10 text-sky-100/95",
  3: "border-violet-400/30 bg-violet-500/10 text-violet-100/95",
  4: "border-amber-400/30 bg-amber-500/10 text-amber-100/95",
  5: "border-emerald-400/35 bg-emerald-500/10 text-emerald-50",
};

type HabitLevelBadgeProps = {
  habit: Habit;
  className?: string;
};

export function HabitLevelBadge({ habit, className }: HabitLevelBadgeProps) {
  const { t } = useLanguage();
  const { tier, label } = useMemo(() => {
    const score = habitLevelScore(habit);
    const tier = getHabitLevelTier(score);
    const label = t(LEVEL_KEYS[tier - 1]);
    return { tier, label };
  }, [habit, t]);

  return (
    <Badge
      variant="outline"
      title={interpolate(t("levelBadgeAria"), { label })}
      className={cn(
        "rounded-full border px-2 py-0 text-[0.65rem] font-medium tracking-wide",
        tierRing[tier] ?? tierRing[1],
        className
      )}
    >
      {label}
    </Badge>
  );
}
