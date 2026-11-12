/*
 * ═══ components/home/PathSection.tsx — "The Path." ═══
 * One line per step, oldest first (data/about.ts → PATH). The last step is
 * filled in. Layout from Sensei-Dev's MilestonesSection. Server Component.
 */

import FadeIn from "@/components/ui/FadeIn";
import { MOTION_EASE } from "@/lib/motion";
import { CounterBadge } from "@/components/ui/kit";
import { PATH } from "@/data/about";

export default function PathSection() {
  return (
    <section id="path" aria-labelledby="path-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="min-w-0 flex-1">
            <h2 id="path-title" className="font-display title-fit [--title-n:5] font-black tracking-tighter uppercase leading-[0.85]">
              <span className="text-foreground">The</span> <br />
              <span className="text-primary italic">Path.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              Every step below is documented on this page: experience, cases or credentials.
            </p>
          </div>
          <CounterBadge value={String(PATH.length).padStart(2, "0")} top="Stops" bottom="So far" />
        </div>

        <div className="relative max-w-4xl">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-foreground/10" aria-hidden="true" />
          <ol className="flex flex-col">
            {PATH.map((m, idx) => {
              const showYear = idx === 0 || PATH[idx - 1]!.year !== m.year;
              return (
                <FadeIn as="li" key={`${m.year}-${m.title}`} x={-24} y={0} duration={0.6} delay={idx * 0.06} ease={MOTION_EASE} className="relative flex gap-6 pb-10 last:pb-0">
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
                      <h3 className="font-display text-xl font-black uppercase tracking-tight text-foreground">{m.title}</h3>
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
