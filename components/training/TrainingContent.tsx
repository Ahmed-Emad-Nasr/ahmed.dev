/*
 * ═══ components/training/TrainingContent.tsx — the body of both training pages ═══
 *
 * /training (English) and /ar/training (Arabic) are the same page in two
 * languages: who it is for, three ways to take it, the diploma module by
 * module, three student quotes and the request button. The words come in
 * through `copy` (data/training.ts); the layout uses logical sides
 * (start / end), so it mirrors itself right to left. Server Component.
 */

import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Mail, School, Users } from "lucide-react";
import BackCrumb from "@/components/layout/BackCrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import FadeIn from "@/components/ui/FadeIn";
import { KanjiWatermark, btnOutline, cardSurface, chipNeutral, ctaPrimary } from "@/components/ui/kit";
import { STUDENT_FEEDBACK } from "@/data/testimonials";
import { PROFILE } from "@/data/profile";
import type { TrainingCopy } from "@/data/training";

/* In the order of copy.audiences */
const AUDIENCE_ICONS = [Building2, School, GraduationCap, Users];

/* Three student quotes in the page's language: two sentences (English) or the
   first paragraph (Arabic) of each — not the thank-you line they open with */
function quotesFor(lang: "en" | "ar") {
  const isAr = (q: string) => /[؀-ۿ]/.test(q);
  const thanks = lang === "ar" ? /شكر/ : /thank|appreciat/i;
  return STUDENT_FEEDBACK.filter((t) => (lang === "ar" ? isAr(t.quote) : !isAr(t.quote)) && t.quote.length > 150)
    .map((t) => {
      const parts = lang === "ar" ? t.quote.split("\n") : t.quote.split(/\n|(?<=[a-z]{3}[.!])\s+/);
      const keep = parts.filter((s) => s.trim() && !thanks.test(s));
      return { ...t, short: keep.slice(0, lang === "ar" ? 1 : 2).join(" ") };
    })
    .filter((t) => t.short.length > 60)
    .slice(0, 3);
}

const subTitle = "mb-8 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink";

export default function TrainingContent({ copy }: { copy: TrainingCopy }) {
  const { cta, diploma } = copy;
  const mailto = `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent(cta.subject)}&body=${encodeURIComponent(cta.body)}`;
  const quotes = quotesFor(copy.lang);
  const ar = copy.lang === "ar";

  return (
    <section className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
      <KanjiWatermark chars="研修" side={ar ? "left" : "right"} />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-x-6">
          <BackCrumb href={copy.back.href} label={copy.back.label} current={copy.back.current} />
          {/* The same page in the other language — no prefetch: it would load the other font */}
          <Link
            href={copy.switchLang.href}
            prefetch={false}
            hrefLang={copy.switchLang.hrefLang}
            lang={copy.switchLang.hrefLang}
            dir={copy.switchLang.hrefLang === "ar" ? "rtl" : "ltr"}
            className="mb-10 inline-flex min-h-6 items-center gap-2 text-sm text-foreground/70 hover:text-primary-ink transition-colors duration-300"
          >
            {copy.switchLang.label}
          </Link>
        </div>

        <SectionHeader
          as="h1"
          eyebrow={copy.eyebrow}
          japanese="研修"
          titleA={copy.titleA}
          titleB={copy.titleB}
          size="lg"
          description={copy.lead}
          aside={
            <div className="flex flex-col items-start gap-4">
              <CounterChip stats={copy.stats} />
              <a href={mailto} className={ctaPrimary}>
                <Mail size={16} aria-hidden="true" /> {cta.button}
              </a>
            </div>
          }
        />

        {/* ─── Who it is for ─── */}
        <h2 className={subTitle}>
          <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
          {copy.audiencesTitle}
        </h2>
        <ul className="mb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {copy.audiences.map((a, i) => {
            const Icon = AUDIENCE_ICONS[i % AUDIENCE_ICONS.length];
            return (
              <FadeIn as="li" key={a.title} y={16} delay={i * 0.08} className={`${cardSurface} p-6`}>
                <Icon size={22} className="text-primary-ink" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-black uppercase tracking-tight leading-tight">{a.title}</h3>
                <p className="mt-3 text-sm text-foreground/60 font-light leading-relaxed">{a.text}</p>
              </FadeIn>
            );
          })}
        </ul>

        {/* ─── The ways to take it ─── */}
        <h2 className={subTitle}>
          <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
          {copy.formatsTitle}
        </h2>
        <ul className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.formats.map((f, i) => (
            <FadeIn as="li" key={f.title} y={16} delay={i * 0.08} className={`${cardSurface} p-7`}>
              <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">{f.detail}</p>
              <h3 className="mt-3 font-display text-xl font-black uppercase tracking-tight leading-tight">{f.title}</h3>
              <p className="mt-3 text-sm text-foreground/60 font-light leading-relaxed">{f.text}</p>
            </FadeIn>
          ))}
        </ul>

        {/* ─── The diploma, module by module ─── */}
        <h2 className={subTitle}>
          <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
          {diploma.title} — <bdi>{diploma.hours}</bdi> {copy.hoursLabel}
        </h2>
        <FadeIn className={`${cardSurface} mb-24 p-7 md:p-10`}>
          <p className="max-w-3xl text-sm md:text-base text-foreground/60 font-light leading-relaxed">{diploma.summary}</p>
          <ol className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-10">
            {diploma.modules.map((m) => (
              <li key={m.n} className="flex items-baseline gap-4 py-4 border-b border-foreground/10">
                <span className="font-mono text-xs font-black text-accent tabular-nums shrink-0">
                  <span className="sr-only">{copy.moduleLabel} </span>
                  {m.n}
                </span>
                <span className="flex-1 text-sm md:text-[0.9375rem] text-foreground/85">{m.title}</span>
                <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">{m.detail}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">{copy.sessionEndsWith}</p>
          <ul className="flex flex-wrap gap-2">
            {diploma.format.map((f) => (
              <li key={f} className={chipNeutral}>
                {f}
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* ─── What students said ─── */}
        {quotes.length > 0 && (
          <>
            <h2 className={subTitle}>
              <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
              {copy.quotesTitle}
            </h2>
            <ul className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {quotes.map((q, i) => (
                <FadeIn as="li" key={q.short} y={16} delay={i * 0.08} className={`${cardSurface} p-7`}>
                  <blockquote>
                    <p className="text-sm md:text-[0.9375rem] text-foreground/80 font-light leading-relaxed">“{q.short}”</p>
                    <footer dir="ltr" className="mt-4 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 text-start">
                      {q.author} · {q.source}
                    </footer>
                  </blockquote>
                </FadeIn>
              ))}
            </ul>
          </>
        )}
        <Link prefetch={false} href={copy.reviewsHref} className={`${btnOutline} mb-24`}>
          {copy.allReviews(STUDENT_FEEDBACK.length)} <ArrowRight size={13} className="rtl:-scale-x-100" aria-hidden="true" />
        </Link>

        {/* ─── The request ─── */}
        <FadeIn className={`${cardSurface} p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6`}>
          <div
            className="absolute top-0 start-0 w-full h-[2px] bg-gradient-to-r rtl:bg-gradient-to-l from-tertiary via-tertiary/40 to-transparent"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">{cta.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">{cta.title}</h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-foreground/60 font-light leading-relaxed">{cta.text}</p>
          </div>
          <a href={mailto} className={`${ctaPrimary} shrink-0 self-start md:self-center`}>
            <Mail size={16} aria-hidden="true" />
            {cta.button}
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
