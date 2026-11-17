/*
 * ═══ components/home/ToolsSection.tsx — "Tools of the Trade." (#tools) ═══
 * One card per skill group (data/about.ts → TOOL_GROUPS, from data/skills.ts).
 * Layout from Sensei-Dev's TechStackGrid. Server Component.
 */

import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import ShowMore from "@/components/ui/ShowMore";
import { TiltCard } from "@/components/ui/Motion";
import { KanjiWatermark, chipTertiary } from "@/components/ui/kit";
import { TOOL_GROUPS as GROUPS } from "@/data/about";

export default function ToolsSection() {
  return (
    <section id="tools" aria-labelledby="tools-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      {/* Old links to #uses (Daily Drivers, folded into these groups) land here */}
      <span id="uses" className="absolute top-0" aria-hidden="true" />
      <KanjiWatermark chars="武器庫" side="right" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="tools-title"
          eyebrow="Arsenal // The exact tools"
          japanese="武器庫"
          titleA="Tools of"
          titleB="The Trade."
          description="No buzzword bingo. Every item below is used in the work and the cases on this page — the list is the same as on the CV."
        />

        <ShowMore first={6} label="Show more tools" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [@media(min-width:90rem)]:grid-cols-4 gap-6">
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
        </ShowMore>
      </div>
    </section>
  );
}
