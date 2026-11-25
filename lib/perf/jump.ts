/*
 * lib/perf/jump.ts — the site's one way to go to a section.
 *
 * Used by every in-page #link (lib/perf/PageEffects.tsx), the command palette,
 * the g-shortcuts, the case library's deep links and arrivals with a hash.
 * The jump is instant — straight to the section, under the fixed header, no
 * smooth glide. Nearly every section is in the page's HTML; the one drawn
 * in the browser (the blog's case library, with #videos) is waited for.
 * Late images or fonts above the target can still nudge it, which
 * settle() below corrects.
 */

import { scrollTargetOf, scrollToElement } from "@/lib/scroll";
import { sectionHref } from "@/lib/routes";
import { SECTION_ADDED } from "@/lib/perf/schedule";

/** Go to an in-page anchor, instantly, under the fixed header. */
export async function scrollToHash(hash: string): Promise<void> {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) {
    /* Not in the page yet: a part the browser draws once its data arrives
       (the case library and the #videos under it — /blog#videos). Go there
       when it does (SECTION_ADDED), unless the reader has scrolled since. */
    const y = window.scrollY;
    const arrived = await new Promise<boolean>((done) => {
      const timer = window.setTimeout(() => done(false), 8000);
      window.addEventListener(
        SECTION_ADDED,
        () => {
          window.clearTimeout(timer);
          done(true);
        },
        { once: true },
      );
    });
    if (arrived && document.getElementById(id) && Math.abs(window.scrollY - y) <= 4) return scrollToHash(hash);
    return;
  }
  scrollToElement(el);
  /* Sections far down the home page are drawn only once they are near the
     screen (content-visibility in globals.css). After a jump the sections it
     lands among get drawn and their real heights replace the estimate, which
     moves the target. Re-aim each frame until it holds still for two frames
     (at most ~12 frames, a fifth of a second) — before anyone sees the gap. */
  const max = () => document.documentElement.scrollHeight - window.innerHeight;
  let still = 0;
  for (let frame = 0; frame < 12 && still < 2; frame++) {
    await new Promise(requestAnimationFrame);
    if (Math.abs(window.scrollY - Math.min(scrollTargetOf(el), max())) <= 2) still++;
    else {
      still = 0;
      scrollToElement(el);
    }
  }
  void settle(id);
}

/**
 * Go to a section on whichever page holds it (lib/routes.ts → SECTION_PAGE):
 * on this page it jumps; otherwise it opens that page at the section.
 * `target` is "#work", "?q=wazuh#cases" or "?cert=3#all-certificates".
 * `pathname` = usePathname(); `push` = router.push.
 */
export function goToSection(target: string, pathname: string, push: (href: string) => void): void {
  const href = sectionHref(target);
  const cut = href.search(/[?#]/);
  const page = cut >= 0 ? href.slice(0, cut) : href;
  const rest = href.slice(page.length);
  if (page !== (pathname || "/")) {
    push(href);
    return;
  }
  /* Same page with a filter (?q=…, ?cert=…): put it in the URL and tell the
     section, as the back button does — no reload */
  if (rest.startsWith("?")) {
    history.pushState(null, "", rest);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  requestAnimationFrame(() => void scrollToHash(rest.slice(rest.indexOf("#"))));
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
 *
 * One exception to "the page moved, so someone else moved it": when the
 * page's HEIGHT changed too, the move is the browser's own scroll anchoring
 * reacting to a section above being drawn (content-visibility) — not a
 * reader. Without this, clicking Contact on the home page stopped 1,500px
 * short: the Experience section above it was drawn (1,156 → 2,707 px), the
 * browser nudged the scroll by 105px, and the checks gave up.
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
  let height = document.documentElement.scrollHeight;
  let waited = 0;
  for (const at of CHECKS_MS) {
    await new Promise((r) => window.setTimeout(r, at - waited));
    waited = at;
    if (touched || seq !== jumpSeq) break;
    const nowHeight = document.documentElement.scrollHeight;
    const relaidOut = nowHeight !== height;
    height = nowHeight;
    if (!relaidOut && Math.abs(window.scrollY - left) > MOVED_BY_SOMEONE_ELSE) break;
    const el = document.getElementById(id);
    if (!el) break;
    const max = nowHeight - window.innerHeight;
    if (Math.abs(window.scrollY - Math.min(scrollTargetOf(el), max)) > 4) {
      scrollToElement(el);
      left = window.scrollY;
    }
  }
  events.forEach((t) => window.removeEventListener(t, take));
}
