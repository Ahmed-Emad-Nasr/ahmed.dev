"use client";

/*
 * CaseArticle — one case page: header panel, briefing, case file,
 * screenshots (with lightbox), related cases and prev/next.
 *
 * ═══ components/blog/CaseArticle.tsx — what a /blog/<case-id> page LOOKS like ═══
 *
 * app/blog/[slug]/page.tsx gathers the data and passes it in as props; this
 * file only draws it. Order on the page (each part has a JSX comment with its name):
 *   Breadcrumb → Header (title, date, read time, chips) → Summary panel
 *   (verdict, briefing via CaseSummary, ATT&CK techniques, tools, PDF / copy
 *   link buttons) → Details (CaseFile: facts, chain, timeline, IOCs,
 *   detection, report; screenshots grid + lightbox; related videos; related
 *   cases) → Previous / next.
 *
 * Content lives in data files, not here:
 *   title / description / tags / tools / PDF  → data/cases.ts
 *   facts / chain / timeline / IOCs …         → data/case-details.ts
 *   ATT&CK techniques                         → data/attack.ts
 *
 * To pass something NEW into the page: add it to the props type below AND
 * to the <CaseArticle …> call in app/blog/[slug]/page.tsx.
 */

import Image from "next/image";
import PageLink from "@/components/ui/PageLink";
import { Suspense, useCallback, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
} from "lucide-react";
import { normalizePublicHref, getThumbnail, formatDate, type CaseKind } from "@/lib/shared";
import { useCopyLink } from "@/lib/use-copy-link";
import type { CaseNumber } from "@/lib/case-numbers";
import CaseNumbers from "@/components/blog/CaseNumbers";
import CaseSummary from "@/components/blog/CaseSummary";
import { parseCaseSummary } from "@/lib/case-summary";
import CaseFile, { VerdictBar, caseFileHas } from "@/components/blog/CaseFile";
import type { CaseDetail } from "@/data/case-details";
import {
  btnOutline,
  chipAccent,
  chipTertiary,
  ctaPrimary,
  ctaSecondary,
  Chapter,
  KanjiWatermark,
} from "@/components/ui/kit";
import { preloadable } from "@/lib/perf/lazy";
import FadeIn from "@/components/ui/FadeIn";

/* preloadable = fetched in idle time and then rendered without a suspended
   frame: React holds back a suspended→ready swap for ~300ms, which is what
   made the first open feel late. */
const Lightbox = preloadable(() => import("@/components/ui/Lightbox"));

/* The fields of a data/cases.ts entry this page uses */
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

/* A block inside a chapter (h3), or a closing section of the page (h2).
   hint = one plain sentence under the title. */
/* What each kind of case is, for a reader who has never worked in security.
   Shown first in "The goal", above the case's own (technical) objective. */
const PLAIN_GOAL: Record<CaseKind, string> = {
  investigation:
    "A security alert or a suspicious file landed on my desk. The job: work out whether it was a real attack, how far it got, and what has to be fixed.",
  project:
    "Something had to be built, not only studied — a working setup, a set of alarms or a plan that a security team could put to use the next day.",
  lab:
    "A hands-on practice exercise on a training platform: attack a deliberately vulnerable system the way a real attacker would, to learn exactly how to defend against it.",
  note:
    "Study notes from a guided course — the ideas a security analyst needs to understand before handling a real incident.",
};

