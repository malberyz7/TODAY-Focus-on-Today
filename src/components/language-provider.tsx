"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  defaultLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
  type MessageKey,
  messages,
} from "@/lib/i18n-messages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function readLocaleFromStorage(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw === "en" || raw === "ru") return raw;
  } catch {
    /* ignore */
  }
  return defaultLocale;
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLocaleState(readLocaleFromStorage());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "ru" ? "ru" : "en";
    }
  }, [locale]);

  const t = useCallback((key: MessageKey) => messages[locale][key], [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-medium ring-1 ring-white/10",
        className
      )}
      role="group"
      aria-label={t("language")}
    >
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className={cn(
          "h-7 rounded-full px-2.5",
          locale === "ru" && "bg-white/15 text-foreground shadow-sm"
        )}
        onClick={() => setLocale("ru")}
      >
        {t("langRu")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className={cn(
          "h-7 rounded-full px-2.5",
          locale === "en" && "bg-white/15 text-foreground shadow-sm"
        )}
        onClick={() => setLocale("en")}
      >
        {t("langEn")}
      </Button>
    </div>
  );
}
