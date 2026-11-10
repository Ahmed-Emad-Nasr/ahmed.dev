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
 *      The page wraps these in <LazySection> itself (app/blog/page.tsx).
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
 * then use <LazyMyThing /> in app/blog/page.tsx and add .lazy-h-my-thing to
 * app/globals.css.
 */

import dynamic from "next/dynamic";
import LazySection, { preloadable } from "@/lib/perf/lazy";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

/* Pattern 1 — split into its own chunk; the page decides when it mounts */
export const AreaIntro = dynamic(() => import("@/components/ui/AreaIntro"));
/* The body of a single case page (/blog/<id>) */
export const CaseArticle = dynamic(() => import("@/components/blog/CaseArticle"));
export const CaseLibrarySection = dynamic(() => import("@/components/blog/CaseLibrarySection"), {
  loading: () => <SectionSkeleton lines={4} tall />,
});
export const HomeLab = dynamic(() => import("@/components/home/HomeLab"), {
  loading: () => <SectionSkeleton lines={3} />,
});
export const ProcessSection = dynamic(() => import("@/components/home/ProcessSection"), {
  loading: () => <SectionSkeleton lines={3} />,
});
/* Pattern 2 — chunk + its own LazySection (id = the #anchor, size = placeholder height) */
const AttackCoverage = preloadable(() => import("@/components/blog/AttackCoverage"));
const DetectionLibrary = preloadable(() => import("@/components/blog/DetectionLibrary"));

export function LazyAttackCoverage() {
  return (
    <LazySection id="attack" size="lazy-h-attack">
      <AttackCoverage />
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

export function LazyContributions() {
  return (
    <LazySection id="contributions" size="lazy-h-contributions">
      <ContributionsGrid />
    </LazySection>
  );
}
