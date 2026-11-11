/*
 * ═══ lib/smooth-scroll.ts — smooth WHEEL scrolling (Lenis) ═══
 *
 * The mouse wheel / trackpad glides to a stop instead of moving in steps.
 * Same settings as the Sensei-Dev original: lerp 0.1, duration 1.2.
 *
 * What it does NOT touch:
 *   • Jumps (nav links, command palette, `g` shortcuts, #hash) stay INSTANT —
 *     they go through lib/scroll.ts, which cancels any glide first.
 *   • Touch scrolling, the keyboard and the scrollbar stay the browser's own.
 *   • Dialogs (menu, palette, terminal, shortcuts, lightbox) and any inner
 *     scrolling list keep native scrolling.
 *
 * Cost: this file and Lenis are one small chunk that is downloaded in idle
 * time, only on devices with a mouse or trackpad, and never when the visitor
 * asked for reduced motion (components/layout/SmoothScroll.tsx decides).
 * The animation loop runs ONLY while a glide is in progress — there is no
 * requestAnimationFrame ticking while the page is still.
 *
 * HOW TO TUNE: `duration` = seconds a wheel push keeps gliding (higher =
 * slower, calmer). `wheelMultiplier` (default 1) = distance per wheel notch.
 */

import Lenis from "lenis";
import { isScrollLocked, registerSmoothScroll } from "@/lib/scroll";

/* Layers that must scroll natively even when their content fits (so the
   wheel never moves the page behind them) */
const NATIVE = '[role="dialog"], .yarl__root';

export function startSmoothScroll(): () => void {
  const lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    /* A list that scrolls on its own (detection rules, the terminal) keeps
       its own scrolling until it reaches its end */
    allowNestedScroll: true,
    /* Clicking a link to another page drops the glide */
    stopInertiaOnNavigate: true,
    prevent: (node) => isScrollLocked() || node.matches(NATIVE),
  });

  /* The loop: started by a wheel event, stops itself when the glide ends */
  let frame = 0;
  const tick = (time: number) => {
    lenis.raf(time);
    frame = lenis.isScrolling === "smooth" ? requestAnimationFrame(tick) : 0;
  };
  /* Capture phase = before Lenis's own wheel listener. Nothing is animating
     at this point, so raf() only re-syncs Lenis's clock after the pause —
     otherwise the first frame would see seconds of "elapsed" time and jump. */
  const wake = () => {
    if (frame) return;
    lenis.raf(performance.now());
    frame = requestAnimationFrame(tick);
  };
  window.addEventListener("wheel", wake, { capture: true, passive: true });

  let paused = false;
  registerSmoothScroll({
    /* stop() + start() is Lenis's public way to drop the animation and
       re-read the real scroll position */
    cancel: () => {
      lenis.stop();
      if (!paused) lenis.start();
    },
    pause: () => {
      paused = true;
      lenis.stop();
    },
    resume: () => {
      paused = false;
      lenis.start();
    },
  });

  return () => {
    registerSmoothScroll(null);
    window.removeEventListener("wheel", wake, { capture: true });
    cancelAnimationFrame(frame);
    lenis.destroy();
  };
}
