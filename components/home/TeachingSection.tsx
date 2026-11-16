/*
 * TeachingSection — the diploma curriculum module by module, and where it
 * was taught with the results. Server Component.
 *
 * ═══ components/home/TeachingSection.tsx — the TEACHING section (#teaching) ═══
 *
 *   Part on screen                      Edit in data/teaching.ts
 *   ──────────────────────────────────  ──────────────────────────────
 *   "Pass it Forward." + hours badge    DIPLOMA.hours
 *   Headline numbers (students, …)      TEACHING_STATS
 *   Curriculum card + numbered modules  DIPLOMA.title / summary / modules / format
 *   "Where it was taught" cards         TEACHING_ROLES
 *
 * Add a module / stat / teaching place → add an entry to the matching array
 * in data/teaching.ts; it appears here automatically.
 *
 * `content` = the language: TEACHING_EN (default) or TEACHING_AR
 * (data/teaching-ar.ts, the /ar/teaching page). The layout uses logical
 * sides (start / end), so it mirrors by itself under dir="rtl".
 */

import { ArrowUpRight, Mail } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import OrgLogo from "@/components/ui/OrgLogo";
import { KanjiWatermark, cardSurface, chipNeutral, chipTertiary, ctaPrimary } from "@/components/ui/kit";
import { TEACHING_EN, type TeachingContent } from "@/data/teaching";
import { PROFILE } from "@/data/profile";

export default function TeachingSection({ content = TEACHING_EN }: { content?: TeachingContent }) {
  const { stats, diploma, roles, ui } = content;
  const mailto = `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent(ui.cta.subject)}&body=${encodeURIComponent(ui.cta.body)}`;
  return (
    <section
      id="teaching"
      aria-labelledby="teaching-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="指導" side="left" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="teaching-title"
          as="h1"
          eyebrow={ui.eyebrow}
          japanese="指導"
          titleA={ui.titleA}
          titleB={ui.titleB}
          size="lg"
          description={ui.description}
          aside={<CounterChip stats={[ui.hoursChip]} />}
        />

        {/* ─── Headline numbers ─── */}
        <FadeIn className="mb-10 md:mb-12">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 sm:px-6 py-5 bg-background min-w-0"
              >
                <dt className="order-2 flex flex-col min-w-0">
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                    {s.label}
                  </span>
                  <span
                    className="jp-eyebrow text-[0.5625rem] text-foreground/25"
                    lang="ja"
                    aria-hidden="true"
                    data-jp={s.japanese}
                  />
                </dt>
                <dd dir="auto" className="order-1 font-mono text-xl md:text-2xl font-black tabular-nums text-accent">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-10 items-start">
          {/* ─── The diploma: one path, module by module ─── */}
          <FadeIn className={`${cardSurface} p-7 md:p-9`}>
            <div
              className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/40 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">
                {ui.curriculumLabel}
              </span>
              <span
                className="jp-eyebrow text-[0.625rem] text-foreground/30"
                lang="ja"
                aria-hidden="true"
                data-jp={diploma.japanese}
              />
            </div>
            <h3 className="mt-5 font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-[0.95]">
              {diploma.title}
            </h3>
            <p className="mt-4 text-sm md:text-base text-foreground/60 font-light leading-relaxed">
              {diploma.summary}
            </p>

            {/* The path: numbered stops on a red rail */}
            <ol className="relative mt-8 border-s border-primary/40 ms-[11px]">
              {diploma.modules.map((m) => (
                <li key={m.n} className="group/mod relative ps-7 py-3">
                  <span
                    className="absolute -start-[12px] top-1/2 -translate-y-1/2 grid place-items-center w-[23px] h-[23px] bg-surface border border-primary/60 font-mono text-[0.5625rem] font-bold text-primary-ink group-hover/mod:bg-primary group-hover/mod:text-white transition-colors"
                    aria-hidden="true"
                  >
                    {m.n}
                  </span>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm md:text-[0.9375rem] text-foreground/85">
                      <span className="sr-only">{`${ui.moduleLabel} ${m.n}: `}</span>
                      {m.title}
                    </span>
                    <span className="max-w-[42%] text-end break-words font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                      {m.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-foreground/10">
              <p className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                {ui.sessionEndsWith}
              </p>
              <ul className="flex flex-wrap gap-2">
                {diploma.format.map((f) => (
                  <li key={f} className={chipNeutral}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* ─── Where it was taught ─── */}
          <div className="border-t border-foreground/10">
            {roles.map((r, i) => (
              <FadeIn key={r.org} delay={i * 0.05} y={16} duration={0.5}>
                <article className="group py-6 border-b border-foreground/10">
                  <div className="flex items-start justify-between gap-4">
                    <OrgLogo name={r.org} className="group-hover:border-primary" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tight leading-tight">
                        {r.link ? (
                          <a
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1.5 hover:text-primary transition-colors duration-300"
                          >
                            {r.orgLabel ?? r.org}
                            <ArrowUpRight
                              size={14}
                              className="mt-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                              aria-hidden="true"
                            />
                          </a>
                        ) : (
                          r.orgLabel ?? r.org
                        )}
                      </h3>
                      <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-primary-ink">
                        {r.role}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.25em] px-2.5 py-1 border ${
                        r.period === ui.now
                          ? "border-primary/40 text-primary-ink bg-primary/[0.06]"
                          : "border-foreground/10 text-foreground/60"
                      }`}
                    >
                      {r.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-foreground/60 font-light leading-relaxed">
                    {r.topics}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {r.results.map((x) => (
                      <li key={x} className={chipTertiary}>
                        {x}
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* ─── Training for a team: opens the visitor's mail app ─── */}
        <FadeIn className={`${cardSurface} mt-12 md:mt-16 p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6`}>
          <div
            className="absolute top-0 start-0 w-full h-[2px] bg-gradient-to-r rtl:bg-gradient-to-l from-tertiary via-tertiary/40 to-transparent"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">
              {ui.cta.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
              {ui.cta.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-foreground/60 font-light leading-relaxed">
              {ui.cta.text}
            </p>
          </div>
          <a href={mailto} className={`${ctaPrimary} shrink-0 self-start md:self-center`}>
            <Mail size={16} aria-hidden="true" />
            {ui.cta.button}
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
