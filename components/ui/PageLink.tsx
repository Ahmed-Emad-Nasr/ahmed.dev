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
 * eager → fetch the page as soon as the browser is idle, without waiting
 * for a hover. Only for the handful of links in the navbar: a click there
 * then opens the page at once instead of starting four downloads in a row
 * (on a phone there is no hover, so the wait used to begin at the tap).
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ComponentProps } from "react";
import { whenIdle } from "@/lib/perf/schedule";

type Props = Omit<ComponentProps<typeof Link>, "prefetch" | "href"> & { href: string; eager?: boolean };

export default function PageLink({ href, eager = false, onMouseEnter, onFocus, onTouchStart, ...rest }: Props) {
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
      {...rest}
    />
  );
}
