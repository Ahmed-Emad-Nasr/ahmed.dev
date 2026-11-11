"use client";

/*
 * ═══ components/layout/SmoothScroll.tsx — turns smooth wheel scrolling on ═══
 *
 * Mounted once in app/layout.tsx. Renders nothing: it only decides WHETHER
 * and WHEN to load lib/smooth-scroll.ts (Lenis):
 *   • only where there is a mouse or trackpad (a phone never downloads it),
 *   • never when the visitor asked for reduced motion,
 *   • in idle time, after the page is on screen.
 * It also drops a glide in progress when the page changes, so the new page
 * always opens where the router put it.
 *
 * The scrolling itself — speed, what is excluded — is lib/smooth-scroll.ts.
 */

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/fx";
import { cancelSmoothScroll } from "@/lib/scroll";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(any-pointer: fine)").matches) return;

    let stop: (() => void) | undefined;
    let cancelled = false;
    const load = () => {
      void import("@/lib/smooth-scroll")
        .then((mod) => {
          if (!cancelled) stop = mod.startSmoothScroll();
        })
        .catch(() => {
          /* offline and never cached: the browser's own scrolling stays */
        });
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 600);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      stop?.();
    };
  }, []);

  /* A new page: forget the old page's glide before the first paint */
  useLayoutEffect(() => {
    cancelSmoothScroll();
  }, [pathname]);

  return null;
}
