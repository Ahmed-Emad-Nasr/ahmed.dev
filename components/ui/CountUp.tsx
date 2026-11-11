"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-client";

/* ═══ components/ui/CountUp.tsx ═══
   Usage: <CountUp target={300} suffix="+" />  → counts 0 → 300+ once, when
   scrolled into view (1.25 s; instant with reduced motion). Used by StatsBar. */

/** Animated counter: eases 0 -> target when scrolled into view. */
function useCountUp(
  target: number,
  ref: React.RefObject<HTMLSpanElement | null>,
  duration = 860,
): number {
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, duration]);

  /* Reduced motion: the final number straight away, no count */
  return inView && reduced ? target : value;
}

export function CountUp({
  target,
  suffix = "",
  duration,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const value = useCountUp(target, ref, duration);
  return (
    <span ref={ref}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
