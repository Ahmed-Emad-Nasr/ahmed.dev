/*
 * Testimonials — what others wrote about him, word for word. Server Component.
 *
 * ═══ components/home/Testimonials.tsx — the TESTIMONIALS section (#testimonials) ═══
 *
 *   Part on screen                      Edit in data/testimonials.ts
 *   ──────────────────────────────────  ──────────────────────────────
 *   "In Their Words." + count badge     (counted automatically)
 *   The two large named cards           RECOMMENDATIONS (LinkedIn)
 *   The wall of shorter quotes          STUDENT_FEEDBACK
 *
 * Arabic quotes are set right-to-left (lang="ar" dir="rtl").
 */

import { ArrowUpRight, Quote } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { CounterBadge, KanjiWatermark, cardSurface, chipNeutral } from "@/components/ui/kit";
import { Linkedin } from "@/components/ui/BrandIcons";
import {
  LINKEDIN_RECOMMENDATIONS_URL,
  RECOMMENDATIONS,
  STUDENT_FEEDBACK,
  TESTIMONIALS,
  type Testimonial,
} from "@/data/testimonials";

/* "2026-03-26" → "Mar 2026" */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

function QuoteText({ t, large = false }: { t: Testimonial; large?: boolean }) {
  const rtl = t.lang === "ar";
  return (
    <blockquote
      lang={t.lang ?? "en"}
      dir={rtl ? "rtl" : "ltr"}
      className={`${large ? "text-base md:text-lg" : "text-sm md:text-[0.9375rem]"} text-foreground/80 font-light leading-relaxed ${rtl ? "text-right" : ""}`}
    >
      {/* "\n" in the data = a new paragraph, as the writer broke it */}
      {t.quote.split("\n").map((line, i) => (
        <p key={i} className={i ? "mt-3" : undefined}>
          {line}
        </p>
      ))}
    </blockquote>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="推薦" side="right" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <FadeIn
          x={-32}
          y={0}
          duration={0.7}
          className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className="min-w-0 flex-1">
            <h2
              id="testimonials-title"
              className="font-display title-fit [--title-n:8] font-black tracking-tighter uppercase leading-[0.85]"
            >
              <span className="text-foreground">In Their</span> <br />
              <span className="text-primary italic">Words.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              Recommendations from people I worked with, and feedback my students wrote after
              the course — quoted exactly as they wrote it.
            </p>
          </div>
          <CounterBadge value={TESTIMONIALS.length} top="Testimonials" bottom="Quoted" />
        </FadeIn>

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
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
        <FadeIn y={12} duration={0.5} className="mb-16 md:mb-20">
          <a
            href={LINKEDIN_RECOMMENDATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 hover:text-primary-ink transition-colors duration-180"
          >
            Read them on LinkedIn
            <ArrowUpRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </a>
        </FadeIn>

        {/* ─── Student feedback ─── */}
        <FadeIn x={-24} y={0} duration={0.6} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
          <h3 className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">
            From my students
          </h3>
          <span className="jp-eyebrow text-[0.6875rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp="受講生の声" />
          <span className={`${chipNeutral} ml-auto`}>Anonymous · {STUDENT_FEEDBACK.length}</span>
        </FadeIn>
        <ul className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {STUDENT_FEEDBACK.map((t, i) => (
            <li key={i} className="break-inside-avoid mb-6">
              <FadeIn delay={(i % 3) * 0.06} y={20} duration={0.5}>
                <figure className="relative border border-foreground/10 bg-surface/40 p-6 hover:border-primary/40 transition-colors duration-300">
                  <Quote size={18} className="mb-3 text-primary/40" aria-hidden="true" />
                  <QuoteText t={t} />
                  <figcaption className="mt-5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                    {t.author} — {t.source}
                  </figcaption>
                </figure>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
