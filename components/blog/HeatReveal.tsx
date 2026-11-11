"use client";

/*
 * ═══ components/blog/HeatReveal.tsx — ATT&CK tiles heat up as they arrive ═══
 *
 * Each tile of the ATT&CK section starts as a plain surface and fills with
 * its own heat (more reports = deeper red) when it comes into view — once.
 *
 * Renders nothing visible. It marks the tiles of the <section> it sits in as
 * "cold" (data-cold; the look is in app/globals.css) and removes the mark
 * from each one as it crosses the lower part of the screen; the colour then
 * fades in through the tile's own CSS transition.
 *
 * Why not a CSS scroll-driven animation (it used to be one): that redrew
 * every tile on every scrolled frame — two thirds of the drawing work of
 * the whole blog part of the page. This way a tile is drawn once, when it arrives.
 * Without JavaScript, or with reduced motion, the tiles are simply filled.
 */

import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/fx";

const TILES = ".attack-seg, .attack-tile, .attack-cell";

export default function HeatReveal() {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = ref.current?.closest("section");
    if (!section || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const tiles = [...section.querySelectorAll(TILES)];
    tiles.forEach((t) => t.setAttribute("data-cold", ""));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.removeAttribute("data-cold");
          io.unobserve(e.target);
        }
      },
      /* "arrived" = past the bottom 12% of the screen */
      { rootMargin: "0px 0px -12% 0px" },
    );
    tiles.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      tiles.forEach((t) => t.removeAttribute("data-cold"));
    };
  }, []);

  return <span ref={ref} hidden />;
}
