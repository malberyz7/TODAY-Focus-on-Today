"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/language-provider";
import { NOTE_DRAFT_MAX_CHARS, NOTE_MAX_CHARS } from "@/lib/note-limits";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/habit-store";

const AUTOSAVE_MS = 650;

function noteCounterClass(length: number): string {
  if (length < 700) return "text-emerald-400/90";
  if (length < 900) return "text-amber-400/90";
  return "text-red-400/90"; // 900+ (includes brief draft past save cap)
}

type NotesInputProps = {
  habitId: string;
  dateKey: string;
  className?: string;
};

/**
 * Local draft + debounced autosave into habit.notes[dateKey]. Empty trimmed text removes the note.
 * Draft may briefly exceed the save cap; persist is always capped at NOTE_MAX_CHARS.
 */
export function NotesInput({ habitId, dateKey, className }: NotesInputProps) {
  const { t } = useLanguage();
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === habitId));
  const setNote = useHabitStore((s) => s.setNote);

  const stored = habit?.notes[dateKey] ?? "";
  const [draft, setDraft] = useState(stored);
  const [savedFlash, setSavedFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncDraftFromStore = useCallback(() => {
    const h = useHabitStore.getState().habits.find((x) => x.id === habitId);
    const persisted = h?.notes[dateKey] ?? "";
    setDraft(persisted);
  }, [habitId, dateKey]);

  const flush = useCallback(
    (text: string) => {
      const clipped = text.slice(0, NOTE_MAX_CHARS);
      setNote(habitId, dateKey, clipped);
      syncDraftFromStore();
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    },
    [habitId, dateKey, setNote, syncDraftFromStore]
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (draft === stored) return;

    timerRef.current = setTimeout(() => {
      flush(draft);
    }, AUTOSAVE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, stored, flush]);

  function handleChange(value: string) {
    setDraft(value.slice(0, NOTE_DRAFT_MAX_CHARS));
  }

  function handleBlur() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (draft !== stored) {
      flush(draft);
    }
  }

  function handleDelete() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraft("");
    setNote(habitId, dateKey, "");
  }

  if (!habit) return null;

  const overSaveCap = draft.length > NOTE_MAX_CHARS;

  return (
    <div className={cn("grid gap-3", className)}>
      <Textarea
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={t("notePlaceholder")}
        className="min-h-[140px] resize-y rounded-2xl border-white/10 bg-black/20 py-3 text-sm leading-relaxed text-foreground shadow-inner ring-1 ring-white/5 placeholder:text-muted-foreground/80 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/25 md:min-h-[160px]"
        spellCheck
      />
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p
            className={cn(
              "text-xs tabular-nums tracking-tight",
              noteCounterClass(draft.length)
            )}
            aria-live="polite"
          >
            {draft.length} / {NOTE_MAX_CHARS}
          </p>
          {overSaveCap ? (
            <p className="text-[0.7rem] leading-snug text-muted-foreground">{t("noteOverflowHint")}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
          <AnimatePresence mode="wait">
            {savedFlash ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-emerald-400/90"
              >
                {t("saved")}
              </motion.span>
            ) : null}
          </AnimatePresence>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="rounded-full text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={!draft.trim() && !stored}
          >
            {t("deleteNote")}
          </Button>
        </div>
      </div>
    </div>
  );
}
