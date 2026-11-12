/*
 * ═══ components/home/UsesSection.tsx — "Daily Drivers." ═══
 * What each part of a job is done with (data/about.ts → USES).
 * Layout from Sensei-Dev's UsesSection. Server Component.
 */

import FadeIn from "@/components/ui/FadeIn";
import { TiltCard } from "@/components/ui/Motion";
import { CounterBadge, KanjiWatermark, chipTertiary } from "@/components/ui/kit";
import { USES as GROUPS } from "@/data/about";

const toolCount = GROUPS.reduce((n, g) => n + g.items.length, 0);

export default function UsesSection() {
  return (
    <section id="uses" aria-labelledby="uses-title" className="relative pt-4 md:pt-8 pb-24 md:pb-32 px-6 md:px-20 bg-background overflow-hidden">
      <KanjiWatermark chars="毎日" side="left" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <FadeIn className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="min-w-0 flex-1">
            <h2 id="uses-title" className="font-display title-fit [--title-n:7] font-black tracking-tighter uppercase leading-[0.85]">
              <span className="text-foreground">Daily</span> <br />
              <span className="text-primary italic">Drivers.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              The tools behind the work above: detect, investigate, govern and automate.
            </p>
          </div>
          <CounterBadge value={String(toolCount).padStart(2, "0")} top="Tools" bottom="Loaded" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GROUPS.map((g) => (
            <FadeIn key={g.id}>
              <TiltCard className="group spotlight spotlight-blue relative bg-surface/60 border border-foreground/5 p-7 h-full hover:border-tertiary/50 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-tertiary/0 group-hover:bg-tertiary transition-colors duration-500" aria-hidden="true" />
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h3 className="font-display text-lg font-black uppercase tracking-tight text-foreground">{g.title}</h3>
                  <span className="brush-jp text-xl text-tertiary shrink-0" lang="ja" aria-hidden="true">
                    {g.japanese}
                  </span>
                </div>
                <div className="w-8 h-[2px] bg-tertiary/60 mb-5" aria-hidden="true" />
                <ul className="flex flex-wrap gap-2" aria-label={`${g.title} tools`}>
                  {g.items.map((item) => (
                    <li key={item} className={chipTertiary}>
                      {item}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
