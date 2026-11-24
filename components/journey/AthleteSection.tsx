/*
 * ═══ components/journey/AthleteSection.tsx — "Off the Clock." (#athlete on /journey) ═══
 * The other half of the week: running for Al Ahly SC now, modern pentathlon
 * at Benha Club before it. One card per sport, with its years and events;
 * each opens the sport's own page, /journey/<club-sport>, with its photos.
 * Edit the text in data/about.ts (ATHLETICS). Server Component.
 */

import Link from "next/link";
import { ArrowRight, Timer, Trophy } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { CardEffects } from "@/components/ui/Motion";
import { KanjiWatermark, chipNeutral, chipTertiary } from "@/components/ui/kit";
import { ATHLETICS } from "@/data/about";
import { journeyPath, sportSlug } from "@/data/journey-index";

export default function AthleteSection() {
  return (
    <section id="athlete" aria-labelledby="athlete-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      <KanjiWatermark chars="競技" side="right" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="athlete-title"
          eyebrow="Beyond security // The athlete"
          japanese="競技"
          titleA="Off the"
          titleB="Clock."
          description="When I'm not in a SIEM or a classroom, I'm on the track. Years of training taught me what security work needs too: pacing, discipline, and showing up every single day."
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ATHLETICS.map((a, idx) => {
            const Icon = a.current ? Timer : Trophy;
            return (
              <FadeIn
                as="li"
                key={a.id}
                y={32}
                duration={0.7}
                delay={idx * 0.08}
                className="group spotlight relative bg-surface/60 border border-foreground/5 p-7 md:p-9 overflow-hidden hover:border-primary/40 transition-colors duration-500"
              >
                <CardEffects index={idx + 1} />
                <div className="relative flex items-center justify-between gap-4 mb-6">
                  <div className="p-2.5 bg-foreground/5 border border-foreground/10" aria-hidden="true">
                    <Icon size={18} className="text-primary-ink" />
                  </div>
                  <span className={a.current ? chipTertiary : chipNeutral}>
                    {a.current && <span className="sr-only">Current: </span>}
                    {a.years}
                  </span>
                </div>
                <p className="relative font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">
                  {a.sport}
                </p>
                <h3 className="relative mt-3 font-display text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">{a.club}</h3>
                <p className="relative mt-4 max-w-xl text-sm md:text-[0.9375rem] text-foreground/65 font-light leading-relaxed">{a.detail}</p>
                <ul className="relative mt-6 flex flex-wrap gap-2" aria-label={a.current ? "Events" : "The five disciplines"}>
                  {a.events.map((e) => (
                    <li key={e} className={chipNeutral}>
                      {e}
                    </li>
                  ))}
                </ul>
                <Link
                  href={journeyPath(sportSlug(a))}
                  prefetch={false}
                  className="group/more relative mt-7 inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-primary-ink hover:text-foreground transition-colors"
                >
                  The full story <span className="sr-only">of {a.sport} at {a.club}</span>
                  <ArrowRight size={13} className="transition-transform group-hover/more:translate-x-0.5" aria-hidden="true" />
                </Link>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
