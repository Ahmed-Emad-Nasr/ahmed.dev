"use client";

/*
 * ═══ components/ui/Motion.tsx — card hover effects ═══
 *   <CardEffects index={n} /> → put inside a card that has class "group":
 *                               a big faded number in the corner + the red
 *                               top line that grows on hover.
 *   <TiltCard>               → a card that tilts in 3D toward the mouse
 *                               (max = tilt in degrees, default 7).
 *   <SpotlightHost />        → mounted once (DeferredGlobalEffects); makes the
 *                               soft glow follow the mouse on `.spotlight` cards
 *                               by setting --mx / --my (glow CSS in globals.css).
 * Typical card:
 *   <TiltCard className="group spotlight relative …"><CardEffects index={1} />…</TiltCard>
 */

import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { m as motion, useMotionValue, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/fx";

/* tone="blue" → the top line and the big number light up in the blue
   (tertiary) colour instead of red. Pair it with "spotlight spotlight-blue"
   and hover:border-tertiary/40 on the card itself. */
/* topLine → also draw the line across the top of the card on hover. Only
   the roles cards use it; every other card keeps the number and the glow. */
export function CardEffects({ index, tone = "red", topLine = false }: { index?: number; tone?: "red" | "blue"; topLine?: boolean }) {
  const blue = tone === "blue";
  return (
    <>
      {index !== undefined && (
        <span
          className={`pointer-events-none absolute -right-2 -bottom-6 font-display text-[7rem] font-black leading-none text-foreground/[0.03] transition-all duration-700 group-hover:-translate-y-[10.2px] select-none ${blue ? "group-hover:text-tertiary/10" : "group-hover:text-primary/10"}`}
          aria-hidden="true"
          data-deco={String(index).padStart(2, "0")}
        />
      )}
      {topLine && (
        <div
          className={`pointer-events-none absolute top-0 left-0 z-10 h-[2px] w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 ${blue ? "bg-tertiary" : "bg-primary"}`}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/** One global listener: feeds --mx/--my to any hovered .spotlight card. */
export function SpotlightHost() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: globalThis.MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.(
        ".spotlight",
      ) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--mx",
        `${((e.clientX - r.left) / r.width) * 100}%`,
      );
      el.style.setProperty(
        "--my",
        `${((e.clientY - r.top) / r.height) * 100}%`,
      );
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}

/** 3D tilt on hover with spring return. Pure framer-motion, zero WebGL. */
/* 3D tilt on hover. The springs (stiffness / damping) set how soft it feels. */
export function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 210, damping: 20 });
  const sry = useSpring(ry, { stiffness: 210, damping: 20 });

  const onMove = (e: MouseEvent) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max);
    ry.set(px * max);
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
