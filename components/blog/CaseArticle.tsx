"use client";

/*
 * CaseArticle — one case page, readable by anyone. The plain-language
 * summary comes first; then five chapters, each opening with one sentence on
 * what it answers, and only then the technical detail:
 *
 *   1 The goal · 2 What happened? · 3 What I did · 4 How to prevent it ·
 *   5 Evidence & supporting files
 *
 * Everything from the report (facts, chain, timeline, IOCs, response,
 * detections, screenshots, ATT&CK, the PDF) is still here — only reordered.
 */

import Image from "next/image";
import Link from "next/link";
import PageLink from "@/components/ui/PageLink";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  Copy,
  Download,
  ExternalLink,
  Images,
  Clock,
  Calendar,
  AlertTriangle,
  Maximize2,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import { normalizePublicHref, getThumbnail, formatDate } from "@/lib/shared";
import { useCopyLink } from "@/lib/use-copy-link";
import CaseSummary from "@/components/blog/CaseSummary";
import {
  CaseAttachments,
  CaseChain,
  CaseDetection,
  CaseFacts,
  CaseIocs,
  CaseLessons,
  CaseReport,
  CaseResponse,
  CaseTimeline,
  TeamBanner,
  VerdictBar,
} from "@/components/blog/CaseFile";
import type { CaseDetail } from "@/data/case-details";
import type { CaseGuide } from "@/lib/case-guide";
import {
  btnOutline,
  chipAccent,
  chipTertiary,
  ctaPrimary,
  ctaSecondary,
  KanjiWatermark,
} from "@/components/ui/kit";
import FadeIn from "@/components/ui/FadeIn";
import Logo from "@/components/ui/Logo";

const Lightbox = dynamic(() => import("@/components/ui/Lightbox"), {
  ssr: false,
});

type CaseItem = {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
  category: string;
  difficulty: string;
  href?: string;
  tags: readonly string[];
  tools: readonly string[];
  skillsGained: readonly string[];
  readTime: number;
  date: string;
};

type Sibling = { id: string; title: string } | null;
/* Passed in from the server page — importing attack.ts or cases.ts here
   would bundle them into the browser. */
type Technique = { id: string; name: string; tactic: string };
type Collection = { href: string; title: string };
type Related = {
  id: string;
  title: string;
  category: string;
  readTime: number;
  sharedTechniques: number;
};
type RelatedVideo = {
  videoId: string;
  title: string;
  description?: string;
  sourceUrl: string;
};

/* The five chapters, in order — the "On this page" bar and the headings */
const CHAPTERS = [
  { id: "goal", title: "The goal", intro: "What this case set out to answer or achieve." },
  { id: "what-happened", title: "What happened?", intro: "The attack or weakness itself — what the attacker did, or what was wrong, step by step." },
  { id: "what-i-did", title: "What I did", intro: "My investigation or work, in the order I did it, and the tools I used." },
  { id: "prevention", title: "How to prevent it", intro: "How to stop this from happening again: the actions from the report, the detection rules, and general advice for this kind of problem." },
  { id: "evidence", title: "Evidence & supporting files", intro: "The proof: screenshots, the clues the attacker left, the attack techniques by their official names, and the full technical report." },
] as const;

type ChapterId = (typeof CHAPTERS)[number]["id"];

function Chapter({ id, children }: { id: ChapterId; children: ReactNode }) {
  const n = CHAPTERS.findIndex((c) => c.id === id);
  const chapter = CHAPTERS[n];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative mb-20 pt-10 border-t border-foreground/10 scroll-mt-28">
      <FadeIn x={-24} y={0} duration={0.6} className="mb-10">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm font-black text-primary-ink tabular-nums" aria-hidden="true">
            {String(n + 1).padStart(2, "0")}
          </span>
          <h2 id={`${id}-title`} className="font-display text-2xl md:text-4xl font-black uppercase tracking-tight leading-none text-foreground">
            {chapter.title}
          </h2>
        </div>
        <p className="mt-3 pl-9 max-w-3xl text-sm md:text-base text-foreground/60 font-light leading-relaxed">{chapter.intro}</p>
      </FadeIn>
      <div className="grid gap-12">{children}</div>
    </section>
  );
}

function BlockTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-[2px] bg-primary" aria-hidden="true" />
      <h3 id={id} className="font-mono text-[0.625rem] text-primary-ink tracking-[0.35em] uppercase font-bold">
        {children}
      </h3>
    </div>
  );
}

