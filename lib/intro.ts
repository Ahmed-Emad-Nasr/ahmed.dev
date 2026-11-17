/*
 * ═══ lib/intro.ts — "has the intro screen lifted yet?" ═══
 *
 * The boot screen (components/layout/AppLoader.tsx) covers the page for about
 * two seconds. Entrances that would play underneath it — the hero's
 * entrance, the hero name, the first FadeIn blocks — wait for it here, so
 * they start as the screen slides away instead of finishing unseen.
 *
 *   whenIntroDone(cb)  → run cb once the intro lifts. Runs at once when there
 *                        is no intro on screen (another page, or the
 *                        home page after the intro already played).
 *   markIntroDone()    → called by AppLoader the moment it starts leaving.
 *   introStarting()    → called by AppLoader when it appears on a page opened
 *                        by a link, so that page's entrances wait for it too.
 *
 * WHEN IT PLAYS: every time a page is entered (see AppLoader.tsx). It is
 * skipped only on the browser's Back / Forward button after a full load in
 * this tab: then INTRO_SEEN_SCRIPT (inline on every page, before the
 * loader's markup) marks <html data-intro-seen> and globals.css hides the
 * loader before the first paint — no flash.
 */

export const INTRO_SEEN_KEY = "intro-seen";

/* Runs inline in the HTML, before the loader markup is painted */
export const INTRO_SEEN_SCRIPT = `try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="back_forward"&&sessionStorage.getItem("${INTRO_SEEN_KEY}"))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

/** true when the intro already played earlier in this visit */
export const introSeen = (): boolean => document.documentElement.hasAttribute("data-intro-seen");

let done = false;
const waiting = new Set<() => void>();

export function whenIntroDone(cb: () => void): () => void {
  if (done || introSeen() || !document.querySelector("[data-app-loader]")) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => {
    waiting.delete(cb);
  };
}

export function introStarting(): void {
  done = false;
  /* A Back-button visit earlier in this tab marked the intro as seen; a page
     opened by a link plays it again, so clear the mark (it also hides the
     loader in globals.css) */
  document.documentElement.removeAttribute("data-intro-seen");
}

export function markIntroDone(): void {
  done = true;
  const now = [...waiting];
  waiting.clear();
  now.forEach((cb) => cb());
}
