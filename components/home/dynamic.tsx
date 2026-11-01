"use client";

/*
 * The home page's dynamic imports (next/dynamic only code-splits when called
 * from a Client Component, not from app/page.tsx).
 *
 *   Server-rendered, own chunk — in the HTML, JavaScript split per section.
 *   Lazy — not in the HTML; code loads in idle time and the section mounts
 *   near the viewport (lib/perf/lazy.tsx), sized by .lazy-h-* in globals.css.
 */

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

/* ── Server-rendered, split per section ── */
export const RolesFit = dynamic(() => import("@/components/home/RolesFit"), { loading: () => <SectionSkeleton lines={3} /> });
export const WorkShowcase = dynamic(() => import("@/components/home/WorkShowcase"), { loading: () => <SectionSkeleton lines={2} /> });
export const ExperienceTimeline = dynamic(() => import("@/components/home/ExperienceTimeline"), { loading: () => <SectionSkeleton lines={3} tall /> });
export const TeachingSection = dynamic(() => import("@/components/home/TeachingSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const PlatformsSection = dynamic(() => import("@/components/home/PlatformsSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const FaqSection = dynamic(() => import("@/components/home/FaqSection"), { loading: () => <SectionSkeleton lines={4} /> });
export const ContactFooter = dynamic(() => import("@/components/layout/ContactFooter"), { loading: () => <SectionSkeleton lines={2} /> });
export const MobileActionBar = dynamic(() => import("@/components/home/MobileActionBar"));
export const PaletteHint = dynamic(() => import("@/components/home/PaletteHint"));
