"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "@/lib/fx";
import { INTRO_SEEN_KEY, introSeen, introStarting, markIntroDone } from "@/lib/intro";
import Ayah from "@/components/ui/Ayah";

/*
 * ═══ components/layout/AppLoader.tsx — the INTRO BOOT SCREEN ═══
 *
 * Sensei-Dev's boot screen: cycling kanji, the monogram, a hairline progress
 * bar with a 000% → 100% counter, then the whole screen slides up. On every page: the home page
 * (app/page.tsx) and every other page through components/layout/PageShell.tsx.
 *
 * TIMING (milliseconds):
 *   DURATION 1900 → how long the bar takes to fill (600 with reduced motion);
 *                   shorter on a slow device, so it is done by 2.6 s after
 *                   the page was requested (LATEST_END)
 *   + 200         → small pause at 100% before it leaves
 *   3500          → safety timeout: it always disappears by then
 *   (and a CSS-only safety net at 6 s for a browser without JavaScript)
 *   The slide-up exit animation is the `exit` prop on the motion.div below.
 * Click anywhere on it to skip.
 *
 * WHEN: every time a page is entered — a full load, a reload, or a click on
 * one of the site's own links.
 *   • The first page of a visit gets the full intro (1.9 s).
 *   • Every page after it gets a short one (QUICK, 0.9 s).
 *   • Either way it then waits (up to READY_WAIT) until the page underneath
 *     is whole: the fonts, the pictures of the first two screens, and every
 *     section that was still a grey skeleton (the blog's case library, a
 *     section whose code was still downloading).
 *   • While it is up, every picture further down the page starts loading
 *     too (warmPictures below), so scrolling never waits for one. Not on a
 *     "save data" or 2G connection: there only the first two screens do.
 * Skipped only on the browser's Back button after a full load, where the
 * page comes back from the cache already drawn (see lib/intro.ts).
 *
 * SMOOTHNESS: the page is busiest exactly while this screen is up (React is
 * waking the page underneath). So the bar is a compositor animation
 * (element.animate on `transform`) that keeps moving even when the main
 * thread is busy, the counter is written straight into its <span>, and React
 * re-renders only when the kanji changes — 5 times, not every frame.
 *
 * Entrances under the screen (hero, first FadeIn blocks) wait for
 * markIntroDone() — see lib/intro.ts.
 */

/* The kanji shown one after another while it loads (left → right = 0% → 100%) */
const BOOT_WORDS = ["起動中", "武士道", "鍛錬", "技術調整", "出陣"];

/* easeOutCubic — the same curve as the counter's 1 - (1 - t)³ */
const BAR_EASING = "cubic-bezier(0.215, 0.61, 0.355, 1)";

/* Set to true once the first intro of this visit started. It lives as long
   as the page's JavaScript does: pages opened through the site's own links
   (which keep the JS) see it and get the short loader; a reload or a new
   tab starts fresh with the full one. */
let introPlayed = false;
const noSubscribe = () => () => {};

/* The short loader on every page after the first, and the most it waits
   on top of the bar for the fonts and the first screen's images */
const QUICK = 900;
const READY_WAIT = 900;
/* The most the warm-up waits for the first screens before it starts */
const WARM_AFTER_MAX = 2500;

/* How far down "the first screens" go: the loader waits for the pictures
   in them, in screen heights */
const FIRST_SCREENS = 2;

/* A "save data" or 2G connection: only what the first screens need */
function thriftyConnection(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData) || /2g/.test(c?.effectiveType ?? "");
}

const nearTop = (el: Element): boolean => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.top < window.innerHeight * FIRST_SCREENS && r.bottom > 0;
};

/* Under the loader: every picture marked loading="lazy" starts downloading
   now instead of when it is scrolled near, so the page is already complete
   when the screen lifts. Two at a time, top to bottom: the first screens
   come first, and the network never fills up with pictures (a page that
   keeps loading looks "busy" to speed tests and scores lower). Pictures
   that arrive later (a section drawn in the browser, like the case
   library) join the queue. Iframes (videos, PDFs) stay lazy: they are
   whole pages, not pictures. Returns the function that stops it. */
