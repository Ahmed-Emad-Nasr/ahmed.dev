"use client";

/*
 * ═══ components/blog/dynamic.tsx — the blog's CODE-SPLITTING list ═══
 *
 * The blog's dynamic imports (next/dynamic only code-splits when called from
 * a Client Component — that's why this file says "use client"). Every
 * section is its own chunk and mounts lazily — in idle time or near the
 * viewport (LazySection, lib/perf/lazy.tsx).
 *
 * Two patterns are used here:
 *   1. `dynamic(() => import(...))`  → a separate JS file for that component.
 *      `loading` = what shows while its code downloads (a grey skeleton).
 *      The page wraps these in <LazySection> itself (app/page.tsx).
 *   2. `preloadable(...)` + a `Lazy*` wrapper → the component AND its
 *      <LazySection> in one, so the page just writes <LazyTriage />.
 *      preloadable() also starts downloading the code in idle time.
 *
 * HOW TO ADD a lazily loaded blog section:
 *   const MyThing = preloadable(() => import("@/components/blog/MyThing"));
 *   export function LazyMyThing() {
 *     return (
 *       <LazySection id="my-thing" size="lazy-h-my-thing">
 *         <MyThing />
 *       </LazySection>
 *     );
 *   }
 * then use <LazyMyThing /> in app/page.tsx and add .lazy-h-my-thing to
 * app/globals.css.
 */

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import LazySection, { preloadable } from "@/lib/perf/lazy";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import type { AttackCoverageData, LibraryData } from "@/lib/library-data";
import { normalizePublicHref } from "@/lib/shared";
import type { ContributionStats } from "@/lib/api/contributions";

/* Pattern 1 — split into its own chunk; the page decides when it mounts */
export const AreaIntro = dynamic(() => import("@/components/ui/AreaIntro"));
/* The body of a single case page (/blog/<id>) */
export const CaseArticle = dynamic(() => import("@/components/blog/CaseArticle"));
export const HomeLab = dynamic(() => import("@/components/home/HomeLab"), {
  loading: () => <SectionSkeleton lines={3} />,
});
/* Pattern 2 — chunk + its own LazySection (id = the #anchor, size = placeholder height) */

/* The case library: its code AND its data (/library.json, app/library.json/
   route.ts) are fetched together, so the data is not in the home page's
   HTML. Until both are here the placeholder holds the place — and a jump to
   #cases waits for it (lib/perf/schedule.ts → revealAll). */
const loadCaseLibrary = async (): Promise<{ default: ComponentType<object> }> => {
  const [{ default: CaseLibrarySection }, data] = await Promise.all([
    import("@/components/blog/CaseLibrarySection"),
    fetch(normalizePublicHref("/library.json")).then((response) => {
      if (!response.ok) throw new Error(`library.json: HTTP ${response.status}`);
      return response.json() as Promise<LibraryData>;
    }),
  ]);
  return { default: () => <CaseLibrarySection data={data} /> };
};
const CaseLibrary = preloadable(loadCaseLibrary);

export function LazyCaseLibrary() {
  return (
    <LazySection id="cases" size="lazy-h-cases">
      <CaseLibrary />
    </LazySection>
  );
}
const AttackCoverage = preloadable(() => import("@/components/blog/AttackCoverage"));
const DetectionLibrary = preloadable(() => import("@/components/blog/DetectionLibrary"));

/* coverage = attackCoverage from lib/library-data.ts, computed by the page */
export function LazyAttackCoverage({ coverage }: { coverage: AttackCoverageData }) {
  return (
    <LazySection id="attack" size="lazy-h-attack">
      <AttackCoverage coverage={coverage} />
    </LazySection>
  );
}

export function LazyDetectionLibrary() {
  return (
    <LazySection id="detections" size="lazy-h-detection">
      <DetectionLibrary />
    </LazySection>
  );
}

const TriageChallenge = preloadable(() => import("@/components/blog/TriageChallenge"));

export function LazyTriage() {
  return (
    <LazySection id="triage" size="lazy-h-triage">
      <TriageChallenge />
    </LazySection>
  );
}

const ContributionsGrid = preloadable(() => import("@/components/home/ContributionsGrid"));

/* stats = the GitHub calendar, read at build time by app/page.tsx */
export function LazyContributions({ stats }: { stats: ContributionStats }) {
  return (
    <LazySection id="contributions" size="lazy-h-contributions">
      <ContributionsGrid stats={stats} />
    </LazySection>
  );
}
