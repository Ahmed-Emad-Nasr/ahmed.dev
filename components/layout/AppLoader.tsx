"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "@/lib/fx";
import { INTRO_SEEN_KEY, introSeen, markIntroDone } from "@/lib/intro";

/*
 * ═══ components/layout/AppLoader.tsx — the INTRO BOOT SCREEN ═══
 *
 * Sensei-Dev's boot screen: cycling kanji, the monogram, a hairline progress
 * bar with a 000% → 100% counter, then the whole screen slides up. Used on
 * the home page only (app/page.tsx).
 *
 * TIMING (milliseconds):
 *   DURATION 1900 → how long the bar takes to fill (600 with reduced motion)
 *   + 200         → small pause at 100% before it leaves
 *   3500          → safety timeout: it always disappears by then
 *   (and a CSS-only safety net at 6 s for a browser without JavaScript)
 *   The slide-up exit animation is the `exit` prop on the motion.div below.
 * Click anywhere on it to skip.
 *
 * ONCE PER VISIT: it plays the first time the home page opens in a tab.
 * Coming back to the home page — from the blog, a case, a reload — does not
 * play it again (sessionStorage, see lib/intro.ts). A new tab or a new
 * browser session does.
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

/* Set to true the first time the loader starts. It lives as long as the
   page's JavaScript does, so in-site navigation (which keeps the JS) sees it,
   while a reload or a new tab starts fresh with false. The first render
   after a full load still starts visible, exactly as in the HTML — so React
   finds the same markup it expects and nothing flickers. */
let introPlayed = false;
const noSubscribe = () => () => {};

export default function AppLoader() {
  /* Played earlier in this visit (reload / coming back): the inline script
     already hid it with CSS; drop it right after hydration */
  const seen = useSyncExternalStore(noSubscribe, introSeen, () => false);
  /* Already played during this visit → start (and stay) hidden */
  const [loading, setLoading] = useState(() => !introPlayed);
  const [wordIndex, setWordIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!loading || seen) {
      /* Already played, skipped, or just finished: the page may come in */
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
    /* On a slow device this code starts late. The CSS safety net (globals.css)
       slides the screen away 6 s after the page appears, so the bar is
       shortened to be done before that — never two exits fighting. */
    const DURATION = Math.max(300, Math.min(prefersReducedMotion() ? 600 : 1900, 5200 - start));
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
        doneTimer = setTimeout(() => setLoading(false), 200);
      }
    };
    raf = requestAnimationFrame(tick);

    // Safety: never trap the user
    const fallback = setTimeout(() => setLoading(false), 3500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (doneTimer) clearTimeout(doneTimer);
      bar?.cancel();
    };
  }, [loading, seen]);

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

          <span className="absolute bottom-6 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-foreground/60">
            tap anywhere to skip
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
