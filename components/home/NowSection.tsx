/*
 * ═══ components/home/NowSection.tsx — "Right Now." ═══
 * A snapshot of the present (data/about.ts → NOW) — update it when a role
 * starts or ends. Layout from Sensei-Dev's NowSection. Server Component.
 */

import FadeIn from "@/components/ui/FadeIn";
import { KanjiWatermark } from "@/components/ui/kit";
import { NOW } from "@/data/about";

export default function NowSection() {
  return (
    <section id="now" aria-labelledby="now-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-surface/30 border-y border-foreground/5 overflow-hidden">
      <KanjiWatermark chars="現在" side="left" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Header ─── */}
        <FadeIn className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="min-w-0 flex-1">
            <h2 id="now-title" className="font-display title-fit [--title-n:5] font-black tracking-tighter uppercase leading-[0.85]">
              <span className="text-foreground">Right</span> <br />
              <span className="text-primary-ink italic">Now.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              A snapshot, not a promise. Updated as the work shifts.
            </p>
          </div>
          <div className="relative flex items-center gap-3 px-6 py-3 border border-primary/40 bg-surface/60 shrink-0">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" aria-hidden="true" />
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.3em] text-primary-ink">Current</span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NOW.map((n) => (
            <FadeIn
              key={n.label}
              className="spotlight spotlight-blue relative bg-background/60 border border-foreground/5 p-7 hover:border-primary/50 transition-colors duration-500"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 bg-primary" />
                </span>
                <h3 className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-primary-ink">{n.label}</h3>
              </div>
              <p className="border-l-2 border-primary/70 pl-4 text-sm text-foreground/75 font-light leading-relaxed">{n.detail}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
