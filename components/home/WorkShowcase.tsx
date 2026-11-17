"use client";

/*
 * ═══ components/home/WorkShowcase.tsx — the PROJECTS section (#work) ═══
 *
 * Title "Built & Tested.", a row of filter buttons (All / Labs / Research /
 * Tools / Platforms) and one card per project: type, year, status, title,
 * tagline, problem, role, tech chips, metrics, the repository's live facts
 * (GitHub stars, language, licence — fetched at build time by
 * lib/api/github-repos.ts) and link buttons (Source / Live / Demo / Case study).
 * Under the cards, "More on GitHub": every other public repository, found
 * by itself at build time (getMoreRepos — a new repo shows up the next
 * morning). Hide one with HIDDEN_REPOS in data/portfolio-data.ts.
 *
 * HOW TO EDIT
 *   • Add / change a project → the `work` array in data/portfolio-data.ts
 *     (fields = the WorkItem type in data/types.ts). Only those curated
 *     projects are shown; app/page.tsx passes them in as `items`.
 *   • The heading text → the <SectionHeader> props below.
 *   • A new filter type → add it to WorkType in data/types.ts, then to
 *     FILTERS (button) and TYPE_ICON (icon) below.
 *   • A card only shows the link buttons that exist in that project's `links`.
 */

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import ShowMore from "@/components/ui/ShowMore";
import type { WorkItem, WorkType } from "@/data/types";
import {
  ExternalLink,
  FlaskConical,
  Microscope,
  Wrench,
  Server,
  Lock,
  PlayCircle,
  FileText,
  Star,
} from "lucide-react";
import type { MoreRepo, RepoFacts } from "@/lib/api/github-repos";
import Link from "next/link";
import { Github } from "@/components/ui/BrandIcons";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import FadeIn from "@/components/ui/FadeIn";
import { KanjiWatermark } from "@/components/ui/kit";
import { BrandGlyph } from "@/components/ui/OrgLogo";

/* The filter buttons, in order. id must be a WorkType (or "all"). */
const FILTERS: { id: WorkType | "all"; label: string; japanese: string }[] = [
  { id: "all", label: "All", japanese: "全部" },
  { id: "lab", label: "Labs", japanese: "実験" },
  { id: "research", label: "Research", japanese: "研究" },
  { id: "tool", label: "Tools", japanese: "道具" },
  { id: "platform", label: "Platforms", japanese: "基盤" },
];

/* The small icon shown on a card for each project type */
const TYPE_ICON = {
  lab: FlaskConical,
  research: Microscope,
  tool: Wrench,
  platform: Server,
} as const;

