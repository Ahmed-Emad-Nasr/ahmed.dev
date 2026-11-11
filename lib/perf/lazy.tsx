"use client";

/*
 * ═══ WHAT YOU NEED TO KNOW (plain version) ═══
 * <LazySection id="x" size="lazy-h-x"> <MySection /> </LazySection>
 *   → MySection is NOT in the page's HTML. An empty box of the right height
 *     (.lazy-h-x in app/globals.css) stands in for it. It mounts in idle
 *     time or when the reader scrolls within ~3 screens of it, and its code
 *     downloads then (or earlier, in idle time, if it was wrapped with
 *     preloadable()). #x links still work (they
 *     mount it first, then jump). Every section below the hero on home, and
 *     including the blog and the gallery, is wrapped like this.
 * You normally never edit this file — the technical detail follows.
 *
 * lib/perf/lazy.tsx — sections whose code AND data load only when needed,
 * and that never cost a dropped frame when they arrive.
 *
 * Every section after the hero (the blog and the gallery included) is wrapped in a LazySection and is not in the server HTML.
 *
 *   1. Placeholder. An empty box that keeps the section's id (so #cases has
 *      a target) and its expected height per screen size (globals.css,
 *      .lazy-h-*), so the scrollbar and the anchors below it are right.
 *
 *   2. Preload. Once the page is idle and the reader is not scrolling, the
 *      section's chunk is downloaded and evaluated in the background
 *      (lib/perf/schedule.ts), one section at a time.
 *
 *   3. Mount. In idle time, top to bottom, while nobody scrolls — or
 *      sooner, when the reader gets within three screens or a jump needs
 *      it (lib/perf/schedule.ts). The section renders inside a transition
 *      (React can pause the work between frames) and inside a
 *      content-visibility: auto box sized like the placeholder, so the swap
 *      itself moves nothing on the page.
 *
 *   4. Measure. Still off screen, the box renders once (schedule.ts
 *      measureDeferred): its real height replaces the estimate where nobody
 *      can see it change, and the browser goes back to skipping it until
 *      the reader comes near.
 *
 * A chunk that fails to download (offline) costs that one section a
 * "could not load" note, never the whole page.
 */

import {
  Component,
  Suspense,
  createElement,
  lazy,
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import { LAZY_MOUNTED, PENDING, getRevealed, getServerRevealed, measureDeferred, nextFrame, subscribeReveal, whenIdle } from "@/lib/perf/schedule";

/* ── A component loaded with import(), that can be fetched ahead of time ── */

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

/**
 * Wrap an import() so the chunk can be fetched in idle time. Once fetched,
 * the component renders straight away (no suspended frame, no second swap);
 * before that it suspends like React.lazy.
 */
export function preloadable<P extends object>(load: Loader<P>) {
  let loaded: ComponentType<P> | null = null;
  /* ONE load shared by the idle preload and React.lazy: a loader that also
     fetches data (the case library's /library.json) must not run twice when
     a jump mounts the section while the preload is still on its way. */
  let pending: ReturnType<Loader<P>> | null = null;
  const loadOnce = () =>
    (pending ??= load().then(
      (m) => {
        loaded = m.default;
        return m;
      },
      (err) => {
        pending = null; // let a later attempt retry
        throw err;
      },
    ));
  const preload = () => loadOnce();
  const Lazy = lazy(loadOnce);
  function Preloadable(props: P) {
    return loaded ? createElement(loaded, props) : createElement(Lazy, props);
  }
  /* Fetch in the background, in page order, when the browser is idle */
  whenIdle(preload);
  return Preloadable;
}

/* ── The placeholder ── */

function LazyPlaceholder({ id, size }: { id?: string; size: string }) {
  /* Unmounting = the section (or its loading state) has replaced it */
  useEffect(() => () => void window.dispatchEvent(new Event(LAZY_MOUNTED)), []);
  return <div id={id} data-lazy-pending="" aria-hidden="true" className={`lazy-pending bg-background ${size}`} />;
}

/* ── One failed chunk costs one section ── */

class LazyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[lazy] a section failed to load:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="status" className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center bg-background">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/60">This section could not load — check the connection.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="border border-foreground/15 px-4 py-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 transition-colors hover:border-primary hover:text-primary-ink"
        >
          Try again
        </button>
      </div>
    );
  }
}

/* ── The section ── */

/* Mount this far ahead of the screen, in both directions */
const MOUNT_MARGIN = "300% 0px 300% 0px";

/* Props: id = the #anchor kept on the placeholder; size = a .lazy-h-* class
   from app/globals.css (the expected height); children = the section. */
export default function LazySection({
  id,
  size,
  children,
}: {
  /** The section's own id — kept on the placeholder so links to it work */
  id?: string;
  /** A .lazy-h-* class from globals.css: the expected height per screen size */
  size: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const all = useSyncExternalStore(subscribeReveal, getRevealed, getServerRevealed);
  const mounted = near || all;
  /* Resolves the idle-queue task once this section is mounted and measured */
  const doneRef = useRef<(() => void) | null>(null);

  /* Mount in idle time, top to bottom, while nobody is scrolling — so by
     the time the reader arrives there is nothing left to do */
  useEffect(() => {
    whenIdle(
      () =>
        new Promise<void>((resolve) => {
          if (!ref.current) return resolve(); // already mounted
          doneRef.current = resolve;
          startTransition(() => setNear(true));
          window.setTimeout(resolve, 5000); // never hold the queue
        }),
    );
  }, []);

  /* …or sooner, when the reader gets within three screens first */
  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          /* Interruptible render: React yields between frames */
          startTransition(() => setNear(true));
        }
      },
      { rootMargin: MOUNT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  /* Once mounted (and its code has arrived), render it once while it is
     still off screen, so its real height replaces the estimate there — not
     later, half on screen, where the page would visibly jump */
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    (async () => {
      const box = boxRef.current;
      const start = performance.now();
      while (box?.querySelector(PENDING) && performance.now() - start < 5000) await nextFrame();
      if (!cancelled && box?.isConnected) await measureDeferred([box]);
      doneRef.current?.();
      doneRef.current = null;
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div ref={ref}>
        <LazyPlaceholder id={id} size={size} />
      </div>
    );
  }
  return (
    <div ref={boxRef} className={`cv-defer lazy-box ${size}`}>
      <LazyBoundary>
        <Suspense fallback={<LazyPlaceholder size={size} />}>{children}</Suspense>
      </LazyBoundary>
    </div>
  );
}