const WARM_AT_ONCE = 2;
/* A picture that neither loads nor fails (removed from the page) frees its
   place after this long */
const WARM_GIVE_UP = 8000;

function warmPictures(): () => void {
  const thrifty = thriftyConnection();
  const queue: HTMLImageElement[] = [];
  const queued = new WeakSet<HTMLImageElement>();
  let active = 0;
  let stopped = false;

  const pump = () => {
    while (!stopped && active < WARM_AT_ONCE && queue.length) {
      const img = queue.shift()!;
      if (img.loading !== "lazy" || !img.isConnected) continue;
      if (img.complete && img.naturalWidth > 0) continue;
      active++;
      let freed = false;
      const free = () => {
        if (freed) return;
        freed = true;
        window.clearTimeout(timer);
        active--;
        pump();
      };
      const timer = window.setTimeout(free, WARM_GIVE_UP);
      img.addEventListener("load", free, { once: true });
      img.addEventListener("error", free, { once: true });
      img.loading = "eager";
    }
  };
  const add = (img: HTMLImageElement) => {
    if (img.loading !== "lazy" || queued.has(img)) return;
    if (thrifty && !nearTop(img)) return;
    queued.add(img);
    queue.push(img);
  };
  const sweep = (root: ParentNode) => root.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(add);

  sweep(document);
  pump();
  const watcher = new MutationObserver((changes) => {
    for (const change of changes)
      for (const node of change.addedNodes) {
        if (node instanceof HTMLImageElement) add(node);
        else if (node instanceof Element) sweep(node);
      }
    pump();
  });
  watcher.observe(document.body, { childList: true, subtree: true });
  return () => {
    stopped = true;
    watcher.disconnect();
  };
}

/* Resolves once the page underneath is whole — the fonts are ready, no
   section is a grey skeleton any more (SectionSkeleton, data-skeleton), and
   every picture of the first screens has loaded (or failed) — or after
   `max` ms, whichever comes first */
function pageReady(max: number): Promise<void> {
  const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  const skeletons = new Promise<void>((done) => {
    const check = () => {
      if (document.querySelector("[data-skeleton]")) return false;
      done();
      return true;
    };
    if (check()) return;
    const watcher = new MutationObserver(() => {
      if (check()) watcher.disconnect();
    });
    watcher.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => watcher.disconnect(), max);
  });
  /* Pictures: looked at once the skeletons are gone, so the ones the new
     sections brought are counted too */
  const pictures = skeletons.then(() =>
    Promise.all(
      [...document.images]
        .filter((img) => !img.complete && nearTop(img))
        .map(
          (img) =>
            new Promise<void>((done) => {
              img.addEventListener("load", () => done(), { once: true });
              img.addEventListener("error", () => done(), { once: true });
            }),
        ),
    ),
  );
  return Promise.race([
    Promise.all([fonts, pictures]).then(() => undefined),
    new Promise<void>((done) => setTimeout(done, max)),
  ]);
}

