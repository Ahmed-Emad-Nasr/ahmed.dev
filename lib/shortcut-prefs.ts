"use client";

/*
 * ═══ lib/shortcut-prefs.ts — single-key shortcuts ON / OFF ═══
 *
 * WCAG 2.1.4 (Character Key Shortcuts): a shortcut that is a single letter
 * or symbol (/, ?, g + h …, typing 3omda) can fire by accident for people
 * using speech input or a switch, so it must be possible to turn them off.
 * The visitor does that from the command palette (Ctrl/⌘+K → "single-key")
 * or from the "?" sheet; the choice is remembered in this browser.
 * Ctrl/⌘+K and Esc are not single-key shortcuts and always work.
 *
 *   singleKeyShortcutsOn()     → read the current choice (default: on)
 *   setSingleKeyShortcuts(on)  → change it; fires SHORTCUTS_EVENT
 */

const KEY = "sensei-single-key-shortcuts";
export const SHORTCUTS_EVENT = "sensei-single-key-shortcuts";

/* The choice made this visit — used when storage is blocked */
let chosenThisVisit: boolean | null = null;

export function singleKeyShortcutsOn(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored !== null) return stored !== "off";
  } catch {
    /* storage blocked (private mode, strict cookie settings) */
  }
  return chosenThisVisit ?? true;
}

export function setSingleKeyShortcuts(on: boolean): void {
  chosenThisVisit = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* not remembered across visits; chosenThisVisit still applies it */
  }
  window.dispatchEvent(new CustomEvent(SHORTCUTS_EVENT, { detail: on }));
}
