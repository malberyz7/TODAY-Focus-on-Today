"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { interpolate } from "@/lib/i18n-messages";
import type { Habit } from "@/lib/habit-model";
import { HeartHandshakeIcon } from "lucide-react";

export type RecoveryStats =
  | { mode: "finite"; streak: number; percent: number; completed: number; remaining: number; goal: number }
  | { mode: "infinite"; streak: number; total: number; longest: number };

type StrugglingRecoveryDialogProps = {
  habit: Habit;
  stats: RecoveryStats;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MotivationBlock({
  kicker,
  text,
  emptyHint,
}: {
  kicker: string;
  text: string;
  emptyHint: string;
}) {
  const body = text.trim();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 ring-1 ring-white/5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{kicker}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/95">
        {body ? <span className="text-pretty">{body}</span> : <span className="text-muted-foreground">{emptyHint}</span>}
      </p>
    </div>
  );
}

export function StrugglingRecoveryDialog({
  habit,
  stats,
  open,
  onOpenChange,
}: StrugglingRecoveryDialogProps) {
  const { t } = useLanguage();
  const { why, benefit, loss } = habit.motivation;

  const progressLine =
    stats.mode === "finite"
      ? interpolate(t("cleanDaysLine"), {
          completed: stats.completed,
          goal: stats.goal,
          remaining: stats.remaining,
        })
      : interpolate(t("infiniteCardFooter"), {
          total: stats.total,
          streak: stats.streak,
          longest: stats.longest,
        });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(90vh,720px)] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl border-white/10 bg-gradient-to-b from-card to-black/40 p-0 sm:max-w-lg"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="recovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-0"
            >
              <div className="border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
                <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/25">
                  <HeartHandshakeIcon className="size-5 text-violet-200" aria-hidden />
                </div>
                <DialogHeader className="gap-2 text-left">
                  <DialogTitle className="font-heading text-lg tracking-tight sm:text-xl">
                    {t("recoveryDialogTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                    {t("recoveryDialogLead")}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="grid gap-5 px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {t("recoveryYourStreak")}
                  </p>
                  <p className="font-heading text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                    {stats.streak}
                    <span className="ml-1.5 text-base font-normal text-muted-foreground">{t("daysShort")}</span>
                  </p>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {t("recoveryYourProgress")}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                      {stats.mode === "finite" ? (
                        <>
                          <span className="tabular-nums font-medium">{stats.percent}%</span>
                          <span className="text-muted-foreground"> · </span>
                          <span className="text-pretty text-muted-foreground">{progressLine}</span>
                        </>
                      ) : (
                        <span className="text-pretty text-muted-foreground">{progressLine}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/90">
                    {t("recoveryWhyYouStarted")}
                  </p>
                  <div className="grid gap-3">
                    <MotivationBlock
                      kicker={t("recoveryMotivationWhy")}
                      text={why}
                      emptyHint={t("recoveryEmptyAnswer")}
                    />
                    <MotivationBlock
                      kicker={t("recoveryMotivationBenefit")}
                      text={benefit}
                      emptyHint={t("recoveryEmptyAnswer")}
                    />
                    <MotivationBlock
                      kicker={t("recoveryMotivationLoss")}
                      text={loss}
                      emptyHint={t("recoveryEmptyAnswer")}
                    />
                  </div>
                </div>

                <p className="text-center text-xs leading-relaxed text-muted-foreground">{t("recoverySupportFooter")}</p>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={() => onOpenChange(false)}
                >
                  {t("close")}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
