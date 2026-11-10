"use client";

/*
 * ═══ components/layout/ThemeProvider.tsx — dark / light theme ═══
 * Uses the next-themes library: it puts class="dark" (or "light") on <html>
 * and remembers the choice in localStorage. The colours for each theme are
 * in app/globals.css (:root = light, .dark = dark).
 *   defaultTheme="dark"  → first-time visitors get the dark theme
 *   enableSystem={false} → ignore the OS dark/light setting
 * The toggle button is ThemeToggle.tsx; the circle-wipe animation is
 * ThemeFxProvider.tsx.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
