/*
 * ═══ components/blog/dynamic.tsx — the blog's CODE-SPLITTING list ═══
 *
 * The blog's dynamic imports. As on Sensei-Dev this is NOT a client module:
 * sections stay Server Components, rendered into the HTML on the server, so
 * their code and data never ship as JavaScript (only the ones that are
 * "use client" themselves send code, each in its own chunk).
 *
 * The one exception is the case library: its data (the cases, /library.json)
 * is too big for the HTML, so it is fetched in the browser right after the
 * page loads — components/blog/CaseLibraryLoader.tsx (a client module, since
 * it renders in the browser only). Until it arrives, a skeleton holds #cases
 * so links to it work.
 *
 * HOW TO ADD a blog section:
 *   export const MyThing = dynamic(() => import("@/components/blog/MyThing"),
 *     { loading: () => <SectionSkeleton lines={3} /> });
 * then use <MyThing /> in app/page.tsx.
 */

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

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
