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
 *
 * WHEN IT PLAYS: on every full load of the home page — first visit, reload,
 * typing the address. It is skipped only on the browser's Back / Forward
 * button after it already played in this tab: then INTRO_SEEN_SCRIPT (inline
 * in the home page, before the loader's markup) marks <html data-intro-seen>
 * and globals.css hides the loader before the first paint — no flash.
 * Coming back through the site's own links (no full load) skips it too
 * (AppLoader's introPlayed).
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

export function markIntroDone(): void {
  done = true;
  const now = [...waiting];
  waiting.clear();
  now.forEach((cb) => cb());
}
