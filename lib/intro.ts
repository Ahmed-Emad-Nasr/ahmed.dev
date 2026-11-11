/*
 * ═══ lib/intro.ts — "has the intro screen lifted yet?" ═══
 *
 * The boot screen (components/layout/AppLoader.tsx) covers the page for about
 * two seconds. Entrances that would play underneath it — the hero's GSAP
 * timeline, the hero name, the first FadeIn blocks — wait for it here, so
 * they start as the screen slides away instead of finishing unseen.
 *
 *   whenIntroDone(cb)  → run cb once the intro lifts. Runs at once when there
 *                        is no intro on screen (a page without it, or any
 *                        page after the first one of the visit).
 *   markIntroDone()    → called by AppLoader the moment it starts leaving.
 */

let done = false;
const waiting = new Set<() => void>();

export function whenIntroDone(cb: () => void): () => void {
  if (done || !document.querySelector("[data-app-loader]")) {
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