export default function AppLoader() {
  /* Played earlier in this tab and we came Back to it: the inline script
     already hid it with CSS; drop it right after hydration */
  /* Every page plays it; `quick` = not the first page of this visit */
  const [loading, setLoading] = useState(true);
  const [quick] = useState(() => introPlayed);
  /* "Seen" only counts for the page the Back button brought back from the
     cache — never for a page opened afterwards by a link */
  const seen = useSyncExternalStore(noSubscribe, introSeen, () => false) && !quick;

  /* A page opened by a link: the entrances underneath must wait for this
     screen again (lib/intro.ts). Before paint, so none starts unseen. */
  useLayoutEffect(() => {
    if (!seen) introStarting();
  }, [seen]);
  /* Everything further down the page starts loading while the screen is
     up: once the page itself has loaded and its first screens are whole,
     so what is seen first always goes first (warmPictures, two at a time).
     On its own effect: if it is not done when the screen lifts, it
     carries on. */
  useEffect(() => {
    if (seen) return;
    let live = true;
    let stop = () => {};
    new Promise<void>((done) => {
      if (document.readyState === "complete") done();
      else window.addEventListener("load", () => done(), { once: true });
    })
      .then(() => pageReady(WARM_AFTER_MAX))
      .then(() => {
        if (live) stop = warmPictures();
      });
    return () => {
      live = false;
      stop();
    };
  }, [seen]);

  const [wordIndex, setWordIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!loading || seen) {
      /* Already played, skipped, or just finished: the page may come in */
      introPlayed = true;
      markIntroDone();
      return;
    }
    introPlayed = true;
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* Private mode / storage blocked: it simply plays again next time */
    }
    const start = performance.now();
    /* On a slow device this code starts late (start = ms since the page was
       requested), and the visitor has already been looking at the screen
       for that long. So the bar ends by LATEST_END at the latest: a fast
       device still gets the full 1.9 s, a slow phone a shorter bar instead
       of a longer wait (it also keeps the Speed Index down). Never past the
       CSS safety net (globals.css, 6 s) either — no two exits fighting. */
    const LATEST_END = 2600;
    const DURATION = quick
      ? prefersReducedMotion()
        ? 400
        : QUICK
      : Math.max(300, Math.min(prefersReducedMotion() ? 600 : 1900, LATEST_END - start));
    let cancelled = false;
    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;
    let shown = -1;

    const bar = barRef.current?.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: DURATION,
      easing: BAR_EASING,
      fill: "forwards",
    });

    /* Every animation frame: progress = eased 0→100 over DURATION */
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / DURATION));
      const progress = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      if (progress !== shown) {
        shown = progress;
        if (countRef.current) countRef.current.textContent = `${String(progress).padStart(3, "0")}%`;
        setWordIndex(Math.min(BOOT_WORDS.length - 1, Math.floor((progress / 100) * BOOT_WORDS.length)));
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        /* Bar full: leave once the first screen is ready (fonts + images) */
        void pageReady(READY_WAIT).then(() => {
          if (!cancelled) doneTimer = setTimeout(() => setLoading(false), 150);
        });
      }
    };
    raf = requestAnimationFrame(tick);

    // Safety: never trap the user
    const fallback = setTimeout(() => setLoading(false), DURATION + READY_WAIT + 1200);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (doneTimer) clearTimeout(doneTimer);
      bar?.cancel();
    };
  }, [loading, seen, quick]);

  const word = BOOT_WORDS[wordIndex] ?? "起動中";

  return (
    <AnimatePresence>
      {loading && !seen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          data-app-loader
          className="fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center bg-background"
          onClick={() => setLoading(false)}
          title="Skip intro"
          role="status"
          aria-label="Loading portfolio"
        >
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="brush-jp text-5xl text-foreground/80"
            lang="ja"
          >
            {word}
          </motion.span>

          {/* Not an <h1>: the loader is in the server HTML, and "Ahmed." was
              the page's first heading for crawlers and screen readers. */}
          <p className="mt-4 font-display text-xl font-black uppercase tracking-tighter text-foreground">
            Ahmed<span className="text-primary-ink">.</span>
          </p>
          <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.45em] text-foreground/60">
            Portfolio
          </p>

          <div className="mt-10 w-56 md:w-72">
            <div className="h-px w-full overflow-hidden bg-foreground/10" aria-hidden="true">
              {/* transform (not the `scale` utility): it is the property the bar animates */}
              <div ref={barRef} className="h-px w-full origin-left bg-primary" style={{ transform: "scaleX(0)" }} />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[0.625rem] tracking-[0.3em] text-foreground/60">
              <span>LOADING</span>
              <span ref={countRef} aria-hidden="true" className="tabular-nums">
                000%
              </span>
            </div>
          </div>

          {/* Taha 114 — static, in the server HTML: no shift, nothing to load */}
          <Ayah source="طه: 114" className="mt-9 px-6 text-center text-xl leading-loose text-foreground/75 md:text-2xl">
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </Ayah>

          <span className="absolute bottom-6 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-foreground/60">
            tap anywhere to skip
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
