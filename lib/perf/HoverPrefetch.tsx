"use client";

/*
 * HoverPrefetch — loads a page the moment the visitor reaches for its link
 * (mouse resting on it, finger down, keyboard focus), so the click opens it
 * at once. Renders nothing; mounted site-wide by DeferredGlobalEffects.
 *
 * Only on intent, never for every link in view: the many links set to
 * prefetch={false} stay that way until someone points at one. A link counts
 * after the mouse rests on it for HOVER_DELAY ms (a pointer sweeping across
 * the page loads nothing). Each page is fetched once. Skipped on Save-Data
 * and 2G connections, for other sites, files (.pdf, .webp …), new-tab and
 * download links, and #jumps within the current page.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { normalizePublicHref } from "@/lib/shared";

const HOVER_DELAY = 65;

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export default function HoverPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const net = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (net?.saveData || /2g/.test(net?.effectiveType ?? "")) return;

    const base = normalizePublicHref("/").replace(/\/$/, "");
    const done = new Set<string>();
    let timer: number | undefined;

    /* The route inside the site for this link, or null when there is
       nothing to load */
    const routeOf = (a: HTMLAnchorElement): string | null => {
      if (a.target === "_blank" || a.hasAttribute("download")) return null;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(base)) return null;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return null;
      if (url.pathname === window.location.pathname) return null;
      return url.pathname.slice(base.length) || "/";
    };

    const warm = (target: EventTarget | null) => {
      const a = (target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const route = routeOf(a);
      if (!route || done.has(route)) return;
      done.add(route);
      router.prefetch(route);
    };

    const onOver = (e: MouseEvent) => {
      window.clearTimeout(timer);
      const target = e.target;
      timer = window.setTimeout(() => warm(target), HOVER_DELAY);
    };
    const onOut = () => window.clearTimeout(timer);
    const onNow = (e: Event) => warm(e.target);

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("touchstart", onNow, { passive: true });
    document.addEventListener("focusin", onNow);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("touchstart", onNow);
      document.removeEventListener("focusin", onNow);
    };
  }, [router]);

  return null;
}
