"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto w-full"
      >
        <div className="mb-8">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full text-muted-foreground")}
          >
            <ArrowLeftIcon className="size-4" />
            {t("backDashboard")}
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-card/60 px-6 py-8 ring-1 ring-white/5 backdrop-blur-md sm:px-10 sm:py-10">
          <h1 className="mb-8 text-center font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("howItWorksTitle")}
          </h1>

          <div className="mx-auto max-w-2xl space-y-6 text-pretty text-[1.02rem] leading-8 text-foreground/95">
            <p>{t("howItWorksParagraph1")}</p>
            <p>{t("howItWorksParagraph2")}</p>
            <blockquote className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed text-emerald-50/95">
              “{t("howItWorksQuote")}”
            </blockquote>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
