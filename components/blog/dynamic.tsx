"use client";

/*
 * The blog's dynamic imports (next/dynamic only code-splits when called from
 * a Client Component). Every section is its own chunk and mounts lazily —
 * in idle time or near the viewport (LazySection, lib/perf/lazy.tsx).
 */

import dynamic from "next/dynamic";
import LazySection, { preloadable } from "@/lib/perf/lazy";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

export const AreaIntro = dynamic(() => import("@/components/ui/AreaIntro"));
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
