"use client";

/*
 * The blog's case library, loaded in the browser only: its code and its data
 * (/library.json, built by app/library.json/route.ts) are fetched together,
 * once, right after the page loads. Used by app/blog/page.tsx.
 */

import dynamic from "next/dynamic";
import { useEffect } from "react";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import type { LibraryData } from "@/lib/library-data";
import { normalizePublicHref } from "@/lib/shared";
import { SECTION_ADDED } from "@/lib/perf/schedule";

export const CaseLibrary = dynamic(
  async () => {
    const [{ default: CaseLibrarySection }, data] = await Promise.all([
      import("@/components/blog/CaseLibrarySection"),
      fetch(normalizePublicHref("/library.json")).then((response) => {
        if (!response.ok) throw new Error(`library.json: HTTP ${response.status}`);
        return response.json() as Promise<LibraryData>;
      }),
    ]);
    return function LoadedCaseLibrary() {
      /* Tells the navbar and OffscreenAnimations that #cases is now the real section */
      useEffect(() => {
        window.dispatchEvent(new Event(SECTION_ADDED));
      }, []);
      return <CaseLibrarySection data={data} />;
    };
  },
  {
    ssr: false,
    /* id="cases" on the skeleton: /#cases links land here before the data arrives */
    loading: () => (
      <div id="cases">
        <SectionSkeleton lines={6} tall />
      </div>
    ),
  },
);
