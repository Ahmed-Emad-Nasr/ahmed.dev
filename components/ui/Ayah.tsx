/*
 * ═══ components/ui/Ayah.tsx — a line of Quran (or dhikr) inside a page ═══
 *
 * The site's pages are English, left to right, and most labels are spaced
 * out and uppercase. Arabic needs the opposite: right to left, joined
 * letters (no letter-spacing), and a font that draws the tashkeel. This
 * wrapper does all of it, so a verse can go anywhere without breaking:
 *
 *   <Ayah source="طه: 114">وَقُل رَّبِّ زِدْنِي عِلْمًا</Ayah>
 *
 *   source → the surah and number; shown as the hover title
 *   as     → "span" (default) or "p" / "div"
 *
 * The font stack (.font-ayah in globals.css) uses naskh fonts the visitor
 * already has, so nothing is downloaded. The text is never cut, split or
 * animated letter by letter: pass the whole line, as written in the mushaf.
 */

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  source?: string;
  as?: "span" | "p" | "div";
  className?: string;
};

export default function Ayah({ children, source, as: Tag = "span", className = "" }: Props) {
  return (
    <Tag lang="ar" dir="rtl" translate="no" title={source} className={`font-ayah ${className}`}>
      {children}
    </Tag>
  );
}
