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

/* ── Smooth wheel scrolling (lib/smooth-scroll.ts, Lenis) plugs in here ──
   It is loaded lazily and only on devices with a mouse / trackpad, so this
   file must work with or without it. It hands over three controls:
     cancel → drop the glide in progress and adopt the page's real position
     pause  → stand still (a dialog is open)
     resume → carry on */
type SmoothScrollControl = { cancel: () => void; pause: () => void; resume: () => void };
let smooth: SmoothScrollControl | null = null;
let locks = 0;

export function registerSmoothScroll(control: SmoothScrollControl | null): void {
  smooth = control;
  if (control && locks > 0) control.pause();
}

/* True while a dialog holds the page still (see lockScroll) */
export const isScrollLocked = (): boolean => locks > 0;

/* Stop a wheel glide right now — called before the router changes page */
export function cancelSmoothScroll(): void {
  smooth?.cancel();
}

/* Every programmatic scroll goes through here: jumps are INSTANT, and a
   wheel glide that is still running is dropped so it cannot pull the page
   back to where it was heading. */
function scrollToY(top: number): void {
  const target = Math.max(0, top);
  window.scrollTo({ top: target, behavior: "auto" });
  smooth?.cancel();
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
   shortcuts, terminal, lightbox). Calls are counted, so a dialog opened from
   another dialog cannot unlock the page under the one that is still open:
   every lockScroll(true) needs its own lockScroll(false). */
export function lockScroll(locked: boolean): void {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  const on = locks > 0;
  document.documentElement.style.overflow = on ? "hidden" : "";
  document.body.style.overflow = on ? "hidden" : "";
  if (on) smooth?.pause();
  else smooth?.resume();
}
