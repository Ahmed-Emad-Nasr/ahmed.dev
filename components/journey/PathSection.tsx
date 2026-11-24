/*
 * ═══ components/journey/PathSection.tsx — "The Path." (#path on /journey) ═══
 * One line per step, oldest first (data/about.ts → PATH). The last step is
 * filled in. Each step's title opens its own page, /journey/<year-title>,
 * with the roles, certificates and photos behind it (data/journey.ts).
 * Layout from Sensei-Dev's MilestonesSection. Server Component.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { KanjiWatermark } from "@/components/ui/kit";
import CounterChip from "@/components/ui/CounterChip";
import { PATH } from "@/data/about";
import { journeyPath, pathSlug } from "@/data/journey-index";

export default function PathSection() {
  return (
    <section id="path" aria-labelledby="path-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      {/* Old links to #now (the Right Now section, removed) land here */}
      <span id="now" className="absolute top-0" aria-hidden="true" />
      {/* 道程 — the road travelled */}
      <KanjiWatermark chars="道程" side="right" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="path-title"
          eyebrow="Milestones // How it compounded"
          japanese="歩み"
          titleA="The"
          titleB="Path."
          size="lg"
          description="Every step below is documented: open one for the roles, the certificates and the photos behind it."
          aside={<CounterChip stats={[{ value: String(PATH.length).padStart(2, "0"), label: "Stops so far" }]} />}
        />

        <div className="relative max-w-4xl">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-foreground/10" aria-hidden="true" />
          <ol className="flex flex-col">
            {PATH.map((m, idx) => {
              const showYear = idx === 0 || PATH[idx - 1]!.year !== m.year;
              return (
                <FadeIn as="li" key={`${m.year}-${m.title}`} className="relative flex gap-6 pb-10 last:pb-0">
                  <span
                    className={`relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rotate-45 border-2 ${
                      idx === PATH.length - 1 ? "border-primary bg-primary" : "border-primary/60 bg-background"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5">
                    <span className="font-mono text-sm font-black text-accent tabular-nums shrink-0 w-12">
                      {showYear ? m.year : <span className="text-foreground/20" aria-hidden="true">·</span>}
                      {!showYear && <span className="sr-only">{m.year}</span>}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-black uppercase tracking-tight text-foreground">
                        <Link
                          href={journeyPath(pathSlug(m))}
                          prefetch={false}
                          className="group/step inline-flex items-center gap-2 hover:text-primary-ink transition-colors"
                        >
                          {m.title}
                          <ArrowRight size={16} className="text-primary-ink/70 transition-transform group-hover/step:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-foreground/60 font-light leading-relaxed">{m.detail}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
