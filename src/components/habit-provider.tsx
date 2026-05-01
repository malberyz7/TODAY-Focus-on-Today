"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useHabitStore } from "@/store/habit-store";

const HabitsReadyContext = createContext(false);

/**
 * Waits for zustand-persist to rehydrate from localStorage, then seeds demo habits if needed.
 * Children should gate UI on `useHabitsReady()` to avoid empty-state flash.
 */
export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const finish = () => {
      useHabitStore.getState().migrateLegacyHabits();
      useHabitStore.getState().seedIfEmpty();
      setReady(true);
    };

    if (useHabitStore.persist.hasHydrated()) {
      finish();
      return;
    }

    return useHabitStore.persist.onFinishHydration(finish);
  }, []);

  return <HabitsReadyContext.Provider value={ready}>{children}</HabitsReadyContext.Provider>;
}

export function useHabitsReady() {
  return useContext(HabitsReadyContext);
}
