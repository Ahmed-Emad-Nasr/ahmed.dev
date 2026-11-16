"use client";

/*
 * ═══ components/ui/CounterChip.tsx — the number box beside a section title ═══
 * Sensei-Dev's CounterChip. Usage:
 *   <CounterChip stats={[{ value: "08", label: "Answers ready" }]} />
 *   value → plain digits roll up one by one; anything else ("Top 2%",
 *           <CountUp />) is shown as is
 *   label → each word on its own line
 *   tone  → "primary" (red/blue) or "accent" (yellow, for proof numbers)
 *   several stats sit in one chip, separated by •
 */

import { m as motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { MOTION_EASE } from "@/lib/motion";

interface CounterStat {
  value: ReactNode;
  label: string;
}

const TONE = {
  primary: { frame: "border-primary/40", bracket: "border-primary", value: "text-primary-ink" },
  accent: { frame: "border-accent/40", bracket: "border-accent", value: "text-accent" },
} as const;

/* Odometer digits: each digit rolls up, one after the other */
function RollingDigits({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{value}</>;
  return (
    <>
      {value.split("").map((char, i) => (
        <span key={`${char}-${i}`} className="inline-block h-[1em] overflow-hidden leading-[1em] align-bottom">
          <motion.span
            className="block"
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.09, ease: MOTION_EASE }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function CounterChip({
  stats,
  tone = "primary",
  icon,
  className = "",
}: {
  stats: CounterStat[];
  tone?: keyof typeof TONE;
  icon?: ReactNode;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <div className={`relative flex max-w-full flex-wrap items-center gap-4 px-6 py-3 border bg-surface/60 ${t.frame} ${className}`}>
      <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${t.bracket}`} aria-hidden="true" />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${t.bracket}`} aria-hidden="true" />

      {icon ? <span className="shrink-0">{icon}</span> : null}

      <div className="flex flex-wrap items-center gap-3">
        {stats.map((stat, idx) => (
          <div key={`${stat.label}-${idx}`} className="flex items-center gap-3">
            {idx > 0 ? (
              <span className={`font-mono text-xl font-black opacity-50 ${t.value}`} aria-hidden="true">
                •
              </span>
            ) : null}
            {/* dir="ltr": the digits keep their order on a right-to-left page */}
            <span dir="ltr" className={`font-mono text-2xl font-black tabular-nums ${t.value}`}>
              {typeof stat.value === "string" && /^[0-9]+$/.test(stat.value) ? (
                <>
                  <span className="sr-only">{stat.value}</span>
                  <span aria-hidden="true">
                    <RollingDigits value={stat.value} />
                  </span>
                </>
              ) : (
                stat.value
              )}
            </span>
            <div className="flex flex-col">
              {stat.label.split(" ").map((word, i) => (
                <span key={`${word}-${i}`} className="eyebrow-sm text-on-surface-variant">
                  {word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
