"use client";

/*
 * ═══ lib/perf/ScrollShield.tsx — no hover effects while the page scrolls fast ═══
 *
 * While the page moves, the cursor stands still and every card slides under
 * it: each one would start (and at once drop) its hover — border, glow,
 * spotlight, colour image, tilt. Measured, that doubles the work of every
 * scrolled frame, and it is the main cause of a stuttering scroll.
 *
 * So above ENGAGE px/ms an invisible sheet (.scroll-shield, app/globals.css)
 * comes between the cursor and the content, and it goes away as soon as the
 * scroll slows below RELEASE or stops. The navbar, toasts and dialogs sit
 * above the sheet and always answer.
 * (A sheet, not `pointer-events: none` on the content: that property is
 * inherited, so switching it restyles every element on the page — a stutter
 * of its own.)
 *
 * Scrolling itself is the browser's own — this only listens to it.
 * Mounted from components/layout/DeferredGlobalEffects.tsx, and only on
 * devices that have hover (a touch screen has nothing to protect).
 */

import { useEffect } from "react";

const ENGAGE = 0.5;
const RELEASE = 0.2;

export default function ScrollShield() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const shield = document.createElement("div");
    shield.className = "scroll-shield";
    shield.setAttribute("aria-hidden", "true");
    document.body.appendChild(shield);

    let fast = false;
    let lastY = window.scrollY;
    let lastT = 0;
    let calm = 0;
    const setFast = (on: boolean) => {
      if (on === fast) return;
      fast = on;
      shield.style.display = on ? "block" : "";
    };
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT;
      /* A longer gap = the first event of a new scroll (or an instant jump):
         there is no speed to read yet. (Wide enough for a browser with
         smooth scrolling off, where each wheel notch is one separate step.) */
      if (dt > 0 && dt < 200) {
        const speed = Math.abs(y - lastY) / dt;
        if (speed > ENGAGE) setFast(true);
        else if (speed < RELEASE) setFast(false);
      }
      lastY = y;
      lastT = now;
      window.clearTimeout(calm);
      calm = window.setTimeout(() => setFast(false), 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(calm);
      shield.remove();
    };
  }, []);
  return null;
}
