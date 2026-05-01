import { dayKey } from "@/lib/habit-logic";

function storageKey(): string {
  return `anti-sryv-dismissed-${dayKey(new Date())}`;
}

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(storageKey());
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(storageKey(), JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function isAntiSryvDismissedToday(habitId: string): boolean {
  return readIds().has(habitId);
}

export function dismissAntiSryvForToday(habitId: string) {
  const ids = readIds();
  ids.add(habitId);
  writeIds(ids);
}
