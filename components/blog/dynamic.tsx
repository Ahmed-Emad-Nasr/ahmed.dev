"use client";

/*
 * ═══ components/blog/dynamic.tsx — the blog's CODE-SPLITTING list ═══
 *
 * The blog's dynamic imports (next/dynamic only code-splits when called from
 * a Client Component — that's why this file says "use client"). Every
 * section is its own JS file but is still rendered into the page's HTML,
 * as on Sensei-Dev (components/home/dynamic.tsx works the same way).
 *
 * The one exception is the case library: its data (82 cases, /library.json)
 * is too big for the HTML, so it is fetched in the browser right after the
 * page loads. Until it arrives, a skeleton holds #cases so links to it work.
 *
 * HOW TO ADD a blog section:
 *   export const MyThing = dynamic(() => import("@/components/blog/MyThing"),
 *     { loading: () => <SectionSkeleton lines={3} /> });
 * then use <MyThing /> in app/page.tsx.
 */

import dynamic from "next/dynamic";
import { useEffect } from "react";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import type { LibraryData } from "@/lib/library-data";
import { normalizePublicHref } from "@/lib/shared";
import { SECTION_ADDED } from "@/lib/perf/schedule";

export const AreaIntro = dynamic(() => import("@/components/ui/AreaIntro"));
export const CaseArticle = dynamic(() => import("@/components/blog/CaseArticle"));
export const HomeLab = dynamic(() => import("@/components/home/HomeLab"), {
  loading: () => <SectionSkeleton lines={3} />,
});
export const AttackCoverage = dynamic(() => import("@/components/blog/AttackCoverage"), {
  loading: () => <SectionSkeleton lines={3} tall />,
});
export const DetectionLibrary = dynamic(() => import("@/components/blog/DetectionLibrary"), {
  loading: () => <SectionSkeleton lines={3} />,
});
export const TriageChallenge = dynamic(() => import("@/components/blog/TriageChallenge"), {
  loading: () => <SectionSkeleton lines={2} />,
});
export const ContributionsGrid = dynamic(() => import("@/components/home/ContributionsGrid"), {
  loading: () => <SectionSkeleton lines={3} />,
});

/* The library's code and its data (/library.json, built by
   app/library.json/route.ts) are fetched together, once, in the browser. */
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
