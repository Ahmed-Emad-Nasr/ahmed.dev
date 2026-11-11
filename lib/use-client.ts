"use client";

/*
 * ═══ lib/use-client.ts — browser-only values, without setState in an effect ═══
 *
 *   useMounted()        → false in the server HTML and during hydration,
 *                         true right after. For UI that must match the
 *                         server first (theme icon, …).
 *   useMediaQuery(q)    → live result of a CSS media query; false on the
 *                         server. Re-renders only when the answer changes.
 *   useReducedMotion()  → useMediaQuery("(prefers-reduced-motion: reduce)").
 *
 * Both are built on useSyncExternalStore, React's own way to read something
 * outside React — no "mount, then setState" second render.
 */

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = (): boolean => useMediaQuery("(prefers-reduced-motion: reduce)");
