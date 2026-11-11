"use client";

/*
 * ═══ components/home/RoleTicker.tsx — the "> SOC Analyst_" typing line in the hero ═══
 *
 * Types a role, holds it, erases it letter by letter, types the next one.
 * The list of roles is PROFILE.roles in data/profile.ts.
 * Screen readers get the whole list at once (the sr-only span); visitors who
 * prefer reduced motion see all roles joined with " · " instead of typing.
 * It pauses while off-screen or when the browser tab is hidden.
 */

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/fx";

/* Timing in milliseconds — change these to speed up / slow down the typing */
const TYPE = 94; // per letter typed
const ERASE = 47; // per letter erased
const HOLD = 2070; // how long a full role stays on screen
const GAP = 400; // pause between erasing one role and typing the next

export function RoleTicker({ roles, className = "" }: { roles: string[]; className?: string }) {
  const [text, setText] = useState(roles[0] ?? "");
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const longest = Math.max(...roles.map((role) => role.length), 0);

  useEffect(() => {
    if (roles.length < 2) return;
    if (prefersReducedMotion()) {
      setReduced(true);
      return;
    }

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (ref.current) observer.observe(ref.current);

    /* A tiny state machine: hold → erase → type → hold … (one tick per letter) */
    let role = 0;
    let shown = roles[0].length;
    let phase: "hold" | "erase" | "type" = "hold";
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!visible || document.hidden) {
        timer = setTimeout(tick, 400);
        return;
      }
      if (phase === "hold") {
        phase = "erase";
        timer = setTimeout(tick, ERASE);
      } else if (phase === "erase") {
        shown -= 1;
        setText(roles[role].slice(0, shown));
        if (shown > 0) {
          timer = setTimeout(tick, ERASE);
        } else {
          role = (role + 1) % roles.length;
          phase = "type";
          timer = setTimeout(tick, GAP);
        }
      } else {
        shown += 1;
        setText(roles[role].slice(0, shown));
        if (shown < roles[role].length) {
          timer = setTimeout(tick, TYPE);
        } else {
          phase = "hold";
          timer = setTimeout(tick, HOLD);
        }
      }
    };
    timer = setTimeout(tick, HOLD + 1200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [roles]);

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
          <span className="text-foreground/85">{text}</span>
          <span className="ml-1 inline-block h-[1.1em] w-[0.55em] bg-primary animate-[caret-blink_1.36s_step-end_infinite]" />
        </span>
      )}
    </p>
  );
}
