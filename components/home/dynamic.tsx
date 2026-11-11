"use client";

/*
 * The home page's dynamic imports (next/dynamic only code-splits when called
 * from a Client Component, not from app/page.tsx).
 *
 *   Every section is its own chunk. app/page.tsx wraps each one below the
 *   hero in <LazySection> (lib/perf/lazy.tsx): not in the HTML, mounted in
 *   idle time or when the reader gets near, sized by .lazy-h-* in
 *   globals.css — so a section's code downloads only when it mounts.
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
 * and wrap it in <LazySection> (recipe in app/page.tsx's header).
 */

import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

/* ── Split per section ── */
export const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
export const WorkShowcase = dynamic(() => import("@/components/home/WorkShowcase"), { loading: () => <SectionSkeleton lines={2} /> });
export const ExperienceTimeline = dynamic(() => import("@/components/home/ExperienceTimeline"), { loading: () => <SectionSkeleton lines={3} tall /> });
export const TeachingSection = dynamic(() => import("@/components/home/TeachingSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const Testimonials = dynamic(() => import("@/components/home/Testimonials"), { loading: () => <SectionSkeleton lines={3} /> });
export const PlatformsSection = dynamic(() => import("@/components/home/PlatformsSection"), { loading: () => <SectionSkeleton lines={3} /> });
export const ContactFooter = dynamic(() => import("@/components/layout/ContactFooter"), { loading: () => <SectionSkeleton lines={2} /> });
/* Overlays: client only */
export const MobileActionBar = dynamic(() => import("@/components/home/MobileActionBar"), { ssr: false });
export const PaletteHint = dynamic(() => import("@/components/home/PaletteHint"), { ssr: false });
