"use client";

/*
 * CaseFilterLink — a link that opens the case library already filtered
 * (/?q=wazuh#cases). On the home page itself it updates the URL and fires
 * popstate (the library listens) instead of navigating.
 *
 * ═══ components/blog/CaseFilterLink.tsx ═══
 * Usage: <CaseFilterLink params={{ q: "Wazuh" }}>Wazuh cases</CaseFilterLink>
 * Param names are the URL filters listed in CaseLibrarySection.tsx
 * (q, kind, cat, tools, sort, view).
 */

import type { ReactNode } from "react";
import { normalizePublicHref } from "@/lib/shared";
import { scrollToHash } from "@/lib/perf/jump";

type Props = {
  /** URL search params for the library: { q: "Wazuh" } or { kind: "investigation" } */
  params: Record<string, string>;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
};

export default function CaseFilterLink({ params, className, children, ...rest }: Props) {
  const search = new URLSearchParams(params).toString();
  const href = `${normalizePublicHref("/")}?${search}#cases`;
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (!document.getElementById("cases")) return; // on a case page: follow the link
        e.preventDefault();
        window.history.pushState(null, "", `${window.location.pathname}?${search}#cases`);
        /* The library applies the filter now — or, if its data is still on
           its way, reads it from the URL when it arrives */
        window.dispatchEvent(new PopStateEvent("popstate"));
        void scrollToHash("#cases");
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
