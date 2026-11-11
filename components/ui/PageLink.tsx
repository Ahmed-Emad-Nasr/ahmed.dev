"use client";

/*
 * PageLink — next/link prefetched on intent (hover, focus, touch) instead of
 * on sight: the blog has 100+ case links, and prefetching each as it scrolls
 * into view meant dozens of downloads parsed mid-scroll.
 *
 * ═══ components/ui/PageLink.tsx ═══
 * Use it exactly like next/link for links to OTHER PAGES of the site:
 *   <PageLink href="/blog">Blog</PageLink>
 * (the basePath /ahmed.dev is added automatically). For #anchors on the
 * same page use a plain <a href="#id">; for external sites a plain <a>.
 *
 * INSTANT FEEDBACK: the moment a link is pressed, <NavPending> marks <html>
 * with data-nav-pending, and globals.css draws a thin bar across the top of
 * the screen until the new page is on screen — so a press always answers at
 * once, even when the page still has to download.
 *
 * eager → fetch the page as soon as the browser is idle, without waiting
 * for a hover. Only for the handful of links in the navbar: a click there
 * then opens the page at once instead of starting four downloads in a row
 * (on a phone there is no hover, so the wait used to begin at the tap).
 */

import Link, { useLinkStatus } from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ComponentProps } from "react";
import { whenIdle } from "@/lib/perf/schedule";

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
  const warm = () => {
    if (done.current) return;
    done.current = true;
    router.prefetch(href);
  };
  useEffect(() => {
    if (eager) whenIdle(warm);
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
