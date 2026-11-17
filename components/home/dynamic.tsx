"use client";

/*
 * The home page's dynamic imports (next/dynamic only code-splits when called
 * from a Client Component, not from app/page.tsx).
 *
 *   Every section is its own chunk (JS file) and is rendered into the
 *   page's HTML, as on Sensei-Dev — the whole page is there from the start.
 *
 * `dynamic(() => import(path), { loading })`:
 *   • import(path)  → that component becomes a separate JS file (chunk).
 *   • loading       → the grey skeleton shown while that file downloads
 *                     (components/ui/SectionSkeleton.tsx; `lines` = how many
 *                     grey bars, `tall` = taller placeholder).
 *   • ssr: false    → never rendered into the HTML, browser only (overlays
 *                     that depend on window size / localStorage).
 *
 * HOW TO ADD a home section: add one line here, e.g.
 *   export const MySection = dynamic(() => import("@/components/home/MySection"),
 *     { loading: () => <SectionSkeleton lines={3} /> });
 * then import { MySection } from "@/components/home/dynamic" in app/page.tsx
 * and put <MySection /> where it should appear.
 */

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

/* ── Split per section ── */
export const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
export const WorkShowcase = dynamic(() => import("@/components/home/WorkShowcase"), { loading: () => <SectionSkeleton lines={2} /> });
export const ExperienceTimeline = dynamic(() => import("@/components/home/ExperienceTimeline"), { loading: () => <SectionSkeleton lines={3} tall /> });
export const TeachingSection = dynamic(() => import("@/components/home/TeachingSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const Testimonials = dynamic(() => import("@/components/home/Testimonials"), { loading: () => <SectionSkeleton lines={3} /> });
export const StudentFeedback = dynamic(() => import("@/components/home/StudentFeedback"), { loading: () => <SectionSkeleton lines={3} /> });
export const PlatformsSection = dynamic(() => import("@/components/home/PlatformsSection"), { loading: () => <SectionSkeleton lines={3} /> });
/* The sections from Sensei-Dev's layout (data/about.ts) */
export const ToolsSection = dynamic(() => import("@/components/home/ToolsSection"), { loading: () => <SectionSkeleton lines={2} /> });
export const PathSection = dynamic(() => import("@/components/home/PathSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const AthleteSection = dynamic(() => import("@/components/home/AthleteSection"), { loading: () => <SectionSkeleton lines={2} /> });
export const ContactFooter = dynamic(() => import("@/components/layout/ContactFooter"), { loading: () => <SectionSkeleton lines={2} /> });
/* Overlays: client only */
/* The chapter rail (wide screens) + back-to-top button */
export const SectionRail = dynamic(() => import("@/components/home/SectionRail"), { ssr: false });
