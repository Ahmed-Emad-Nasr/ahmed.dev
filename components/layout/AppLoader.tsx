"use client";

import { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "@/lib/fx";

/*
 * ═══ components/layout/AppLoader.tsx — the INTRO BOOT SCREEN ═══
 *
 * The black screen with the monogram, a progress bar and changing kanji
 * that covers the page for a moment, then slides up. Used on the home page
 * (app/page.tsx) and on /blog and /gallery (PageShell showLoader).
 *
 * TIMING (milliseconds):
 *   DURATION 650 → how long the progress bar takes to fill (300 with reduced motion)
 *   + 100        → small pause at 100% before it leaves
 *   1500         → safety timeout: it always disappears by then
 *   The slide-up exit animation is the `exit` prop on the motion.div below.
 * Click anywhere on it to skip.
 *
 * ONCE PER VISIT: it plays on the first page you open (whichever page that
 * is). Moving around the site afterwards — Home, Blog, Gallery, a case —
 * does not play it again. Reloading the page or opening the site in a new
 * tab is a new visit, so it plays again then.
 */

/* The kanji shown one after another while it loads (left → right = 0% → 100%) */
const BOOT_WORDS = ["起動中", "武士道", "鍛錬", "技術調整", "出陣"];

/* Set to true the first time the loader starts. It lives as long as the
   page's JavaScript does, so in-site navigation (which keeps the JS) sees it,
   while a reload or a new tab starts fresh with false. The first render
   after a full load still starts visible, exactly as in the HTML — so React
   finds the same markup it expects and nothing flickers. */
let introPlayed = false;

/**
 * Minimal boot screen: monogram and cycling kanji.
 * Click anywhere to skip. Respects reduced-motion (short + static).
 * The loader is intentionally brief so it does not delay the first useful
 * content on repeat visits (it also covers the hero's GSAP set-up).
 */
export default function AppLoader() {
  /* Already played during this visit → start (and stay) hidden */
  const [loading, setLoading] = useState(() => !introPlayed);
  const [progress, setProgress] = useState(0);
  const [reduced] = useState(
    () => typeof window !== "undefined" && prefersReducedMotion(),
  );

  useEffect(() => {
    if (!loading) return; // already played, or just finished
    introPlayed = true;
    let raf = 0;
    let doneTimer: NodeJS.Timeout | undefined;
    const start = performance.now();
    const DURATION = reduced ? 300 : 650;

    /* Every animation frame: progress = eased 0→100 over DURATION */
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / DURATION));
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        doneTimer = setTimeout(() => setLoading(false), 100);
      }
    };
    raf = requestAnimationFrame(tick);

    // Safety: never trap the user
    const fallback = setTimeout(() => setLoading(false), 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [loading, reduced]);

  /* Which kanji to show for the current progress */
  const word =
    BOOT_WORDS[
      Math.max(
        0,
        Math.min(
          BOOT_WORDS.length - 1,
          Math.floor((progress / 100) * BOOT_WORDS.length),
        ),
      )
    ] ?? "起動中";

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.58, ease: [0.76, 0, 0.24, 1] }}
          data-app-loader
          className="fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center bg-background"
          onClick={() => setLoading(false)}
          title="Skip intro"
          role="status"
          aria-label="Loading portfolio"
        >
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
            ahmed.dev
          </p>

          <span className="absolute bottom-6 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-foreground/60">
            tap anywhere to skip
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
