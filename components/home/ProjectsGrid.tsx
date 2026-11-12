/*
 * ═══ components/home/ProjectsGrid.tsx — "Open Source." (#projects) ═══
 * The GitHub repository behind each project, with its live stars, language
 * and licence (lib/api/github-repos.ts, fetched at build time).
 * Layout from Sensei-Dev's ProjectsGrid / ProjectCard. Server Component.
 */

import { ExternalLink, Star } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { TiltCard } from "@/components/ui/Motion";
import { Github } from "@/components/ui/BrandIcons";
import { CounterBadge, KanjiWatermark } from "@/components/ui/kit";
import type { RepoCard } from "@/lib/api/github-repos";

export default function ProjectsGrid({ repos }: { repos: RepoCard[] }) {
  if (repos.length === 0) return null;
  const stars = repos.reduce((n, r) => n + r.stars, 0);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      <KanjiWatermark chars="開発" side="left" />
      {/* Speed lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="min-w-0 flex-1">
            <h2 id="projects-title" className="font-display title-fit [--title-n:7] font-black tracking-tighter uppercase leading-[0.85]">
              <span className="text-foreground">Open</span> <br />
              <span className="text-primary italic">Source.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              The code behind the projects above. Every repository is public — read it, run it, fork it.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <CounterBadge value={String(repos.length).padStart(2, "0")} top="Repos" bottom="Public" />
            {stars > 0 && <CounterBadge value={stars} top="Stars" bottom="Earned" tone="accent" />}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {repos.map((repo, idx) => (
            <FadeIn key={repo.name} y={40} duration={0.7} delay={(idx % 3) * 0.1} className="flex">
              <TiltCard className="spotlight group relative w-full min-h-[340px] flex flex-col bg-surface/60 border border-foreground/5 p-8 hover:border-primary/40 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500 pointer-events-none" aria-hidden="true" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500 pointer-events-none" aria-hidden="true" />
                <div className="absolute -bottom-3 right-2 font-display text-[7rem] font-black text-foreground/[0.04] leading-none select-none pointer-events-none group-hover:text-primary/[0.07] transition-colors duration-700" aria-hidden="true" data-deco={String(idx + 1).padStart(2, "0")} />

                <div className="flex justify-between items-start mb-5">
                  <div className="p-2 bg-foreground/5 border border-foreground/10" aria-hidden="true">
                    <Github className="text-tertiary" size={16} />
                  </div>
                  {repo.stars > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/25" aria-label={`${repo.stars} GitHub stars`}>
                      <Star size={11} className="text-accent" aria-hidden="true" />
                      <span className="font-mono text-[0.6875rem] font-bold text-accent">{repo.stars}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-display text-xl md:text-2xl font-black mb-3 tracking-tight uppercase leading-tight text-foreground group-hover:text-primary-ink transition-colors duration-300">
                  {repo.title}
                </h3>
                <p className="text-foreground/60 line-clamp-3 mb-5 text-sm font-light leading-relaxed">{repo.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {repo.language && (
                    <span className="px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.15em] font-mono text-tertiary bg-tertiary/10 border border-tertiary/25">
                      {repo.language}
                    </span>
                  )}
                  {repo.license && (
                    <span className="px-3 py-1 text-[0.6875rem] uppercase tracking-[0.15em] font-mono text-foreground/60 bg-foreground/[0.04] border border-foreground/10">
                      {repo.license}
                    </span>
                  )}
                  {repo.metrics.map((m) => (
                    <span key={m} className="px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-accent bg-accent/10 border border-accent/25">
                      {m}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-auto pt-5 border-t border-foreground/5">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sheen flex-1 min-h-11 py-3 px-4 bg-primary text-white font-mono font-black text-[0.6875rem] tracking-[0.2em] uppercase text-center flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300"
                    aria-label={`Source code of ${repo.title} on GitHub`}
                  >
                    <Github size={13} aria-hidden="true" /> Source
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-11 min-w-11 p-3 border border-foreground/10 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-foreground/60 flex items-center justify-center"
                      aria-label={`${repo.title} — live demo`}
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
