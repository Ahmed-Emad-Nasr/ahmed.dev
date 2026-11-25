/*
 * lib/perf/schedule.ts — WHEN background work runs. No React here.
 *
 *   whenIdle(task)     One queue for background work (fetching the code of
 *                      the palette, lightboxes and other overlays ahead of
 *                      time). ONE task at a time, and only when the page has
 *                      loaded, the browser reports idle time, nobody has
 *                      scrolled, wheeled or swiped for 300 ms, and the tab
 *                      is visible — so background work never lands in a
 *                      frame the reader is scrolling through. While the
 *                      intro screen is up, back to back instead: nobody can
 *                      scroll yet, and it is all done before the page shows.
 *
 *   SECTION_ADDED      Fired on window when a section arrives after the page
 *                      loaded (the case library, whose data is fetched), so
 *                      the navbar and OffscreenAnimations look at it too.
 */

/* ── The idle queue ── */

type Task = () => unknown;

const queue: Task[] = [];
let lastScroll = 0;
let started = false;
let running = false;

const SCROLL_QUIET_MS = 300;
const START_AFTER_LOAD_MS = 1500;
/* …but while the intro screen (AppLoader) covers the page nobody can see
   or scroll yet, so the small background fetches start sooner. */
const START_UNDER_INTRO_MS = 300;

const isScrolling = (): boolean => performance.now() - lastScroll < SCROLL_QUIET_MS;

type Deadline = { didTimeout: boolean; timeRemaining: () => number };
const requestIdle = (cb: (d: Deadline) => void): void => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 3000 });
  else window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 8 }), 120);
};

/* The intro screen (AppLoader) is still covering the page */
const underIntro = (): boolean => Boolean(document.querySelector("[data-app-loader]"));

function next(): void {
  if (!queue.length) {
    running = false;
    return;
  }
  /* While the intro covers the page there is no reader to disturb: the
     tasks run back to back, so their code is all here before it lifts
     (waiting for idle time there pushed some past it on a busy phone) */
  const when = underIntro() ? (cb: () => void) => window.setTimeout(cb, 0) : requestIdle;
  when(async () => {
    /* Busy (scrolling, hidden tab): look again a little later */
    if (document.hidden || isScrolling()) {
      window.setTimeout(next, SCROLL_QUIET_MS);
      return;
    }
    const task = queue.shift();
    try {
      await task?.();
    } catch {
      /* a failed preload is retried by the section itself when it is needed */
    }
    next();
  });
}

function pump(): void {
  if (!started || running || !queue.length) return;
  running = true;
  next();
}

function start(): void {
  if (started) return;
  for (const t of ["scroll", "wheel", "touchmove"] as const) {
    window.addEventListener(t, () => (lastScroll = performance.now()), { passive: true, capture: true });
  }
  const go = () =>
    window.setTimeout(
      () => {
        started = true;
        pump();
      },
      underIntro() ? START_UNDER_INTRO_MS : START_AFTER_LOAD_MS,
    );
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
}

/** Queue a small piece of background work (client only). */
export function whenIdle(task: Task): void {
  if (typeof window === "undefined") return;
  start();
  queue.push(task);
  pump();
}

/** Fired on window when a section arrives after the page loaded */
export const SECTION_ADDED = "sensei:section-added";
