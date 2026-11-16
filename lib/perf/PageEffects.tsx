"use client";

/*
 * PageEffects — mounted once on each long page (home, blog, gallery). Renders
 * nothing. Its one job (just include <PageEffects /> on a new long page):
 *
 *   Jumps. Takes over in-page #links, filtered-library links and arrivals
 *   with a hash, so every jump goes through lib/perf/jump.ts — instant,
 *   under the fixed header, then focus moves to the target as with a native
 *   anchor. A #section that is on another page (an old /#cases link) is
 *   opened on that page instead (lib/routes.ts → SECTION_PAGE).
 *
 * Nothing is pre-loaded here any more: every section is already in the
 * page's HTML (app/page.tsx), and a case page is fetched only when the
 * visitor reaches for its card (components/blog/CaseCard.tsx).
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { scrollToHash } from "@/lib/perf/jump";
import { LIBRARY_PARAMS, knownPageOf } from "@/lib/routes";
import { normalizePublicHref } from "@/lib/shared";

const isLibraryParam = (k: string) => (LIBRARY_PARAMS as readonly string[]).includes(k);

/* The page a missing #section lives on, when it is not this one — so old
   links like /#cases or /?cert=3#all-certificates (from when the whole site
   was one page) still land in the right place (lib/routes.ts) */
function elsewhere(id: string): string | null {
  if (!id || document.getElementById(id)) return null;
  const base = normalizePublicHref("/").replace(/\/$/, "");
  const here = window.location.pathname.slice(base.length).replace(/\/$/, "") || "/";
  const page = knownPageOf(id);
  return !page || page === here ? null : page;
}

export default function PageEffects() {
  const router = useRouter();
  useEffect(() => {
    /* Arriving with an anchor (/#faq). A filtered library link
       (/?q=wazuh#cases) or a #case-… card is scrolled to by the library
       itself, once its data has arrived. */
    const params = new URLSearchParams(window.location.search);
    const filtered = LIBRARY_PARAMS.some((k) => params.has(k));
    const hash = window.location.hash;
    const away = elsewhere(decodeURIComponent(hash.slice(1)));
    if (away) {
      window.location.replace(`${normalizePublicHref(away)}${window.location.search}${hash}`);
      return;
    }
    if (hash.length > 1 && !filtered && !hash.startsWith("#case-")) void scrollToHash(hash);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;

      /* A filtered library link (?kind=investigation#cases): no reload —
         put the filter in the URL and tell the library, as the back button does */
      if (url.search !== window.location.search) {
        if (![...url.searchParams.keys()].every(isLibraryParam)) return;
        e.preventDefault();
        history.pushState(null, "", `${url.search}${url.hash}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
        void scrollToHash(url.hash);
        return;
      }

      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      e.preventDefault();
      /* A #section that lives on another page: open that page at it */
      const other = elsewhere(id);
      if (other) {
        router.push(`${other}${url.hash}`);
        return;
      }
      if (url.hash !== window.location.hash) history.pushState(null, "", url.hash);
      scrollToHash(url.hash).then(() => {
        /* Keyboard and screen-reader users continue from the target, as
           with a native anchor (the skip link relies on this) */
        const el = document.getElementById(id);
        if (!el) return;
        if (!el.matches("a[href], button, input, select, textarea, [tabindex]")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      });
    };
    /* Bubble phase: links that handle their own click (CaseFilterLink,
       next/link) have called preventDefault by now and are left alone */
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
