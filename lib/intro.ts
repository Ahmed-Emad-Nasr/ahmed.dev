/*
 * ═══ lib/intro.ts — "has the intro screen lifted yet?" ═══
 *
 * The boot screen (components/layout/AppLoader.tsx) covers the page for about
 * two seconds. Entrances that would play underneath it — the hero's GSAP
 * timeline, the hero name, the first FadeIn blocks — wait for it here, so
 * they start as the screen slides away instead of finishing unseen.
 *
 *   whenIntroDone(cb)  → run cb once the intro lifts. Runs at once when there
 *                        is no intro on screen (another page, or the
 *                        home page after the intro already played).
 *   markIntroDone()    → called by AppLoader the moment it starts leaving.
 *
 * ONCE PER VISIT: AppLoader writes INTRO_SEEN_KEY to sessionStorage when it
 * plays. On a reload, or on coming back to the home page in the same tab,
 * INTRO_SEEN_SCRIPT (inline in the home page, before the loader's markup)
 * marks <html data-intro-seen> and globals.css hides the loader before the
 * first paint — no flash. A new tab or a new browser session plays it again.
 */

export const INTRO_SEEN_KEY = "intro-seen";

/* Runs inline in the HTML, before the loader markup is painted */
export const INTRO_SEEN_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}"))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

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
