"use client";

import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import type { ContributionStats } from "@/lib/api/contributions";
import { ContributionGraph } from "@/components/home/ContributionGraph";
import { CountUp } from "@/components/ui/CountUp";
import { ExternalLink } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

/* Open-source contributions to other projects, plus the GitHub contribution
   graph

   ═══ components/home/ContributionsGrid.tsx — the CONTRIBUTIONS section (#contributions) ═══
   • The contribution cards (rule merged upstream, …) → PORTFOLIO_DATA.contributions
     in data/portfolio-data.ts.
   • The green-squares year graph → components/home/ContributionGraph.tsx; its
     data (`stats`) is read at build time by lib/api/contributions.ts in
     app/page.tsx (GitHub username = PROFILE.contact.github). */
export default function ContributionsGrid({ stats }: { stats: ContributionStats }) {
  return (
    <section id="contributions" aria-label="Open-source contributions" className="relative py-16 md:py-20 px-6 md:px-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <FadeIn x={-32} y={0} duration={0.7}
          className="mb-10 flex flex-wrap items-center gap-4"
        >
          {stats.status === "ready" && (
            <span className="ml-auto flex items-center gap-3 border border-foreground/10 bg-surface/60 px-4 py-2">
              <span className="font-mono text-lg font-black text-accent tabular-nums">
                <CountUp target={stats.total} />
              </span>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                commits // last year
              </span>
            </span>
          )}
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PORTFOLIO_DATA.contributions.map((c, idx) => (
            <FadeIn as="a" y={24} duration={0.65} delay={idx * 0.08}
              key={c.name}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group spotlight relative bg-surface/60 border border-foreground/5 p-6 hover:border-tertiary/50 transition-colors duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="font-display text-lg font-black uppercase tracking-tight text-foreground group-hover:text-tertiary transition-colors duration-180">
                  {c.name}
                </h3>
                <ExternalLink
                  size={14}
                  className="text-foreground/25 group-hover:text-tertiary transition-colors duration-180 shrink-0"
                />
              </div>
              <span className="mb-3 w-fit px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-tertiary bg-tertiary/10 border border-tertiary/25">
                {c.org}
              </span>
              <p className="text-sm text-foreground/60 font-light leading-relaxed">{c.description}</p>
            </FadeIn>
          ))}
        </div>

        {/* Same height with the graph and without it (GitHub was down at build) */}
        <div className="mt-6 flex min-h-[255px] flex-col md:min-h-[236px] [&>*]:flex-1">
          <ContributionGraph stats={stats} />
        </div>
      </div>
    </section>
  );
}
