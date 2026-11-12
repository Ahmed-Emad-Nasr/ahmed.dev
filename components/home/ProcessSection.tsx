/*
 * ═══ components/home/ProcessSection.tsx — "Risk to Response." (#process) ═══
 * How a security job runs, in four steps (data/about.ts → PROCESS).
 * Layout from Sensei-Dev's ProcessSection. Server Component.
 */

import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { KanjiWatermark } from "@/components/ui/kit";
import { PROCESS } from "@/data/about";

export default function ProcessSection() {
  return (
    <section id="process" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      <KanjiWatermark chars="手順" side="right" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          titleA="Risk to"
          titleB="Response."
          description="How I work on any security job: govern, protect, detect, respond. It follows NIST CSF, the framework most security teams use — and nothing is closed without the reason written down."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS.map((p, idx) => (
            <FadeIn
              y={28}
              duration={0.65}
              delay={idx * 0.08}
              key={p.id}
              className="relative spotlight bg-surface/60 border border-foreground/5 p-7 hover:border-primary/40 transition-colors duration-500"
            >
              <div className="font-mono text-5xl font-black text-foreground/[0.06] absolute top-4 right-5 select-none" aria-hidden="true" data-deco={p.index} />
              <div className="font-mono text-[0.6875rem] text-primary-ink tracking-[0.16em] uppercase mb-1">{p.index}</div>
              <div className="brush-jp text-sm text-foreground/60 mb-3" lang="ja">
                {p.japanese}
              </div>
              <h3 className="font-display text-xl font-black uppercase text-foreground mb-3">{p.title}</h3>
              <p className="text-sm text-foreground/60 font-light leading-relaxed">{p.description}</p>
              {idx < PROCESS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-primary/40" aria-hidden="true" />
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
