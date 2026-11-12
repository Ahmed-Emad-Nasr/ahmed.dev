"use client";

/*
 * ═══ components/ui/SectionDivider.tsx — the slanted kanji banner ═══
 * A calm dark band with a red edge; the brush kanji drift sideways while the
 * page scrolls (framer-motion useScroll). Still with reduced motion.
 * Decorative: hidden from screen readers. From Sensei-Dev's SectionDivider.
 *
 *   text    → the kanji line (data/about.ts → DIVIDER)
 *   reverse → drift the other way
 *   angle   → the tilt in degrees
 */

import { useRef } from "react";
import { m as motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DIVIDER } from "@/data/about";

export default function SectionDivider({ text = DIVIDER, reverse = false, angle = -1 }: { text?: string; reverse?: boolean; angle?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : reverse ? ["-25%", "0%"] : ["0%", "-25%"]);

  return (
    <div
      ref={ref}
      className="relative z-20 my-10 flex h-20 md:h-24 w-full items-center overflow-hidden border-y border-foreground/10 bg-background/70 backdrop-blur-sm"
      style={{ transform: `rotate(${angle}deg) scale(1.05)` }}
      aria-hidden="true"
    >
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <motion.div style={{ x }} className="relative flex items-center gap-10 whitespace-nowrap select-none">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="brush-jp text-2xl md:text-3xl text-foreground/60" lang="ja">
              {text}
            </span>
            <span className="flex items-center gap-2.5">
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary/80" />
              <span className="font-mono text-[0.625rem] font-bold tracking-[0.45em] text-primary-ink">3OMDA</span>
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary/80" />
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
