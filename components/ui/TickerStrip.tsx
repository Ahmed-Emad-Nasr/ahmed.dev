/*
 * ═══ components/ui/TickerStrip.tsx — a band of words drifting past ═══
 * Brush kanji and mono caps between two sections (data/about.ts → TICKER).
 * The track is duplicated so the loop is seamless; hovering or tabbing in
 * pauses it, and it stands still with reduced motion (app/globals.css
 * .marquee). Decorative: hidden from screen readers. From Sensei-Dev.
 */

import type { CSSProperties } from "react";
import { TICKER } from "@/data/about";

const JP = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;

export default function TickerStrip({ items = TICKER, duration = 56 }: { items?: readonly string[]; duration?: number }) {
  const loop = [...items, ...items];
  return (
    <div
      className="marquee relative z-20 my-6 flex h-14 w-full items-center overflow-hidden border-y border-foreground/10 bg-background/70 backdrop-blur-sm md:h-16"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track" style={{ animationDuration: `${duration}s` } as CSSProperties}>
        {loop.map((item, i) => {
          const isJp = JP.test(item);
          return (
            <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-8 pr-8">
              <span
                className={
                  isJp
                    ? "brush-jp text-lg leading-none text-foreground/60"
                    : "font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-foreground/60"
                }
                lang={isJp ? "ja" : undefined}
              >
                {item}
              </span>
              <span className="inline-block h-1 w-1 rotate-45 bg-primary/70" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
