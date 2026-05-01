"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  warn?: boolean;
  /** Default: percent ring with % in center */
  variant?: "finite" | "infinite";
  /** 0–100 for finite mode */
  percent?: number;
  /** 0–100 ring fill for infinite (milestone segment) */
  milestoneFill?: number;
  /** Large number in center (infinite) */
  centerNumber?: number;
  /** Smaller line under the number (infinite) */
  centerHint?: string;
};

/**
 * Ring: finite = goal %; infinite = milestone segment progress, center = total clean days.
 */
export function ProgressRing({
  percent = 0,
  milestoneFill = 0,
  centerNumber,
  centerHint,
  variant = "finite",
  size = 120,
  strokeWidth = 10,
  className,
  warn,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const fill = variant === "infinite" ? milestoneFill : percent;
  const clamped = Math.min(100, Math.max(0, fill));
  const offset = c - (clamped / 100) * c;

  const stroke = warn
    ? "stroke-amber-400/90"
    : "stroke-emerald-400/95 dark:stroke-emerald-400/85";
  const glow = warn
    ? "drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]"
    : "drop-shadow-[0_0_14px_rgba(52,211,153,0.35)]";

  const infinite = variant === "infinite" && centerNumber !== undefined;

  return (
    <div className={cn("relative inline-flex", glow, className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-white/10"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={cn(stroke, "transition-colors")}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-1">
        {infinite ? (
          <>
            <motion.span
              key={centerNumber}
              initial={{ scale: 0.92, opacity: 0.85 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl"
            >
              {centerNumber}
            </motion.span>
            {centerHint ? (
              <span className="max-w-[9rem] text-center text-[0.65rem] font-medium leading-snug text-muted-foreground">
                {centerHint}
              </span>
            ) : null}
          </>
        ) : (
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {clamped}
            <span className="text-base font-medium text-muted-foreground">%</span>
          </span>
        )}
      </div>
    </div>
  );
}
