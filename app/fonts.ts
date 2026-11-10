import {
  Dela_Gothic_One,
  JetBrains_Mono,
  Noto_Sans_JP,
  Outfit,
  Yuji_Syuku,
} from "next/font/google";

/*
 * ═══ app/fonts.ts — the site's FONTS ═══
 *
 * The Sensei-Dev font set via next/font: downloaded at build time and
 * self-hosted, with size-adjusted fallbacks. The Japanese families are not
 * preloaded (fetched only when a glyph needs them). `fontVariables` goes on
 * <html>; the --font-* stacks in globals.css read them. The site's own small
 * Yuji Syuku cut (app/fonts-yuji-site.css) sits first in the Japanese stacks.
 *
 * How a font reaches the page:
 *   Outfit(...) here  →  CSS variable --font-body-google on <html>
 *   →  globals.css: --font-body: var(--font-body-google), …
 *   →  Tailwind class `font-body` (or plain CSS font-family: var(--font-body)).
 *
 *   Role       Font              Tailwind class
 *   display    Dela Gothic One   font-display   (big headings)
 *   body       Outfit            font-body      (normal text)
 *   mono       JetBrains Mono    font-mono      (labels, code, terminal)
 *   jp         Noto Sans JP      font-jp        (Japanese text)
 *   jp brush   Yuji Syuku        font-jp-brush  (brush-style Japanese)
 *
 * HOW TO CHANGE A FONT: import another family from "next/font/google", keep
 * the same `variable` name, and nothing else needs to change. Add `weight`
 * when the font is not a variable font (like Dela_Gothic_One above).
 */

const displayFont = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-google",
  fallback: ["Noto Sans JP", "system-ui", "sans-serif"],
});

const bodyFont = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-google",
  fallback: ["system-ui", "sans-serif"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-google",
  fallback: ["ui-monospace", "monospace"],
});

const jpFont = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jp-google",
  preload: false,
  fallback: ["Hiragino Sans", "Yu Gothic", "sans-serif"],
});

const jpBrushFont = Yuji_Syuku({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jp-brush-google",
  preload: false,
  fallback: ["Noto Sans JP", "Yu Mincho", "serif"],
});

/* All the variable class names, joined — put on <html> in app/layout.tsx */
export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
  jpFont.variable,
  jpBrushFont.variable,
].join(" ");
