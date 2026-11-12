"use client";

/*
 * ═══ components/home/RoleTicker.tsx — the "> SOC Analyst_" line in the hero ═══
 *
 * Shows a role, holds it, then DECRYPTS into the next one: the letters
 * scramble through random characters and settle into the new word
 * (scramble() below — a few lines, no library).
 * The list of roles is PROFILE.roles in data/profile.ts.
 * Screen readers get the whole list at once (the sr-only span); visitors who
 * prefer reduced motion see all roles joined with " · " instead.
 * It pauses while off-screen or when the browser tab is hidden.
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-client";

/* Timing — change these to speed up / slow down */
const HOLD = 1600; // ms a role stays on screen before the next one
const DECRYPT = 0.75; // seconds the scramble into the next role takes
/* The characters the letters flicker through */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>";

/* Decrypt `el` from its current text into `to` over DECRYPT seconds: the
   letters settle left to right, the ones not settled yet flicker through
   CHARS. Returns a function that stops it. */
function scramble(el: HTMLElement, to: string, onDone: () => void): () => void {
  const from = el.textContent ?? "";
  const start = performance.now();
  let frame = 0;
  let last = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / (DECRYPT * 1000));
    if (now - last > 45 || t === 1) {
      last = now;
      const settled = Math.floor(Math.max(0, (t - 0.12) / 0.88) * to.length);
      const length = Math.round(from.length + (to.length - from.length) * t);
      let text = to.slice(0, settled);
      for (let i = settled; i < length; i++) text += to[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
      el.textContent = t === 1 ? to : text;
    }
    if (t < 1) frame = requestAnimationFrame(tick);
    else onDone();
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function RoleTicker({ roles, className = "" }: { roles: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const longest = Math.max(...roles.map((role) => role.length), 0);

  useEffect(() => {
    const el = textRef.current;
    if (roles.length < 2 || reduced || !el) return;

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (ref.current) observer.observe(ref.current);

    let role = 0;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let stopScramble = () => {};

    /* hold → decrypt into the next role → hold … */
    const next = () => {
      if (stopped) return;
      if (!visible || document.hidden) {
        timer = setTimeout(next, 400);
        return;
      }
      role = (role + 1) % roles.length;
      stopScramble = scramble(el, roles[role]!, () => {
        timer = setTimeout(next, HOLD);
      });
    };
    timer = setTimeout(next, HOLD + 1200);

    return () => {
      stopped = true;
      clearTimeout(timer);
      stopScramble();
      observer.disconnect();
    };
  }, [roles, reduced]);

  return (
    <p ref={ref} className={`font-mono font-bold uppercase tracking-[0.18em] ${className}`}>
      <span className="sr-only">{roles.join(", ")}</span>
      {reduced ? (
        <span aria-hidden="true" className="text-foreground/80">
          <span className="text-primary">&gt; </span>
          {roles.join(" · ")}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex h-[1.6em] max-w-full items-center overflow-hidden whitespace-nowrap text-left"
          /* Fixed width = the longest role, so the line never changes size while typing */
          style={{ width: `calc(${longest + 3} * (1ch + 0.18em))` }}
        >
          <span className="text-primary">&gt;&nbsp;</span>
          <span ref={textRef} className="text-foreground/85">
            {roles[0]}
          </span>
          <span className="ml-1 inline-block h-[1.1em] w-[0.55em] bg-primary animate-[caret-blink_0.82s_step-end_infinite]" />
        </span>
      )}
    </p>
  );
}
