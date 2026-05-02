import type { Locale } from "@/lib/i18n-messages";

/** Russian plural class for nouns like «день» (1 день / 2 дня / 5 дней, 11–14 → дней). */
export function ruDayNoun(n: number): "день" | "дня" | "дней" {
  const abs = Math.floor(Math.abs(n));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "дней";
  if (mod10 === 1) return "день";
  if (mod10 >= 2 && mod10 <= 4) return "дня";
  return "дней";
}

/** «N день» / «N дня» / «N дней» for subtitles and counters. */
export function formatRuDaysCount(n: number): string {
  return `${n} ${ruDayNoun(n)}`;
}

function enDayWord(n: number): "day" | "days" {
  return Math.abs(n) === 1 ? "day" : "days";
}

/** «1 day» / «2 days» (0 → «0 days»). */
export function formatEnDaysCount(n: number): string {
  return `${n} ${enDayWord(n)}`;
}

export function formatDaysCount(locale: Locale, n: number): string {
  return locale === "ru" ? formatRuDaysCount(n) : formatEnDaysCount(n);
}

/** After «Всего»: «5 чистых дней», «1 чистый день», «3 чистых дня». */
export function formatRuCleanDaysPhrase(n: number): string {
  const abs = Math.floor(Math.abs(n));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return `${n} чистых дней`;
  if (mod10 === 1) return `${n} чистый день`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} чистых дня`;
  return `${n} чистых дней`;
}

/** For footer: «5 clean days», «1 clean day». */
export function formatEnCleanDaysPhrase(n: number): string {
  return Math.abs(n) === 1 ? `${n} clean day` : `${n} clean days`;
}

export function formatCleanDaysPhrase(locale: Locale, n: number): string {
  return locale === "ru" ? formatRuCleanDaysPhrase(n) : formatEnCleanDaysPhrase(n);
}