function Shot({
  shot,
  index,
  total,
  title,
  onOpen,
}: {
  shot: string;
  index: number;
  total: number;
  title: string;
  onOpen: (i: number) => void;
}) {
  const [thumbFailed, setThumbFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      /* Starts with the visible caption ("Evidence 03") so voice control
         ("click evidence 03") and the name agree */
      aria-label={`Evidence ${String(index + 1).padStart(2, "0")} — open screenshot ${index + 1} of ${total}`}
      className="spotlight group relative aspect-[16/10] overflow-hidden bg-surface border border-foreground/5 hover:border-primary/40 transition-all duration-700"
    >
      <Image
        src={normalizePublicHref(thumbFailed ? shot : getThumbnail(shot))}
        alt={`${title} — screenshot ${index + 1}`}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onError={() => setThumbFailed(true)}
        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
      />
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-500 z-20 pointer-events-none" />
      <div className="hover-reveal absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-3 z-10">
        <span className="font-mono text-[0.5625rem] font-bold tracking-[0.3em] uppercase text-white">
          Evidence {String(index + 1).padStart(2, "0")}
        </span>
        <Maximize2 size={12} className="text-white/70" />
      </div>
    </button>
  );
}

export default function CaseArticle({
  item,
  screenshots,
  previous,
  next,
  techniques = [],
  related = [],
  relatedVideos = [],
  detail,
  kindLabel,
  collection,
  guide,
}: {
  item: CaseItem;
  screenshots: string[];
  previous: Sibling;
  next: Sibling;
  techniques?: readonly Technique[];
  related?: readonly Related[];
  relatedVideos?: readonly RelatedVideo[];
  detail?: CaseDetail;
  kindLabel?: string;
  collection?: Collection;
  guide: CaseGuide;
}) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { state: copyState, copy } = useCopyLink();

  const copyLink = useCallback(() => {
    void copy(`${window.location.origin}${window.location.pathname}`);
  }, [copy]);

  const slides = useMemo(
    () =>
      screenshots.map((shot, i) => ({
        src: normalizePublicHref(shot),
        title: item.title,
        description: `Evidence ${i + 1} of ${screenshots.length}`,
      })),
    [screenshots, item.title],
  );

  const hasIncident = Boolean(detail?.verdict || detail?.chain?.length || detail?.timeline?.length);
  const hasReportPrevention = Boolean(detail?.response?.length || detail?.detection?.length || detail?.lessons);
  const jumpToEvidence = () => document.getElementById("evidence")?.scrollIntoView({ block: "start" });

  return (
    <article id="case-body" className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
      <KanjiWatermark chars="報告書" side="right" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-10 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.3em]" aria-label="Breadcrumb">
          <PageLink href="/blog#cases" className="group flex items-center gap-2 text-primary-ink hover:text-foreground transition-colors">
            <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" /> All case studies
          </PageLink>
          <span className="text-foreground/20" aria-hidden="true">/</span>
          <span className="text-foreground/60">{item.category}</span>
          {collection && (
            <>
              <span className="text-foreground/20" aria-hidden="true">/</span>
              <Link href={collection.href} className="text-tertiary hover:text-foreground transition-colors">
                {collection.title}
              </Link>
            </>
          )}
        </nav>

        {/* Header */}
        <FadeIn as="header" x={-32} y={0} duration={0.7} className="mb-10">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            <span className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">{item.type}</span>
            {kindLabel && (
              <span className="px-2 py-0.5 border border-foreground/15 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                {kindLabel}
              </span>
            )}
          </div>
          <h1
            style={{ "--title-n": Math.max(...item.title.split(/\s+/).map((w) => w.length)) } as React.CSSProperties}
            className="case-title-fit font-display font-black tracking-tighter [word-spacing:0.12em] uppercase leading-[0.95] text-foreground [text-wrap:balance]">
            {item.title}
          </h1>
          <p className="mt-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-tertiary">
            <Logo name={item.platform} size={28} />
            {item.platform}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-on-surface-variant">
            <span className="flex items-center gap-2 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/10" title="How hard the case is">
              <AlertTriangle size={11} /> {item.difficulty}
            </span>
            <span className="flex items-center gap-2 font-mono text-xs">
              <Clock size={14} className="text-accent" />{" "}
              {detail?.pages ? `${detail.pages}-page report · ~${item.readTime} min` : `${item.readTime} min read`}
            </span>
            <span className="flex items-center gap-2 font-mono text-xs">
              <Calendar size={14} className="text-on-surface-variant/60" /> {formatDate(item.date)}
            </span>
          </div>
        </FadeIn>

        {/* ── In plain words: the whole case for a non-technical reader ── */}
        <FadeIn y={24} duration={0.7} delay={0.1} className="spotlight relative bg-surface/60 border border-foreground/5 backdrop-blur-sm hover:border-primary/20 transition-all duration-700 overflow-hidden mb-10">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />
          <div className="relative z-10 px-6 md:px-12 pt-6 md:pt-8 pb-4 border-b border-foreground/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpenText size={14} className="text-accent" aria-hidden="true" />
              <h2 className="font-mono text-[0.5625rem] font-bold text-foreground/70 tracking-[0.3em] uppercase">In plain words</h2>
            </div>
            <span className="font-mono text-[0.5625rem] text-foreground/60 tracking-wider uppercase">{guide.kindShort}</span>
          </div>
          <div className="relative z-10 px-6 md:px-12 py-7 md:py-9 grid gap-4 text-base md:text-lg text-foreground/85 font-light leading-relaxed">
            <p>{guide.kindLong}</p>
            {guide.topic && <p>{guide.topic}</p>}
            {guide.verdict && (
              <p className="flex items-start gap-3 border border-accent/25 bg-accent/[0.06] px-4 py-3 text-base">
                <ShieldCheck size={18} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-foreground">The answer: </strong>
                  {guide.verdict}
                  {guide.severity && <> Severity — {guide.severity}</>}
                </span>
              </p>
            )}
            {guide.glossary.length > 0 && (
              <details className="group/terms border border-foreground/10 bg-foreground/[0.02] text-sm">
                <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-foreground/70 hover:text-foreground [&::-webkit-details-marker]:hidden">
                  <span className="text-primary-ink mr-2 inline-block transition-transform group-open/terms:rotate-90" aria-hidden="true">›</span>
                  New to security? {guide.glossary.length} words on this page, explained
                </summary>
                <dl className="grid gap-x-8 gap-y-3 px-4 pb-4 pt-1 sm:grid-cols-2">
                  {guide.glossary.map((g) => (
                    <div key={g.term}>
                      <dt className="font-mono text-[0.6875rem] font-bold text-accent">{g.term}</dt>
                      <dd className="mt-0.5 text-foreground/70 leading-relaxed">{g.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </div>
          <div className="relative z-10 px-6 md:px-12 pt-6 pb-8 flex flex-wrap gap-4 border-t border-foreground/5">
            {item.href && (
              <>
                <a href={normalizePublicHref(item.href)} target="_blank" rel="noopener noreferrer" className={ctaPrimary}>
                  <ExternalLink size={16} /> View technical PDF
                </a>
                <a href={normalizePublicHref(item.href)} download className={ctaSecondary}>
                  <Download size={14} className="text-primary-ink" /> Download PDF
                </a>
              </>
            )}
            {screenshots.length > 0 && (
              <button type="button" onClick={jumpToEvidence} className={ctaSecondary}>
                <Images size={14} className="text-primary-ink" /> See the evidence
                <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">{screenshots.length}</span>
              </button>
            )}
            <button type="button" onClick={copyLink} className={`${ctaSecondary} min-w-[12rem] justify-center`}>
              {copyState === "done" ? <Check size={14} className="text-accent" /> : <Copy size={14} className="text-primary-ink" />}
              <span aria-live="polite">{copyState === "done" ? "Link copied" : copyState === "error" ? "Copy failed" : "Copy link"}</span>
            </button>
          </div>
        </FadeIn>

        {/* ── On this page ── */}
        <FadeIn as="nav" y={12} duration={0.55} delay={0.2} aria-label="On this page" className="mb-16 flex flex-wrap items-center gap-2">
          <span className="mr-2 font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-foreground/60">On this page</span>
          {CHAPTERS.map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex items-center gap-2 border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-300 hover:border-primary hover:text-foreground"
            >
              <span className="text-primary-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span> {c.title}
            </a>
          ))}
        </FadeIn>

        {/* ── 01 The goal ── */}
        <Chapter id="goal">
          <CaseSummary description={item.description} part="objective" />
          {detail?.team && <TeamBanner team={detail.team} />}
          {detail?.facts?.length ? <CaseFacts facts={detail.facts} /> : null}
        </Chapter>

        {/* ── 02 What happened? ── */}
        <Chapter id="what-happened">
          {hasIncident ? (
            <>
              <VerdictBar verdict={detail?.verdict} severity={detail?.severity} verdictPlain={guide.verdict} severityPlain={guide.severity} />
              {detail?.chain?.length || detail?.timeline?.length ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {detail?.chain?.length ? <CaseChain chain={detail.chain} /> : null}
                  {detail?.timeline?.length ? <CaseTimeline timeline={detail.timeline} /> : null}
                </div>
              ) : null}
            </>
          ) : (
            <FadeIn as="p" y={16} duration={0.6} className="max-w-3xl text-base md:text-lg text-foreground/80 font-light leading-relaxed border-l-2 border-accent pl-5">
              {guide.kind === "lab" || guide.kind === "note"
                ? "There was no real victim here — this was a safe practice environment. What “happened” is the weakness itself, and the steps below show exactly how it was found and used."
                : "The full story is in the steps below and in the technical report under “Evidence & supporting files”."}
              {guide.topic && <span className="block mt-3 text-foreground/60 text-base">{guide.topic}</span>}
            </FadeIn>
          )}
        </Chapter>

        {/* ── 03 What I did ── */}
        <Chapter id="what-i-did">
          <CaseSummary description={item.description} part="actions" />
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10" aria-label="Tools and skills">
            <FadeIn y={16} duration={0.6}>
              <BlockTitle>Tools I used</BlockTitle>
              <div className="flex flex-wrap gap-2">
                {item.tools.map((tool) => (
                  <span key={tool} className={`${chipTertiary} inline-flex items-center gap-1.5`}>
                    <Logo name={tool} variant="inline" size={11} />
                    {tool}
                  </span>
                ))}
              </div>
            </FadeIn>
            <FadeIn y={16} duration={0.6} delay={0.08}>
              <BlockTitle>Skills it shows</BlockTitle>
              <div className="flex flex-wrap gap-2">
                {item.skillsGained.map((skill) => (
                  <span key={skill} className={chipAccent}>
                    {skill}
                  </span>
                ))}
              </div>
            </FadeIn>
          </section>
        </Chapter>

        {/* ── 04 How to prevent it ── */}
        <Chapter id="prevention">
          {detail?.response?.length ? <CaseResponse response={detail.response} /> : null}
          {detail?.detection?.length ? <CaseDetection items={detail.detection} /> : null}
          {detail?.lessons ? <CaseLessons lessons={detail.lessons} /> : null}
          {guide.prevention.length > 0 && (
            <div>
              <BlockTitle>{hasReportPrevention ? "More ways to prevent this kind of problem" : "How this kind of problem is prevented"}</BlockTitle>
              <ul className="grid gap-3">
                {guide.prevention.map((tip, i) => (
                  <FadeIn as="li" y={12} duration={0.5} delay={Math.min(i, 6) * 0.05} key={tip} className="flex gap-3 border border-foreground/5 bg-surface/40 px-4 py-3">
                    <ShieldCheck size={14} className="text-tertiary shrink-0 mt-1" aria-hidden="true" />
                    <span className="text-sm md:text-[0.95rem] text-foreground/80 leading-relaxed">{tip}</span>
                  </FadeIn>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                General best practice for this kind of issue — the report&apos;s own recommendations are above
              </p>
            </div>
          )}
          {!hasReportPrevention && guide.prevention.length === 0 && (
            <p className="max-w-3xl text-base text-foreground/70 font-light leading-relaxed">
              The recommendations for this case are in the technical report under “Evidence &amp; supporting files”.
            </p>
          )}
        </Chapter>

        {/* ── 05 Evidence & supporting files ── */}
        <Chapter id="evidence">
          {screenshots.length > 0 && (
            <section aria-labelledby="case-evidence-title">
              <BlockTitle id="case-evidence-title">
                Screenshots — {screenshots.length}
              </BlockTitle>
              <p className="-mt-2 mb-5 text-sm text-foreground/60 font-light">Click any screenshot to see it full size and step through the rest.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {screenshots.map((shot, i) => (
                  <Shot key={shot} shot={shot} index={i} total={screenshots.length} title={item.title} onOpen={setGalleryIndex} />
                ))}
              </div>
            </section>
          )}

          {detail?.iocs?.length ? <CaseIocs iocs={detail.iocs} /> : <CaseSummary description={item.description} part="artifacts" />}

          {techniques.length > 0 && (
            <section aria-labelledby="case-attack-title">
              <BlockTitle id="case-attack-title">
                Attack techniques (MITRE ATT&amp;CK) — {techniques.length}
              </BlockTitle>
              <p className="-mt-2 mb-5 max-w-3xl text-sm text-foreground/60 font-light leading-relaxed">
                Each technique in this case by its official name in MITRE ATT&amp;CK, the public catalogue defenders use. Click one to read about it.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {techniques.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`https://attack.mitre.org/techniques/${t.id.replace(".", "/")}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group spotlight relative flex h-full items-baseline gap-4 bg-surface/60 border border-foreground/5 px-5 py-4 hover:border-primary/40 transition-colors duration-500"
                    >
                      <span className="font-mono text-xs font-black text-accent tabular-nums shrink-0">{t.id}</span>
                      <span className="flex-1 text-sm text-foreground/80 group-hover:text-foreground transition-colors">{t.name}</span>
                      <span className="hidden sm:block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 shrink-0">
                        {t.tactic.replace(/-/g, " ")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {detail?.attachments?.length ? <CaseAttachments attachments={detail.attachments} /> : null}
          {item.href && <CaseReport href={item.href} title={item.title} pages={detail?.pages} />}

          {relatedVideos.length > 0 && (
            <section aria-labelledby="case-videos-title">
              <BlockTitle id="case-videos-title">
                Video walkthrough
              </BlockTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedVideos.map((video) => (
                  <a
                    key={video.videoId}
                    href={video.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group spotlight flex gap-4 bg-surface/60 border border-foreground/5 p-5 hover:border-primary/40 transition-colors"
                  >
                    <PlayCircle size={18} className="mt-0.5 shrink-0 text-primary-ink" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-display text-base font-black uppercase tracking-tight text-foreground group-hover:text-primary-ink transition-colors">
                        {video.title}
                      </span>
                      {video.description && (
                        <span className="mt-2 block text-sm text-foreground/60 leading-relaxed line-clamp-3">{video.description}</span>
                      )}
                      <span className="mt-3 block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-tertiary">Watch on YouTube</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </Chapter>

        {/* Tags */}
        <section className="mb-16" aria-labelledby="case-tags-title">
          <BlockTitle id="case-tags-title">
            Topics — find similar cases
          </BlockTitle>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?q=${encodeURIComponent(tag)}#cases`}
                className="px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-foreground/60 bg-foreground/[0.04] border border-foreground/10 hover:border-primary hover:text-primary-ink transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mb-16" aria-labelledby="case-related-title">
            <BlockTitle id="case-related-title">
              Read next
            </BlockTitle>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/blog/${entry.id}`}
                    className="@container group spotlight spotlight-blue relative flex h-full flex-col bg-surface/60 border border-foreground/5 p-6 hover:border-tertiary/50 transition-colors duration-500"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-tertiary/0 group-hover:bg-tertiary transition-colors duration-500" aria-hidden="true" />
                    <span className="font-display text-[min(1.125rem,6.4cqi)] font-black uppercase tracking-tight text-foreground group-hover:text-tertiary transition-colors duration-300 mb-4">
                      {entry.title}
                    </span>
                    <span className="mt-auto font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                      {entry.category} • {entry.readTime} min
                      {entry.sharedTechniques > 0 && ` • ${entry.sharedTechniques} shared technique(s)`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Previous / next */}
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-foreground/10" aria-label="Other cases">
          {previous ? (
            <Link
              href={`/blog/${previous.id}`}
              className="@container group spotlight relative flex flex-col gap-3 bg-surface/60 border border-foreground/5 p-6 hover:border-primary/40 transition-colors duration-500"
            >
              <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-primary-ink">
                <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" /> Previous case
              </span>
              <span className="font-display text-[min(1rem,5.7cqi)] font-black uppercase tracking-tight text-foreground/80 group-hover:text-foreground">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/blog/${next.id}`}
              className="@container group spotlight relative flex flex-col items-end gap-3 text-right bg-surface/60 border border-foreground/5 p-6 hover:border-primary/40 transition-colors duration-500"
            >
              <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-primary-ink">
                Next case <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="font-display text-[min(1rem,5.7cqi)] font-black uppercase tracking-tight text-foreground/80 group-hover:text-foreground">{next.title}</span>
            </Link>
          )}
        </nav>

        <div className="mt-10 flex justify-center">
          <PageLink href="/blog#cases" className={btnOutline}>
            <ArrowLeft size={13} /> Back to all case studies
          </PageLink>
        </div>
      </div>

      {galleryIndex !== null && <Lightbox close={() => setGalleryIndex(null)} index={galleryIndex} slides={slides} />}
    </article>
  );
}
