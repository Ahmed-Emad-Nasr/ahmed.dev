"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useMounted, useReducedMotion } from "@/lib/use-client";

/* ═══ components/ui/CountUp.tsx ═══
   Usage: <CountUp target={300} suffix="+" />  → counts 0 → 300+ once, when
   scrolled into view (1.25 s; instant with reduced motion). Used by StatsBar.
   <CountUpText text="40,884" /> → the same for a figure that is already a
   string (case pages, components/blog/CaseNumbers.tsx); text that is not a
   plain number ("2h 10m") is shown as it is. */

/** Animated counter: eases 0 -> target when scrolled into view. */
function useCountUp(
  target: number,
  ref: React.RefObject<HTMLSpanElement | null>,
  duration = 1400,
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

/* "40,884" / "52" / "18+" → [40884, "+"]; anything else → null */
const parseFigure = (text: string): [number, string] | null => {
  const m = /^(\d{1,3}(?:,\d{3})+|\d+)(\D{0,2})$/.exec(text.trim());
  return m ? [Number(m[1]!.replace(/,/g, "")), m[2]!] : null;
};

export function CountUpText({ text, duration = 1400 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const figure = parseFigure(text);
  const reduced = useReducedMotion();
  /* In the server HTML (and while hydrating) the real figure is shown — what
     a crawler or a reader without JavaScript should see. Mounted later by an
     in-site navigation, it starts at 0 and counts. */
  const mounted = useMounted();
  const [shown, setShown] = useState<string | null>(() => (mounted && figure && !reduced ? "0" : null));
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!figure || !inView || reduced) return;
    const [target, suffix] = figure;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setShown(`${Math.round((1 - Math.pow(1 - t, 3)) * target).toLocaleString("en-US")}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setShown(null);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- figure is derived from text
  }, [inView, reduced, text, duration]);

  return <span ref={ref}>{shown ?? text}</span>;
}
