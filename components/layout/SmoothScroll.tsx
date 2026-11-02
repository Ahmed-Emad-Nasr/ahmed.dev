"use client";

/*
 * Lenis smooth wheel scrolling (lerp 0.08, Sensei-Dev's feel). Touch keeps
 * native scrolling; with "reduce motion" the wheel is native too. Jumps
 * (links, shortcuts) are instant and go through lib/scroll.ts.
 */

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { registerLenis } from "@/lib/scroll";

function LenisBridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    registerLenis(lenis);
    return () => registerLenis(null);
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  /* Read once on the client; ReactLenis renders nothing on the server */
  const [smooth] = useState(() => {
    if (typeof window === "undefined") return true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    return !reduced && !coarse && !lowPower;
  });
  return (
    <ReactLenis
      root
      options={{ lerp: 0.08, smoothWheel: smooth, autoRaf: smooth }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
