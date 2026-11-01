"use client";

/*
 * The blog page's dynamic imports (next/dynamic only code-splits when called
 * from a Client Component). The library remains server-rendered; ATT&CK,
 * detections and the triage quiz mount lazily near the viewport.
 */

import dynamic from "next/dynamic";
import LazySection, { preloadable } from "@/lib/perf/lazy";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

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