export default function WorkShowcase({
  items: workList,
  repos = {},
  more = [],
}: {
  items: WorkItem[];
  repos?: RepoFacts;
  more?: MoreRepo[];
}) {
  /* Which filter button is active, and the projects that match it */
  const [filter, setFilter] = useState<WorkType | "all">("all");
  const items = workList.filter((w) => filter === "all" || w.type === filter);

  return (
    <section
      id="work"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      {/* Old links to #projects (the Open Source section, now part of these cards) land here */}
      <span id="projects" className="absolute top-0" aria-hidden="true" />
      <KanjiWatermark chars="仕事" side="right" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Selected work // Projects & labs"
          japanese="仕事"
          titleA="Built &"
          titleB="Tested."
          description="Things I built myself: a platform that checks a company against security standards, practice networks made to be attacked, malware research done in a sealed lab, and small tools I wrote while investigating. Each card says what problem it solves; the code is public on GitHub."
        />

        <div
          className="flex flex-wrap gap-3 mb-12"
          role="group"
          aria-label="Filter work by type"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-11 inline-flex items-center px-5 py-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] border transition-all duration-300 ${
                filter === f.id
                  ? "bg-primary text-white border-primary"
                  : "bg-foreground/[0.03] text-foreground/70 border-foreground/10 hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f.label}{" "}
              <span
                className="ml-2 text-[0.5625rem]"
                lang="ja"
                aria-hidden="true"
                data-jp={f.japanese}
              />
            </button>
          ))}
        </div>

        {/* key={filter}: a new filter starts again from the first four */}
        <ShowMore key={filter} first={4} label="Show more projects" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((w, idx) => {
            const Icon = TYPE_ICON[w.type];
            const repo = repos[w.title];
            return (
              <FadeIn y={32} duration={0.7} delay={(idx % 2) * 0.1} key={w.id}>
                <TiltCard className="spotlight group relative bg-surface/60 border border-foreground/5 p-8 hover:border-primary/40 transition-colors duration-300 flex flex-col h-full">
                  <CardEffects index={idx + 1} />
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-foreground/5 border border-foreground/10">
                        <Icon size={18} className="text-tertiary" />
                      </div>
                      <div>
                        <div className="font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-tertiary">
                          {w.type} • {w.platform}
                        </div>
                        <div className="font-mono text-[0.5625rem] text-foreground/60 tracking-widest mt-1">
                          {w.year} • {w.status}
                        </div>
                      </div>
                    </div>
                    {w.status === "private-demo" && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/10">
                        <Lock size={11} /> Private
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl md:text-[1.375rem] lg:text-3xl font-black uppercase tracking-tight text-foreground mb-2">
                    {w.title}
                  </h3>
                  <p className="text-foreground/80 font-medium mb-3">
                    {w.tagline}
                  </p>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed mb-2">
                    <span className="text-foreground/60 font-mono text-[0.625rem] uppercase tracking-[0.2em]">
                      Problem{" "}
                    </span>
                    {w.problem}
                  </p>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed mb-5">
                    <span className="text-foreground/60 font-mono text-[0.625rem] uppercase tracking-[0.2em]">
                      Role{" "}
                    </span>
                    {w.role}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {w.stack.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-tertiary bg-tertiary/10 border border-tertiary/25"
                      >
                        {/* the tool's logo, when it has one (data/logos.ts) */}
                        <BrandGlyph name={s} />
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {repo?.language && (
                      <span className="px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-foreground/70 bg-foreground/[0.04] border border-foreground/10">
                        {repo.language}
                      </span>
                    )}
                    {repo?.license && (
                      <span className="px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-foreground/70 bg-foreground/[0.04] border border-foreground/10">
                        {repo.license}
                      </span>
                    )}
                    {w.metrics.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-accent bg-accent/10 border border-accent/25"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto pt-5 border-t border-foreground/5">
                    {w.links.github && (
                      <a
                        href={w.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sheen flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
                      >
                        <Github size={13} /> Source
                        {repo && repo.stars > 0 && (
                          <span className="inline-flex items-center gap-1 ml-1 pl-2 border-l border-white/30" aria-label={`${repo.stars} GitHub stars`}>
                            <Star size={11} aria-hidden="true" />
                            {repo.stars}
                          </span>
                        )}
                      </a>
                    )}
                    {w.links.live && (
                      <a
                        href={w.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/70 font-mono text-[0.625rem] uppercase tracking-[0.2em] hover:border-primary hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={13} /> Live
                      </a>
                    )}
                    {w.links.demo && (
                      <a
                        href={w.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/70 font-mono text-[0.625rem] uppercase tracking-[0.2em] hover:border-primary hover:text-foreground transition-colors"
                      >
                        <PlayCircle size={13} /> Demo
                      </a>
                    )}
                    {w.links.caseStudy && (
                      <Link
                        prefetch={false}
                        href={w.links.caseStudy}
                        className="group/cs flex items-center gap-2 px-4 py-2.5 border border-tertiary/30 text-tertiary font-mono text-[0.625rem] uppercase tracking-[0.2em] hover:border-tertiary hover:bg-tertiary/10 transition-colors"
                      >
                        <FileText
                          size={13}
                          className="transition-transform duration-300 group-hover/cs:-translate-y-[1.7px]"
                        />{" "}
                        Case study
                      </Link>
                    )}
                    {w.links.docs && (
                      <Link
                        prefetch={false}
                        href={w.links.docs}
                        className="flex items-center gap-2 px-4 py-2.5 border border-tertiary/30 text-tertiary font-mono text-[0.625rem] uppercase tracking-[0.2em] hover:border-tertiary hover:bg-tertiary/10 transition-colors duration-300"
                      >
                        <FileText size={13} /> How to use it
                      </Link>
                    )}
                    {!w.links.github &&
                      !w.links.live &&
                      !w.links.demo &&
                      !w.links.caseStudy && (
                        <span className="font-mono text-[0.625rem] text-foreground/60 tracking-[0.2em] uppercase">
                          Demo on request NDA client work
                        </span>
                      )}
                  </div>
                </TiltCard>
              </FadeIn>
            );
          })}
        </ShowMore>

        {items.length === 0 && (
          <p className="mt-8 font-mono text-sm text-foreground/60">
            No items in this filter yet.
          </p>
        )}

        {/* Every other public repository, picked up from GitHub at build time */}
        {more.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
              <h3 className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">
                More on GitHub
              </h3>
              <span className="font-mono text-[0.625rem] tracking-[0.2em] uppercase text-foreground/60 tabular-nums">
                {String(more.length).padStart(2, "0")} repositories
              </span>
            </div>
            <ShowMore first={6} label="Show more repositories" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {more.map((r, idx) => (
                <FadeIn key={r.name} y={16} duration={0.55} delay={(idx % 3) * 0.06} className="flex">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group spotlight w-full flex flex-col gap-3 p-5 bg-surface/60 border border-foreground/5 hover:border-primary/40 transition-colors duration-300"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 min-w-0 font-mono text-sm font-bold text-foreground group-hover:text-primary-ink transition-colors duration-300">
                        <Github size={14} className="shrink-0 text-tertiary" aria-hidden="true" />
                        <span className="truncate">{r.name}</span>
                      </span>
                      <ExternalLink size={13} className="shrink-0 text-foreground/40 group-hover:text-primary-ink transition-colors duration-300" aria-hidden="true" />
                    </span>
                    {r.description && (
                      <span className="text-sm text-foreground/60 font-light leading-relaxed line-clamp-2">{r.description}</span>
                    )}
                    {(r.language || r.stars > 0) && (
                      <span className="mt-auto flex items-center gap-3 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-foreground/60">
                        {r.language && <span>{r.language}</span>}
                        {r.stars > 0 && (
                          <span className="inline-flex items-center gap-1" aria-label={`${r.stars} GitHub stars`}>
                            <Star size={10} aria-hidden="true" /> {r.stars}
                          </span>
                        )}
                      </span>
                    )}
                  </a>
                </FadeIn>
              ))}
            </ShowMore>
          </div>
        )}
      </div>
    </section>
  );
}
