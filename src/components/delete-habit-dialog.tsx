"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/language-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { interpolate } from "@/lib/i18n-messages";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/habit-store";
import { Trash2Icon } from "lucide-react";

type DeleteHabitDialogProps = {
  habitId: string;
  habitName: string;
  navigateHome?: boolean;
  triggerVariant?: "icon" | "text";
  className?: string;
};

export function DeleteHabitDialog({
  habitId,
  habitName,
  navigateHome,
  triggerVariant = "icon",
  className,
}: DeleteHabitDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const router = useRouter();

  function confirmDelete() {
    removeHabit(habitId);
    setOpen(false);
    if (navigateHome) {
      router.push("/");
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={triggerVariant === "icon" ? "icon-sm" : "sm"}
        className={cn(
          triggerVariant === "text"
            ? "h-auto rounded-full px-2 text-xs text-muted-foreground hover:text-destructive"
            : "rounded-full text-muted-foreground hover:text-destructive",
          className
        )}
        aria-label={triggerVariant === "icon" ? t("deleteHabit") : undefined}
        onClick={() => setOpen(true)}
      >
        {triggerVariant === "icon" ? <Trash2Icon className="size-4" /> : t("deleteHabit")}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteHabitTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {interpolate(t("deleteHabitDesc"), { name: habitName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              {t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
