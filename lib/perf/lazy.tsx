"use client";

/*
 * ═══ lib/perf/lazy.tsx — components fetched ahead of time ═══
 *
 * preloadable(() => import("…")) works like React.lazy, with one addition:
 * the component's code is downloaded in idle time (lib/perf/schedule.ts →
 * whenIdle), so by the time it is needed it renders at once — no
 * suspended frame. Used for things that open on demand: the command
 * palette, the shortcuts help, the lightboxes.
 *
 * The page sections themselves are NOT loaded this way: they are plain
 * next/dynamic imports (components/home/dynamic.tsx), so every section is
 * in the page's HTML from the start, as on Sensei-Dev.
 */

import { createElement, lazy, type ComponentType } from "react";
import { whenIdle } from "@/lib/perf/schedule";

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

/**
 * Wrap an import() so the chunk can be fetched in idle time. Once fetched,
 * the component renders straight away (no suspended frame, no second swap);
 * before that it suspends like React.lazy.
 */
export function preloadable<P extends object>(load: Loader<P>) {
  let loaded: ComponentType<P> | null = null;
  /* ONE load shared by the idle preload and React.lazy */
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
  const Lazy = lazy(loadOnce);
  function Preloadable(props: P) {
    return loaded ? createElement(loaded, props) : createElement(Lazy, props);
  }
  /* Fetch in the background, in page order, when the browser is idle */
  whenIdle(loadOnce);
  return Preloadable;
}
