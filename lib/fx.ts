"use client";

/*
 * Motion settings: the shared easing curve, the theme-transition duration
 * (adjustable from the command palette, persisted), reduced motion and a
 * cheap device tier.
 *
 * ═══ lib/fx.ts ═══
 *   FX_DURATIONS / DEFAULT_FX_DURATION → theme-switch animation lengths (ms);
 *     the palette lists one "Transition speed …ms" command per value.
 *   prefersReducedMotion() → true if the visitor's OS asks for less motion;
 *     check it before starting any JS animation.
 *   THEME_CANVAS_BG → background colours the theme wipe paints; keep equal
 *     to --background in app/globals.css.
 */

const DURATION_KEY = "sensei-fx-duration";
const DEFAULT_FX_DURATION = 900;
export const FX_DURATIONS = [450, 900, 1400] as const;

/* The last choice made this visit — used when storage is blocked */
let chosenThisVisit: string | null = null;

export function getFxDuration(): number {
  if (typeof window === "undefined") return DEFAULT_FX_DURATION;
  let stored: string | null = chosenThisVisit;
  try {
    stored = window.localStorage.getItem(DURATION_KEY) ?? chosenThisVisit;
  } catch {
    /* storage blocked (private mode, strict cookie settings) */
  }
  /* Nothing chosen yet → the default. (Number(null) is 0, which the clamp
     below turned into 300ms: every first-time visitor got the fastest
     wipe, and the palette marked no speed as current.) */
  if (stored === null || stored === "") return DEFAULT_FX_DURATION;
  const raw = Number(stored);
  if (!Number.isFinite(raw)) return DEFAULT_FX_DURATION;
  return Math.min(2000, Math.max(300, raw));
}

export function setFxDuration(ms: number): void {
  chosenThisVisit = String(ms);
  try {
    window.localStorage.setItem(DURATION_KEY, String(ms));
  } catch {
    /* not remembered across visits; chosenThisVisit still applies it */
  }
  window.dispatchEvent(new CustomEvent("sensei-fx-duration", { detail: ms }));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type DeviceTier = "full" | "lite";

/** Static heuristics: cores, RAM, save-data. Cheap, no probe needed. */
export function getDeviceTier(): DeviceTier {
  if (typeof navigator === "undefined") return "full";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return "lite";
  const cores = nav.hardwareConcurrency ?? 8;
  const ram = nav.deviceMemory ?? 8;
  if (cores <= 4 && ram <= 4) return "lite";
  return "full";
}

/** New-theme canvas palette (must match globals.css tokens). */
export const THEME_CANVAS_BG: Record<"light" | "dark", string> = {
  light: "#f7f5f0",
  dark: "#080808",
};