function BlockTitle({
  children,
  japanese,
  id,
  hint,
  as: Heading = "h3",
}: {
  children: ReactNode;
  japanese: string;
  id?: string;
  hint?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-6 h-[2px] bg-primary" aria-hidden="true" />
        <Heading
          id={id}
          className="font-mono text-[0.625rem] text-primary-ink tracking-[0.35em] uppercase font-bold"
        >
          {children}
        </Heading>
        <span
          className="brush-jp text-base text-foreground/30"
          lang="ja"
          aria-hidden="true"
          data-jp={japanese}
        />
      </div>
      {hint && (
        <p className="mt-2 max-w-2xl text-sm text-foreground/60 font-light leading-relaxed">
          {hint}
        </p>
      )}
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
      className="spotlight group relative aspect-[16/10] overflow-hidden bg-surface border border-foreground/5 hover:border-primary/40 transition-all duration-420"
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
        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.0425] transition-all duration-600"
      />
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300 z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300 z-20 pointer-events-none" />
      <div className="hover-reveal absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 z-10">
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
  numbers = [],
  related = [],
  relatedVideos = [],
  detail,
  kindLabel,
  kind,
  collection,
}: {
  item: CaseItem;
  screenshots: string[];
  previous: Sibling;
  next: Sibling;
  techniques?: readonly Technique[];
  /** The "By the numbers" strip, computed on the server (lib/case-numbers.ts) */
  numbers?: readonly CaseNumber[];
  related?: readonly Related[];
  relatedVideos?: readonly RelatedVideo[];
  detail?: CaseDetail;
  kindLabel?: string;
  /** investigation / project / lab / note → the plain sentence in "The goal" */
  kind?: CaseKind;
  collection?: Collection;
}) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const { state: copyState, copy } = useCopyLink();

  const copyLink = useCallback(() => {
    void copy(`${window.location.origin}${window.location.pathname}`);
  }, [copy]);

  /* Screenshots → lightbox slides */
  const slides = useMemo(
    () =>
      screenshots.map((shot, i) => ({
        src: normalizePublicHref(shot),
        title: item.title,
        description: `Evidence ${i + 1} of ${screenshots.length}`,
      })),
    [screenshots, item.title],
  );

  /* The description is parsed once and shared by the three places that draw it */
  const summary = useMemo(() => parseCaseSummary(item.description), [item.description]);

  /* Which chapters this case has, numbered in the order they appear */
  const has = caseFileHas(detail, item.href);
  let chapterNo = 0;
  const chapter = () => ++chapterNo;

  return (
    <article
      id="case-body"
      className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden"
    >
      <KanjiWatermark chars="報告書" side="right" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav
          className="mb-10 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.3em]"
          aria-label="Breadcrumb"
        >
          <PageLink
            href="/#cases"
            className="group flex items-center gap-2 text-primary-ink hover:text-foreground transition-colors"
          >
            <ArrowLeft
              size={12}
              className="transition-transform duration-180 group-hover:-translate-x-[3.4px]"
            />{" "}
            All cases
          </PageLink>
          <span className="text-foreground/20" aria-hidden="true">
            /
          </span>
          <span className="text-foreground/60">{item.category}</span>
          {collection && (
            <>
              <span className="text-foreground/20" aria-hidden="true">
                /
              </span>
              <PageLink
                href={collection.href}
                className="text-tertiary hover:text-foreground transition-colors"
              >
                {collection.title}
              </PageLink>
            </>
          )}
        </nav>

        {/* Header */}
        <FadeIn as="header" x={-32} y={0} duration={0.7} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            <span className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">
              {item.type}
            </span>
            {kindLabel && (
              <span className="px-2 py-0.5 border border-foreground/15 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                {kindLabel}
              </span>
            )}
            <span
              className="jp-eyebrow text-[0.6875rem] text-foreground/30"
              lang="ja"
              aria-hidden="true"
              data-jp="事件"
            />
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter [word-spacing:0.12em] uppercase leading-[0.95] text-foreground [text-wrap:balance]">
            {item.title}
          </h1>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.25em] text-tertiary">
            {item.platform}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-on-surface-variant">
            <span className="flex items-center gap-2 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/10">
              <AlertTriangle size={11} /> {item.difficulty}
            </span>
            <span className="flex items-center gap-2 font-mono text-xs">
              <Clock size={14} className="text-accent" />{" "}
              {detail?.pages
                ? `${detail.pages}-page report · ~${item.readTime} min`
                : `${item.readTime} min read`}
            </span>
            <span className="flex items-center gap-2 font-mono text-xs">
              <Calendar size={14} className="text-on-surface-variant/60" />{" "}
              {formatDate(item.date)}
            </span>
          </div>
        </FadeIn>

        <VerdictBar verdict={detail?.verdict} severity={detail?.severity} />

        {/* The case in figures, counted from its own data (lib/case-numbers.ts) */}
        <CaseNumbers numbers={numbers} prevented={detail?.outcome?.prevented} />

        {/* ═══ The case in plain-language chapters ═══
            Goal → What happened → What I did → How to stop it happening
            again → Evidence. Every technical block is still here; a chapter
            only appears when the case has something to put in it. */}

        {/* ── The goal ── */}
        <section className="mb-16 md:mb-20" aria-labelledby="case-goal-title">
          <Chapter n={chapter()} title="The goal" japanese="目的" id="case-goal-title">
            Why this work was done, in one sentence — no technical background
            needed.
          </Chapter>
          {/* No tilt: on a panel this tall the 3D lean read as the page wobbling */}
          <div className="spotlight relative bg-surface/60 border border-foreground/5 backdrop-blur-sm hover:border-primary/20 transition-all duration-420 overflow-hidden">
            <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />
            <div
              className="absolute top-6 right-6 font-mono text-7xl md:text-8xl font-black text-foreground/[0.04] leading-none select-none"
              aria-hidden="true"
              data-deco={
                screenshots.length
                  ? String(screenshots.length).padStart(2, "0")
                  : "00"
              }
            />
            <div className="relative z-10 px-6 md:px-12 pt-6 md:pt-8 pb-4 border-b border-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent" />
                <span className="font-mono text-[0.5625rem] font-normal text-foreground/60 tracking-[0.3em] uppercase">
                  Case summary
                </span>
                <span className="hidden sm:inline font-mono text-[0.5625rem] text-foreground/65 tracking-wider">
                  ~/cases/{item.id}/brief.md
                </span>
              </div>
              <span className="font-mono text-[0.5625rem] text-foreground/60 tracking-wider uppercase">
                {item.category}
              </span>
            </div>
            <div className="relative z-10 px-6 md:px-12 py-7 md:py-10 grid gap-7">
              {kind && (
                <div>
                  <p className="mb-2 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.3em] text-accent">
                    In plain words
                  </p>
                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-light">
                    {PLAIN_GOAL[kind]}
                  </p>
                </div>
              )}
              <div>
                <p className="mb-3 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.3em] text-foreground/60">
                  The task itself
                </p>
                <CaseSummary summary={summary} part="goal" />
              </div>
            </div>
            <div className="relative z-10 px-6 md:px-12 pt-6 pb-8 flex flex-wrap gap-4 border-t border-foreground/5">
              {item.href && (
                <>
                  <a
                    href={normalizePublicHref(item.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ctaPrimary}
                  >
                    <ExternalLink size={16} /> View technical PDF
                  </a>
                  <a
                    href={normalizePublicHref(item.href)}
                    download
                    className={ctaSecondary}
                  >
                    <Download size={14} className="text-primary-ink" /> Download PDF
                  </a>
                </>
              )}
              {screenshots.length > 0 && (
                <button
                  type="button"
                  onClick={() => setGalleryIndex(0)}
                  className={ctaSecondary}
                >
                  <Images size={14} className="text-primary-ink" /> See the screenshots
                  <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">
                    {screenshots.length}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={copyLink}
                className={`${ctaSecondary} min-w-[12rem] justify-center`}
              >
                {copyState === "done" ? (
                  <Check size={14} className="text-accent" />
                ) : (
                  <Copy size={14} className="text-primary-ink" />
                )}
                <span aria-live="polite">
                  {copyState === "done"
                    ? "Copied"
                    : copyState === "error"
                      ? "Copy failed"
                      : "Copy link"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── What happened? ── */}
        {has.happened && (
          <section className="mb-16 md:mb-20" aria-labelledby="case-happened-title">
            {/* In a practice lab the "attacker" is me, so the chapter is
                about how the attack works rather than an incident */}
            <Chapter
              n={chapter()}
              title={kind === "lab" || kind === "note" ? "How the attack works" : "What happened?"}
              japanese="経緯"
              id="case-happened-title"
            >
              {kind === "lab" || kind === "note"
                ? "The weakness in the system, and the steps that take advantage of it."
                : "The incident itself: who was involved, what the attacker did and in what order."}
            </Chapter>
            <CaseFile detail={detail} title={item.title} part="happened" />
          </section>
        )}

        {/* ── What I did ── */}
        <section className="mb-16 md:mb-20" aria-labelledby="case-did-title">
          <Chapter n={chapter()} title="What I did" japanese="対応" id="case-did-title">
            My own work on this case, step by step, and the tools I used for
            it.
          </Chapter>
          <div className="space-y-12">
            <CaseSummary summary={summary} part="work" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <BlockTitle japanese="道具" hint="The software used in this case.">Tools I used</BlockTitle>
                <div className="flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span key={tool} className={chipTertiary}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <BlockTitle japanese="技能" hint="What this work shows I can do.">Skills it shows</BlockTitle>
                <div className="flex flex-wrap gap-2">
                  {item.skillsGained.map((skill) => (
                    <span key={skill} className={chipAccent}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How to stop it happening again ── */}
        {has.prevent && (
          <section className="mb-16 md:mb-20" aria-labelledby="case-prevent-title">
            <Chapter n={chapter()} title="How to stop it happening again" japanese="予防" id="case-prevent-title">
              The fixes, and the alarms that would catch the same attack next
              time.
            </Chapter>
            <CaseFile detail={detail} title={item.title} part="prevent" />
          </section>
        )}

        {/* ── Evidence & supporting files ── */}
        <section className="mb-16 md:mb-20" aria-labelledby="case-evidence-title">
          <Chapter n={chapter()} title="Evidence & supporting files" japanese="証拠" id="case-evidence-title">
            The proof behind everything above: screenshots, technical
            identifiers and the full report.
          </Chapter>
          <div className="space-y-14">
            {screenshots.length > 0 && (
              <div>
                <BlockTitle japanese="画像" hint="Taken while doing the work. Click one to enlarge it.">
                  Screenshots — {screenshots.length}
                </BlockTitle>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {screenshots.map((shot, i) => (
                    <Shot
                      key={shot}
                      shot={shot}
                      index={i}
                      total={screenshots.length}
                      title={item.title}
                      onOpen={setGalleryIndex}
                    />
                  ))}
                </div>
              </div>
            )}

            {has.evidence && (
              <CaseFile detail={detail} href={item.href} title={item.title} part="evidence" />
            )}

            <CaseSummary summary={summary} part="artifacts" />

            {techniques.length > 0 && (
              <div>
                <BlockTitle
                  japanese="戦術"
                  hint="MITRE ATT&CK is the public catalogue security teams use to name attacker techniques. These are the ones seen in this case."
                >
                  Attack techniques (MITRE ATT&amp;CK) — {techniques.length}
                </BlockTitle>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {techniques.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`https://attack.mitre.org/techniques/${t.id.replace(".", "/")}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group spotlight relative flex h-full items-baseline gap-4 bg-surface/60 border border-foreground/5 px-5 py-4 hover:border-primary/40 transition-colors duration-300"
                      >
                        <span className="font-mono text-xs font-black text-accent tabular-nums shrink-0">
                          {t.id}
                        </span>
                        <span className="flex-1 text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                          {t.name}
                        </span>
                        <span className="hidden sm:block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60 shrink-0">
                          {t.tactic.replace(/-/g, " ")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <BlockTitle japanese="標識" hint="Click a topic to see every other case about it.">Topics</BlockTitle>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <PageLink
                    key={tag}
                    href={`/?q=${encodeURIComponent(tag)}#cases`}
                    className="px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-foreground/60 bg-foreground/[0.04] border border-foreground/10 hover:border-primary hover:text-primary-ink transition-colors"
                  >
                    #{tag}
                  </PageLink>
                ))}
              </div>
            </div>
          </div>
        </section>

        {relatedVideos.length > 0 && (
          <section className="mb-16" aria-labelledby="case-videos-title">
            <BlockTitle id="case-videos-title" japanese="動画" as="h2">
              Watch it explained
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
                  <PlayCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-ink"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block font-display text-base font-black uppercase tracking-tight text-foreground group-hover:text-primary-ink transition-colors">
                      {video.title}
                    </span>
                    {video.description && (
                      <span className="mt-2 block text-sm text-foreground/60 leading-relaxed line-clamp-3">
                        {video.description}
                      </span>
                    )}
                    <span className="mt-3 block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-tertiary">
                      Watch on YouTube
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mb-16" aria-labelledby="case-related-title">
            <BlockTitle id="case-related-title" japanese="関連" as="h2">
              Similar cases
            </BlockTitle>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((entry) => (
                <li key={entry.id}>
                  <PageLink
                    href={`/blog/${entry.id}`}
                    className="group spotlight spotlight-blue relative flex h-full flex-col bg-surface/60 border border-foreground/5 p-6 hover:border-tertiary/50 transition-colors duration-300"
                  >
                    <span className="font-display text-lg font-black uppercase tracking-tight text-foreground group-hover:text-tertiary transition-colors duration-180 mb-4">
                      {entry.title}
                    </span>
                    <span className="mt-auto font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                      {entry.category} • {entry.readTime} min
                      {entry.sharedTechniques > 0 &&
                        ` • ${entry.sharedTechniques} shared technique(s)`}
                    </span>
                  </PageLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Previous / next */}
        <nav
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-foreground/10"
          aria-label="Other cases"
        >
          {previous ? (
            <PageLink
              href={`/blog/${previous.id}`}
              className="group spotlight relative flex flex-col gap-3 bg-surface/60 border border-foreground/5 p-6 hover:border-primary/40 transition-colors duration-300"
            >
              <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-primary-ink">
                <ArrowLeft
                  size={12}
                  className="transition-transform duration-180 group-hover:-translate-x-[3.4px]"
                />{" "}
                Previous
              </span>
              <span className="font-display text-base font-black uppercase tracking-tight text-foreground/80 group-hover:text-foreground">
                {previous.title}
              </span>
            </PageLink>
          ) : (
            <span />
          )}
          {next && (
            <PageLink
              href={`/blog/${next.id}`}
              className="group spotlight relative flex flex-col items-end gap-3 text-right bg-surface/60 border border-foreground/5 p-6 hover:border-primary/40 transition-colors duration-300"
            >
              <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-primary-ink">
                Next{" "}
                <ArrowRight
                  size={12}
                  className="transition-transform duration-180 group-hover:translate-x-[3.4px]"
                />
              </span>
              <span className="font-display text-base font-black uppercase tracking-tight text-foreground/80 group-hover:text-foreground">
                {next.title}
              </span>
            </PageLink>
          )}
        </nav>

        <div className="mt-10 flex justify-center">
          <PageLink href="/#cases" className={btnOutline}>
            <ArrowLeft size={13} /> Back to the library
          </PageLink>
        </div>
      </div>

      {galleryIndex !== null && (
        <Suspense fallback={null}>
          <Lightbox
            close={() => setGalleryIndex(null)}
            index={galleryIndex}
            slides={slides}
          />
        </Suspense>
      )}
    </article>
  );
}
