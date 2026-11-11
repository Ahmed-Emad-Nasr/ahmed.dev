"use client";

/*
 * PageLink — next/link prefetched on intent (hover, focus, touch) instead of
 * on sight: the blog has 100+ case links, and prefetching each as it scrolls
 * into view meant dozens of downloads parsed mid-scroll.
 *
 * ═══ components/ui/PageLink.tsx ═══
 * Use it exactly like next/link for links to OTHER PAGES of the site:
 *   <PageLink href="/blog/soc336-report">The case</PageLink>
 * (the basePath /ahmed.dev is added automatically). For #anchors on the
 * same page use a plain <a href="#id">; for external sites a plain <a>.
 *
 * INSTANT FEEDBACK: the moment a link is pressed, <NavPending> marks <html>
 * with data-nav-pending, and globals.css draws a thin bar across the top of
 * the screen until the new page is on screen — so a press always answers at
 * once, even when the page still has to download.
 *
 * WARMING = the page's data (router.prefetch) AND the code of its first
 * screen (lib/perf/warm-route.ts), so the page opens without a wait or grey
 * skeletons. It starts on hover / focus / touch / press.
 *
 * eager → warm without waiting for a hover. Only for the handful of links in
 * the navbar: the data right after the page loads (soonAfterLoad — not
 * behind the background queue, where it used to arrive ~8 s late), the code
 * in idle time (whenIdle). A click there then opens the page at once (on a
 * phone there is no hover, so the wait used to begin at the tap).
 */

import Link, { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ComponentProps } from "react";
import { soonAfterLoad, whenIdle } from "@/lib/perf/schedule";
import { warmRouteCode } from "@/lib/perf/warm-route";

/* Lives inside the <Link>: pending is true from the press until the new
   page has rendered. Draws nothing itself. */
function NavPending() {
  const { pending } = useLinkStatus();
  useEffect(() => {
    if (!pending) return;
    const root = document.documentElement;
    root.setAttribute("data-nav-pending", "");
    return () => root.removeAttribute("data-nav-pending");
  }, [pending]);
  return null;
}

type Props = Omit<ComponentProps<typeof Link>, "prefetch" | "href"> & { href: string; eager?: boolean };

export default function PageLink({ href, eager = false, onMouseEnter, onFocus, onTouchStart, onPointerDown, children, ...rest }: Props) {
  const router = useRouter();
  const done = useRef(false);
  const prefetchData = () => {
    if (done.current) return;
    done.current = true;
    router.prefetch(href);
  };
  const warm = () => {
    prefetchData();
    warmRouteCode(href);
  };
  useEffect(() => {
    if (!eager) return;
    soonAfterLoad(prefetchData);
    whenIdle(() => warmRouteCode(href));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per link
  }, [eager]);
  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        warm();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      /* pointerdown comes ~100ms before click: a head start on the download */
      onPointerDown={(e) => {
        warm();
        onPointerDown?.(e);
      }}
      {...rest}
    >
      {children}
      <NavPending />
    </Link>
  );
}
