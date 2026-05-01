"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AnimatedProgressBarProps = {
  value: number;
  className?: string;
  trackClassName?: string;
  warn?: boolean;
};

export function AnimatedProgressBar({ value, className, trackClassName, warn }: AnimatedProgressBarProps) {
  const v = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10",
        trackClassName,
        className
      )}
    >
      <motion.div
        className={cn(
          "h-full rounded-full",
          warn
            ? "bg-gradient-to-r from-amber-500/90 to-amber-400/80"
            : "bg-gradient-to-r from-emerald-500/95 to-teal-400/85"
        )}
        initial={false}
        animate={{ width: `${v}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      />
    </div>
  );
}
