/*
 * Testimonials — the LinkedIn recommendations, word for word. Server Component.
 *
 * ═══ components/journey/Testimonials.tsx — "In Their Words." (#testimonials on /journey) ═══
 *
 *   Part on screen                      Edit in data/testimonials.ts
 *   ──────────────────────────────────  ──────────────────────────────
 *   "In Their Words." + count badge     (counted automatically)
 *   The large named cards               RECOMMENDATIONS (LinkedIn)
 *
 * Each card links to the writer's own page, /journey/<writer> (who they
 * are, how they know Ahmed, the role they worked with him in). The
 * students' feedback is on the Teaching page
 * (components/home/StudentFeedback.tsx, app/teaching/page.tsx).
 *
 * Arabic quotes are set right-to-left (lang="ar" dir="rtl").
 */

import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import Link from "next/link";
import { KanjiWatermark, cardSurface } from "@/components/ui/kit";
import { Linkedin } from "@/components/ui/BrandIcons";
import QuoteText from "@/components/ui/QuoteText";
import { LINKEDIN_RECOMMENDATIONS_URL, RECOMMENDATIONS, STUDENT_FEEDBACK } from "@/data/testimonials";
import { journeyPath, recommendationSlug } from "@/data/journey-index";

/* "2026-03-26" → "Mar 2026" */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;


export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="推薦" side="right" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="testimonials-title"
          eyebrow="Testimonials // In their words"
          japanese="推薦"
          titleA="In Their"
          titleB="Words."
          size="lg"
          description="Recommendations from people I worked with, quoted exactly as they wrote them. What my students wrote is on the Teaching page."
          aside={<CounterChip stats={[{ value: String(RECOMMENDATIONS.length).padStart(2, "0"), label: "Recommendations quoted" }]} />}
        />

        {/* ─── Named recommendations (LinkedIn) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {RECOMMENDATIONS.map((t, i) => (
            <FadeIn key={t.author} delay={i * 0.08} y={24} duration={0.6} className={`${cardSurface} p-7 md:p-9 flex flex-col`}>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/40 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary" aria-hidden="true" />
              <figure className="flex flex-col h-full">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">
                    <Linkedin size={14} className="text-[#0077b5]" aria-hidden="true" />
                    Recommendation
                  </span>
                  <Quote size={28} className="text-primary/30" aria-hidden="true" />
                </div>
                <div className="mb-6">
                  <QuoteText t={t} large />
                </div>
                <figcaption className="mt-auto pt-6 border-t border-foreground/10">
                  <p className="font-display text-lg font-black uppercase tracking-tight text-foreground">{t.author}</p>
                  <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60">
                    {t.source}
                    {t.date ? ` · ${monthYear(t.date)}` : ""}
                  </p>
                  <Link
                    href={journeyPath(recommendationSlug(t.author))}
                    prefetch={false}
                    className="group/more mt-4 inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-primary-ink hover:text-foreground transition-colors"
                  >
                    The full story <span className="sr-only">of {t.author}&apos;s recommendation</span>
                    <ArrowRight size={13} className="transition-transform group-hover/more:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
        <FadeIn y={12} duration={0.5} className="flex flex-wrap gap-x-8 gap-y-3">
          <a
            href={LINKEDIN_RECOMMENDATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 hover:text-primary-ink transition-colors duration-300"
          >
            Read them on LinkedIn
            <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </a>
          <Link
            href="/teaching#student-feedback"
            prefetch={false}
            className="group inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 hover:text-primary-ink transition-colors duration-300"
          >
            {STUDENT_FEEDBACK.length} notes from my students
            <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </Link>
        </FadeIn>

      </div>
    </section>
  );
}
