import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { AntiSryvDialogHost } from "@/components/anti-sryv-dialog-host";
import { HabitProvider } from "@/components/habit-provider";
import { LanguageProvider } from "@/components/language-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Still — привычки и дневник",
  description:
    "Отслеживайте привычки, ведите дневник, смотрите серии и прогресс в спокойном интерфейсе.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`dark ${inter.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <LanguageProvider>
          <HabitProvider>
            <AntiSryvDialogHost />
            <main className="flex flex-1 flex-col">{children}</main>
          </HabitProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
