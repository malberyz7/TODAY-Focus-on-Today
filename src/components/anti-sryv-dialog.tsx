"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAntiSryvQuestionPair, type AntiSryvQuestionKey } from "@/lib/anti-sryv-logic";
import { dayKey } from "@/lib/habit-logic";
import type { Habit } from "@/lib/habit-model";
import { interpolate, type MessageKey } from "@/lib/i18n-messages";
import { useHabitStore } from "@/store/habit-store";

const ANSWER_MAX = 1200;

type AntiSryvDialogProps = {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after successful save */
  onSubmitted?: () => void;
};

export function AntiSryvDialog({ habit, open, onOpenChange, onSubmitted }: AntiSryvDialogProps) {
  const { t } = useLanguage();
  const saveAntiSryvCheckin = useHabitStore((s) => s.saveAntiSryvCheckin);
  const todayKey = dayKey(new Date());

  const [q1, q2] = useMemo(
    () => getAntiSryvQuestionPair(habit.id, todayKey),
    [habit.id, todayKey]
  );

  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");

  const valid = a1.trim().length > 0 && a2.trim().length > 0;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setA1("");
      setA2("");
    }
    onOpenChange(next);
  }

  function submit() {
    if (!valid) return;
    const questions: AntiSryvQuestionKey[] = [q1, q2];
    saveAntiSryvCheckin(habit.id, todayKey, {
      answers: [a1.trim().slice(0, ANSWER_MAX), a2.trim().slice(0, ANSWER_MAX)],
      questions,
    });
    setA1("");
    setA2("");
    onSubmitted?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(90vh,640px)] overflow-y-auto rounded-2xl border-white/10 bg-gradient-to-b from-card to-black/35 sm:max-w-md"
      >
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <DialogHeader>
            <DialogTitle className="font-heading text-lg tracking-tight">{t("antiSryvTitle")}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {interpolate(t("antiSryvLead"), { name: habit.name })}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="as1" className="text-foreground/90">
                {t(q1 as MessageKey)}
              </Label>
              <Textarea
                id="as1"
                value={a1}
                onChange={(e) => setA1(e.target.value.slice(0, ANSWER_MAX))}
                className="min-h-[88px] rounded-xl border-white/10 bg-black/25 py-2.5 text-sm leading-relaxed"
                placeholder={t("antiSryvPlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="as2" className="text-foreground/90">
                {t(q2 as MessageKey)}
              </Label>
              <Textarea
                id="as2"
                value={a2}
                onChange={(e) => setA2(e.target.value.slice(0, ANSWER_MAX))}
                className="min-h-[88px] rounded-xl border-white/10 bg-black/25 py-2.5 text-sm leading-relaxed"
                placeholder={t("antiSryvPlaceholder")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:flex-col sm:gap-2">
            <p className="w-full text-center text-[0.7rem] leading-snug text-muted-foreground sm:text-left">
              {t("antiSryvHint")}
            </p>
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setA1("");
                  setA2("");
                  onOpenChange(false);
                }}
              >
                {t("antiSryvLater")}
              </Button>
              <Button type="button" className="rounded-full" disabled={!valid} onClick={submit}>
                {t("antiSryvSave")}
              </Button>
            </div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
