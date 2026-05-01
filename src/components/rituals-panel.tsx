"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emptyRitualDay } from "@/lib/habit-model";
import type { Habit } from "@/lib/habit-model";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/habit-store";
import { ChevronDownIcon } from "lucide-react";

const RITUAL_INPUT_MAX = 600;

type RitualsPanelProps = {
  habit: Habit;
  dateKey: string;
  className?: string;
};

export function RitualsPanel({ habit, dateKey, className }: RitualsPanelProps) {
  const { t } = useLanguage();
  const patchRitual = useHabitStore((s) => s.patchRitual);

  const day = useMemo(() => habit.rituals[dateKey] ?? emptyRitualDay(), [habit.rituals, dateKey]);
  const [morningOpen, setMorningOpen] = useState(true);
  const [eveningOpen, setEveningOpen] = useState(false);

  return (
    <section className={cn("grid gap-3", className)}>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("ritualsTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("ritualsSubtitle")}</p>
        <p className="mt-1 text-[0.65rem] text-muted-foreground/80">{dateKey}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] ring-1 ring-white/5">
        <button
          type="button"
          onClick={() => setMorningOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-white/[0.04]"
        >
          <span>{t("ritualMorningTitle")}</span>
          <ChevronDownIcon
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform", morningOpen && "rotate-180")}
          />
        </button>
        <AnimatePresence initial={false}>
          {morningOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="grid gap-3 p-4">
                <div className="grid gap-2">
                  <Label htmlFor={`mf-${habit.id}`} className="text-muted-foreground">
                    {t("ritualMorningFocusLabel")}
                  </Label>
                  <Input
                    id={`mf-${habit.id}`}
                    value={day.morningFocus}
                    maxLength={RITUAL_INPUT_MAX}
                    onChange={(e) =>
                      patchRitual(habit.id, dateKey, { morningFocus: e.target.value.slice(0, RITUAL_INPUT_MAX) })
                    }
                    className="rounded-xl border-white/10 bg-black/25"
                    placeholder={t("ritualMorningPlaceholder")}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full rounded-full"
                  onClick={() => setEveningOpen(true)}
                >
                  {t("ritualMorningStart")}
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] ring-1 ring-white/5">
        <button
          type="button"
          onClick={() => setEveningOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-white/[0.04]"
        >
          <span>{t("ritualEveningTitle")}</span>
          <ChevronDownIcon
            className={cn("size-4 shrink-0 text-muted-foreground transition-transform", eveningOpen && "rotate-180")}
          />
        </button>
        <AnimatePresence initial={false}>
          {eveningOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="grid gap-4 p-4">
                <p className="text-sm text-muted-foreground">{t("ritualEveningCheckLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={day.eveningResult === "yes" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => patchRitual(habit.id, dateKey, { eveningResult: "yes" })}
                  >
                    {t("ritualEveningYes")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={day.eveningResult === "no" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => patchRitual(habit.id, dateKey, { eveningResult: "no" })}
                  >
                    {t("ritualEveningNo")}
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`en-${habit.id}`} className="text-muted-foreground">
                    {t("ritualEveningNoteLabel")}
                  </Label>
                  <Textarea
                    id={`en-${habit.id}`}
                    value={day.eveningNote}
                    maxLength={RITUAL_INPUT_MAX}
                    onChange={(e) =>
                      patchRitual(habit.id, dateKey, { eveningNote: e.target.value.slice(0, RITUAL_INPUT_MAX) })
                    }
                    className="min-h-[80px] rounded-xl border-white/10 bg-black/25 py-2.5 text-sm"
                    placeholder={t("ritualEveningNotePlaceholder")}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
