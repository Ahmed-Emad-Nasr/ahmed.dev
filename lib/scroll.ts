/*
 * lib/scroll.ts — every programmatic scroll goes through here, so it works
 * the same across every caller. Jumps are instant by design.
 *
 *   scrollToElement(el) → jump so `el` sits just below the fixed navbar
 *   scrollToTop()       → back to the top
 *   lockScroll(true)    → freeze the page behind an open menu/dialog
 *   isTypingTarget(e.target) → true inside inputs (shortcuts ignore those)
 * To jump to an id that may be on another page or not loaded yet, use
 * scrollToHash() from lib/perf/jump.ts instead.
 */

/** Height of the fixed header plus a little air (read from the DOM: it changes with breakpoints) */
function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>("[data-site-header='true']");
  return (header?.offsetHeight ?? 0) + 15;
}

/* Every programmatic scroll goes through here: jumps are INSTANT */
/* Lenis (components/layout/SmoothScroll.tsx) when it runs: a jump has to go
   through it, or its next wheel glide would start from the old position. */
type SmoothScroller = {
  scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void;
  stop: () => void;
  start: () => void;
};
let smooth: SmoothScroller | null = null;
export function setSmoothScroller(scroller: SmoothScroller | null): void {
  smooth = scroller;
  if (smooth && locks > 0) smooth.stop();
}

function scrollToY(top: number): void {
  const target = Math.max(0, top);
  if (smooth) smooth.scrollTo(target, { immediate: true, force: true });
  else window.scrollTo({ top: target, behavior: "auto" });
}

/** The scroll position that puts an element just under the fixed header */
export function scrollTargetOf(el: Element): number {
  return Math.max(0, window.scrollY + el.getBoundingClientRect().top - getHeaderOffset());
}

export function scrollToElement(el: Element | null): void {
  if (el) scrollToY(scrollTargetOf(el));
}

export function scrollToTop(): void {
  scrollToY(0);
}

/** Focus is in a field: keyboard shortcuts must not fire */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable;
}

/* Hold the page still while a dialog is open (mobile menu, command palette,
   shortcuts, terminal). Calls are counted, so a dialog opened from another
   dialog cannot unlock the page under the one that is still open: every
   lockScroll(true) needs its own lockScroll(false). */
let locks = 0;
export function lockScroll(locked: boolean): void {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  const on = locks > 0;
  document.documentElement.style.overflow = on ? "hidden" : "";
  document.body.style.overflow = on ? "hidden" : "";
  if (on) smooth?.stop();
  else smooth?.start();
}
