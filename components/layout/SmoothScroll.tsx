"use client";

/*
 * ═══ components/layout/SmoothScroll.tsx — smooth mouse-wheel scrolling ═══
 *
 * Lenis, with Sensei-Dev's settings (lerp 0.1): the wheel glides instead of
 * jumping in steps. Touch, the keyboard and the scrollbar stay native.
 *
 *   · Loaded after the page is up (its own small chunk), so it never delays
 *     the first paint.
 *   · Off with the OS "reduce motion" setting.
 *   · Lists that scroll on their own (palette, menu, lightbox) keep their
 *     native scrolling (allowNestedScroll).
 *   · Jumps (#links, back to top) stay instant and dialogs still lock the
 *     page: lib/scroll.ts drives Lenis when it is running.
 *
 * To turn it off: remove <SmoothScroll /> from app/layout.tsx.
 */

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/fx";
import { setSmoothScroller } from "@/lib/scroll";
import { soonAfterLoad } from "@/lib/perf/schedule";

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let destroy = () => {};
    let cancelled = false;
    soonAfterLoad(() => {
      if (cancelled) return;
      void import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({ lerp: 0.1, duration: 1.2, smoothWheel: true, allowNestedScroll: true, autoRaf: true });
        setSmoothScroller(lenis);
        destroy = () => {
          setSmoothScroller(null);
          lenis.destroy();
        };
      });
    });
    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  return null;
}
