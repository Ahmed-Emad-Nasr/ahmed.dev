/*
 * lib/perf/jump.ts — the site's one way to go to a section.
 *
 * Used by every in-page #link (lib/perf/PageEffects.tsx), the command palette,
 * the g-shortcuts, the case library's deep links and arrivals with a hash.
 * The jump is instant — straight to the section, under the fixed header, no
 * smooth glide. Every section is in the page's HTML, so the target is
 * always there; only late images or fonts above it can still nudge it,
 * which settle() below corrects.
 */

import { scrollTargetOf, scrollToElement } from "@/lib/scroll";

/** Go to an in-page anchor, instantly, under the fixed header. */
export async function scrollToHash(hash: string): Promise<void> {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  scrollToElement(el);
  void settle(id);
}

/*
 * After the jump, late images or fonts above the target can still nudge it.
 * Look again a few times (not every frame) and put it back under the header.
 *
 * Never against the reader: the checks stop at any wheel, key, touch or
 * pointer, and — for the scrolls those events do not cover (assistive
 * technology moving focus, find-in-page, another script) — as soon as the
 * page is no longer where the jump left it. A nudge corrects a target that
 * moved under a still page; it never pulls a page somebody else moved.
 * A newer jump cancels the older one's checks.
 */
let jumpSeq = 0;
const CHECKS_MS = [120, 400, 1000, 2000, 3500, 5000];
/* Larger than any late-image nudge, smaller than any deliberate scroll */
const MOVED_BY_SOMEONE_ELSE = 48;

async function settle(id: string): Promise<void> {
  const seq = ++jumpSeq;
  let touched = false;
  const take = () => {
    touched = true;
  };
  const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  events.forEach((t) => window.addEventListener(t, take, { passive: true, once: true }));
  let left = window.scrollY;
  let waited = 0;
  for (const at of CHECKS_MS) {
    await new Promise((r) => window.setTimeout(r, at - waited));
    waited = at;
    if (touched || seq !== jumpSeq) break;
    if (Math.abs(window.scrollY - left) > MOVED_BY_SOMEONE_ELSE) break;
    const el = document.getElementById(id);
    if (!el) break;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (Math.abs(window.scrollY - Math.min(scrollTargetOf(el), max)) > 4) {
      scrollToElement(el);
      left = window.scrollY;
    }
  }
  events.forEach((t) => window.removeEventListener(t, take));
}
