"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emptyMotivation, MOTIVATION_ANSWER_MAX_CHARS, type HabitMotivation } from "@/lib/habit-model";
import { useHabitStore } from "@/store/habit-store";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [30, 60, 90] as const;
type GoalChoice = "infinite" | "custom" | (typeof PRESETS)[number];

function resetForm() {
  return {
    name: "",
    goalChoice: 30 as GoalChoice,
    customGoal: 30,
    motivation: emptyMotivation(),
    step: 1 as 1 | 2,
  };
}

export function AddHabitDialog() {
  const { t } = useLanguage();
  const addHabit = useHabitStore((s) => s.addHabit);
  const [open, setOpen] = useState(false);
  const [{ name, goalChoice, customGoal, motivation, step }, setForm] = useState(resetForm);

  function setOpenWrap(next: boolean) {
    setOpen(next);
    if (!next) setForm(resetForm());
  }

  function resolvedGoal(): number | null {
    if (goalChoice === "infinite") return null;
    if (goalChoice === "custom") {
      return Math.max(1, Math.min(3650, Math.round(customGoal) || 1));
    }
    return goalChoice;
  }

  const numberFieldValue =
    goalChoice === "custom" ? customGoal : goalChoice === "infinite" ? 30 : goalChoice;

  const basicsValid = name.trim().length > 0;
  const motivationValid =
    motivation.why.trim().length > 0 &&
    motivation.benefit.trim().length > 0 &&
    motivation.loss.trim().length > 0;

  function submit() {
    if (!basicsValid || !motivationValid) return;
    const m: HabitMotivation = {
      why: motivation.why.trim().slice(0, MOTIVATION_ANSWER_MAX_CHARS),
      benefit: motivation.benefit.trim().slice(0, MOTIVATION_ANSWER_MAX_CHARS),
      loss: motivation.loss.trim().slice(0, MOTIVATION_ANSWER_MAX_CHARS),
    };
    addHabit(name, resolvedGoal(), m);
    setOpenWrap(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpenWrap}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5 rounded-full shadow-sm shadow-emerald-500/10">
            <PlusIcon className="size-4" />
            {t("newHabit")}
          </Button>
        }
      />
      <DialogContent className="max-h-[min(92vh,760px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {step === 1 ? t("addHabitStepBasics") : t("addHabitStepMotivation")}
          </p>
          <DialogTitle>{t("addHabitTitle")}</DialogTitle>
          <DialogDescription>
            {step === 1 ? t("addHabitDesc") : t("motivationStepSubtitle")}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-4 py-1"
            >
              <div className="grid gap-2">
                <Label htmlFor="habit-name">{t("habitNameLabel")}</Label>
                <Input
                  id="habit-name"
                  placeholder={t("habitPlaceholder")}
                  value={name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("goalLength")}</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={goalChoice === d ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setForm((s) => ({ ...s, goalChoice: d }))}
                    >
                      {d} {t("daysShort")}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={goalChoice === "infinite" ? "default" : "outline"}
                    size="sm"
                    className={cn("rounded-full", goalChoice === "infinite" && "ring-2 ring-violet-400/40")}
                    onClick={() => setForm((s) => ({ ...s, goalChoice: "infinite" }))}
                  >
                    {t("noLimitOption")}
                  </Button>
                </div>
                {goalChoice !== "infinite" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="goal-custom">{t("goalLength")}</Label>
                    <Input
                      id="goal-custom"
                      type="number"
                      min={1}
                      max={3650}
                      value={numberFieldValue}
                      onChange={(e) => {
                        setForm((s) => ({
                          ...s,
                          goalChoice: "custom",
                          customGoal: Number(e.target.value) || 1,
                        }));
                      }}
                      className="rounded-xl"
                    />
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-muted-foreground">{t("infiniteMotivationDefault")}</p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 py-1"
            >
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.07] px-4 py-3 ring-1 ring-violet-400/15">
                <p className="font-heading text-base font-medium tracking-tight text-violet-50/95">
                  {t("motivationStepTitle")}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mot-why" className="text-foreground/90">
                  {t("motivationWhyQuestion")}
                </Label>
                <Textarea
                  id="mot-why"
                  value={motivation.why}
                  maxLength={MOTIVATION_ANSWER_MAX_CHARS}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      motivation: {
                        ...s.motivation,
                        why: e.target.value.slice(0, MOTIVATION_ANSWER_MAX_CHARS),
                      },
                    }))
                  }
                  placeholder={t("motivationWhyPlaceholder")}
                  className="min-h-[88px] rounded-xl border-white/10 bg-black/25 py-2.5 text-sm leading-relaxed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mot-benefit" className="text-foreground/90">
                  {t("motivationBenefitQuestion")}
                </Label>
                <Textarea
                  id="mot-benefit"
                  value={motivation.benefit}
                  maxLength={MOTIVATION_ANSWER_MAX_CHARS}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      motivation: {
                        ...s.motivation,
                        benefit: e.target.value.slice(0, MOTIVATION_ANSWER_MAX_CHARS),
                      },
                    }))
                  }
                  placeholder={t("motivationBenefitPlaceholder")}
                  className="min-h-[88px] rounded-xl border-white/10 bg-black/25 py-2.5 text-sm leading-relaxed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mot-loss" className="text-foreground/90">
                  {t("motivationLossQuestion")}
                </Label>
                <Textarea
                  id="mot-loss"
                  value={motivation.loss}
                  maxLength={MOTIVATION_ANSWER_MAX_CHARS}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      motivation: {
                        ...s.motivation,
                        loss: e.target.value.slice(0, MOTIVATION_ANSWER_MAX_CHARS),
                      },
                    }))
                  }
                  placeholder={t("motivationLossPlaceholder")}
                  className="min-h-[88px] rounded-xl border-white/10 bg-black/25 py-2.5 text-sm leading-relaxed"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 2 ? (
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => setForm((s) => ({ ...s, step: 1 }))}>
              {t("addHabitBack")}
            </Button>
          ) : (
            <DialogClose render={<Button variant="ghost" className="rounded-full">{t("cancel")}</Button>} />
          )}
          {step === 1 ? (
            <Button
              type="button"
              className="rounded-full"
              disabled={!basicsValid}
              onClick={() => setForm((s) => ({ ...s, step: 2 }))}
            >
              {t("addHabitNext")}
            </Button>
          ) : (
            <Button type="button" className="rounded-full" disabled={!motivationValid} onClick={submit}>
              {t("addToDashboard")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
