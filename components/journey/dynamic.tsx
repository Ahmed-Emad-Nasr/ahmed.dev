/*
 * The dynamic imports of /journey (app/journey/page.tsx) — the same pattern
 * as components/home/dynamic.tsx: NOT a client module, so the sections stay
 * Server Components rendered into the page's HTML, each split into its own
 * chunk, with a grey skeleton (components/ui/SectionSkeleton.tsx) while its
 * file downloads.
 */

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

export const PathSection = dynamic(() => import("@/components/journey/PathSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const PlatformsSection = dynamic(() => import("@/components/journey/PlatformsSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const Testimonials = dynamic(() => import("@/components/journey/Testimonials"), { loading: () => <SectionSkeleton lines={3} /> });
export const AthleteSection = dynamic(() => import("@/components/journey/AthleteSection"), { loading: () => <SectionSkeleton lines={2} /> });
