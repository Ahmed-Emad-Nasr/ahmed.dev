import { Cairo } from "next/font/google";

/*
 * ═══ app/ar/fonts.ts — the font of the Arabic pages ═══
 *
 * Cairo (variable, Arabic + Latin), self-hosted by next/font like the fonts
 * in app/fonts.ts. Only the Arabic pages import this file, so the rest of
 * the site never downloads it. Its CSS variable (--font-arabic) goes on the
 * page's lang="ar" wrapper; the .lang-ar rules in globals.css put it first in
 * the display / body stacks there.
 */
export const arabicFont = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-arabic",
  fallback: ["Tahoma", "Segoe UI", "sans-serif"],
});
