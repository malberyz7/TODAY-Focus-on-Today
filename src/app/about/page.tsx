"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

const AUTHOR_EMAIL = "alimzhan_meirambek@mail.ru";

export default function AboutPage() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const paragraphs = [
    t("aboutAuthorParagraph1"),
    t("aboutAuthorParagraph2"),
    t("aboutAuthorParagraph3"),
    t("aboutAuthorParagraph4"),
    t("aboutAuthorParagraph5"),
    t("aboutAuthorParagraph6"),
    t("aboutAuthorParagraph7"),
  ];

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(AUTHOR_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

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
            {t("aboutAuthorTitle")}
          </h1>

          <div className="mx-auto max-w-2xl space-y-6 text-pretty text-[1.02rem] leading-8 text-foreground/95">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <p className="pt-2 text-sm leading-relaxed text-muted-foreground">
              📩 {t("aboutAuthorContactLabel")}:{" "}
              <button
                type="button"
                onClick={copyEmail}
                className="cursor-pointer select-text text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {AUTHOR_EMAIL}
              </button>
            </p>
          </div>
        </section>
      </motion.div>

      {copied ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-foreground/90 ring-1 ring-white/10 backdrop-blur-md"
        >
          {t("copiedToast")}
        </motion.div>
      ) : null}
    </div>
  );
}
