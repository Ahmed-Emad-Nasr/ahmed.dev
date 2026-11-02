/*
 * lib/scroll.ts — every programmatic scroll goes through here, so it works
 * the same across every caller. Jumps are instant by design.
 */

/** Height of the fixed header plus a little air (read from the DOM: it changes with breakpoints) */
function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>("[data-site-header='true']");
  return (header?.offsetHeight ?? 0) + 15;
}

function scrollToY(top: number): void {
  const target = Math.max(0, top);
  window.scrollTo({ top: target, behavior: "auto" });
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

/** Freeze page scrolling under a full-screen layer (the mobile menu). */
export function lockScroll(locked: boolean): void {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
}
