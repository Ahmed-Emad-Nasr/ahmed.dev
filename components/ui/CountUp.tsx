"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onceInView } from "@/lib/in-view";
import { useMounted, useReducedMotion } from "@/lib/use-client";

/* ═══ components/ui/CountUp.tsx ═══
   Usage: <CountUp target={300} suffix="+" />  → counts 0 → 300+ once, when
   scrolled into view (0.86 s; instant with reduced motion). Used by StatsBar.
   <CountUpText text="40,884" /> → the same for a figure that is already a
   string (case pages, components/blog/CaseNumbers.tsx); text that is not a
   plain number ("2h 10m") is shown as it is.

   The number is written straight into the element's one text node, once per
   animation frame — React does not re-render the component 50 times per
   count — and the element is watched by the shared observer in
   lib/in-view.ts. No animation library. */

/* easeOutCubic */
const ease = (t: number): number => 1 - Math.pow(1 - t, 3);

/* The element's single text node (React renders the text as one string) */
function write(el: HTMLElement, text: string): void {
  const node = el.firstChild;
  if (node) node.nodeValue = text;
  else el.textContent = text;
}

/* Runs `frame(progress 0→1 eased)` over `duration` ms; returns the stopper */
function run(duration: number, frame: (eased: number) => void): () => void {
  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, Math.max(0, (now - start) / duration));
    frame(ease(t));
    if (t < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

const fmt = (n: number, suffix: string) => `${n.toLocaleString("en-US")}${suffix}`;

/** Animated counter: eases 0 -> target when scrolled into view. */
export function CountUp({
  target,
  suffix = "",
  duration = 860,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let stopCount = () => {};
    const stopWatch = onceInView(
      el,
      () => {
        /* Reduced motion: the final number straight away, no count */
        if (reduced) write(el, fmt(target, suffix));
        else stopCount = run(duration, (e) => write(el, fmt(Math.round(e * target), suffix)));
      },
      "-40px",
    );
    return () => {
      stopWatch();
      stopCount();
    };
  }, [reduced, target, suffix, duration]);

  return <span ref={ref}>{fmt(0, suffix)}</span>;
}

/* "40,884" / "52" / "18+" → [40884, "+"]; anything else → null */
const parseFigure = (text: string): [number, string] | null => {
  const m = /^(\d{1,3}(?:,\d{3})+|\d+)(\D{0,2})$/.exec(text.trim());
  return m ? [Number(m[1]!.replace(/,/g, "")), m[2]!] : null;
};

export function CountUpText({ text, duration = 860 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  /* In the server HTML (and while hydrating) the real figure is shown — what
     a crawler or a reader without JavaScript should see. Mounted later by an
     in-site navigation, it starts at 0 and counts. */
  const mounted = useMounted();
  const [startAtZero] = useState(() => mounted && parseFigure(text) !== null && !reduced);

  /* Before paint, so the real figure never flashes on an in-site navigation */
  useLayoutEffect(() => {
    if (startAtZero && ref.current && parseFigure(text) && !reduced) write(ref.current, "0");
  }, [startAtZero, text, reduced]);

  useEffect(() => {
    const el = ref.current;
    const figure = parseFigure(text);
    if (!el || !figure || reduced) return;
    const [target, suffix] = figure;
    let stopCount = () => {};
    let counting = false;
    const stopWatch = onceInView(
      el,
      () => {
        counting = true;
        stopCount = run(duration, (e) => {
          write(el, e >= 1 ? text : fmt(Math.round(e * target), suffix));
          if (e >= 1) counting = false;
        });
      },
      "-40px",
    );
    return () => {
      stopWatch();
      stopCount();
      /* Stopped half way (text changed, reduced motion switched on): leave the real figure */
      if (counting) write(el, text);
    };
  }, [text, reduced, duration]);

  return <span ref={ref}>{text}</span>;
}
