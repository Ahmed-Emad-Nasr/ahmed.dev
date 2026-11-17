/*
 * AttackCoverage — the case library on MITRE ATT&CK, as a summary: a
 * kill-chain strip (each stage opens its list on /attack) and the
 * TOP_TECHNIQUES most-covered techniques as heat-tinted tiles. The full list,
 * one page per technique, is /attack (app/attack/page.tsx) — so the blog
 * does not repeat it. Each tile opens its evidence in a native popover, so
 * the section ships almost no JavaScript of its own (styles in globals.css,
 * .attack-*; the heat filling in on arrival is HeatReveal.tsx).
 *
 * ═══ components/blog/AttackCoverage.tsx — the MITRE ATT&CK section (#attack, blog part of the home page) ═══
 * Nothing to type in here: the numbers are computed from which ATT&CK
 * techniques each case uses — caseAttackMapping in data/attack.ts
 * (case id → ["T1059.001", …]). Map a new case there and its techniques
 * light up here, in the matrix and in the counts.
 *   TechniqueTile → one technique tile; colour strength = how many reports
 *                   cover it (`max` = the highest count)
 */

import Link from "next/link";
import type { CSSProperties } from "react";
import FadeIn from "@/components/ui/FadeIn";
import HeatReveal from "@/components/blog/HeatReveal";
import { KanjiWatermark } from "@/components/ui/kit";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import type { AttackCoverageData } from "@/lib/library-data";

type CoverageTechnique = {
  id: string;
  name: string;
  cases: { id: string; title: string }[];
};

type CoverageTactic = {
  id: string;
  /** ATT&CK tactic id, e.g. TA0002 */
  ta: string;
  name: string;
  /** Label for the kill-chain strip, where the full name does not fit */
  short: string;
  /** 1-based position in the Enterprise ATT&CK kill chain */
  order: number;
  techniques: CoverageTechnique[];
};

type Props = {
  /** Every tactic in kill-chain order, covered or not */
  tactics: CoverageTactic[];
  techniqueCount: number;
  mappedCaseCount: number;
};

const attackUrl = (id: string) => `https://attack.mitre.org/techniques/${id.replace(".", "/")}/`;
/* How many techniques the blog shows; the rest are on /attack */
const TOP_TECHNIQUES = 6;

const pad = (n: number) => String(n).padStart(2, "0");
const popId = (id: string) => `attack-pop-${id.replace(".", "-")}`;

/* Tint strength for a tile or strip cell: 0 → faint, 1 → the strongest. */
const heat = (value: number, max: number): CSSProperties =>
  ({ "--heat": `${Math.round(5 + (value / max) * 20)}%` }) as CSSProperties;

function TechniqueTile({ technique, tactic, max }: { technique: CoverageTechnique; tactic: CoverageTactic; max: number }) {
  const count = technique.cases.length;
  const id = popId(technique.id);
  return (
    <li>
      <button type="button" popoverTarget={id} className="attack-tile" style={heat(count, max)}>
        <span className="attack-tile-top">
          <span className="attack-id">{technique.id}</span>
          {/* One pip per report — the evidence depth at a glance */}
          <span className="attack-pips" style={{ "--n": count, "--max": max } as CSSProperties} aria-hidden="true" />
        </span>
        <span className="attack-name">{technique.name}</span>
        <span className="attack-tile-foot">
          {count} {count === 1 ? "report" : "reports"}
          <span aria-hidden="true">→</span>
        </span>
      </button>

      <div
        id={id}
        popover="auto"
        role="dialog"
        aria-labelledby={`${id}-title`}
        className="attack-pop"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">
            {`${tactic.ta} // ${tactic.name}`}
          </p>
          <button
            type="button"
            popoverTarget={id}
            popoverTargetAction="hide"
            className="attack-pop-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 font-mono text-xs font-black tracking-[0.2em] text-accent">{technique.id}</p>
        <h4 id={`${id}-title`} className="mt-1 font-display text-2xl md:text-3xl font-black uppercase tracking-tight leading-[0.95]">
          {technique.name}
        </h4>

        <p className="mt-6 mb-3 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-foreground/60">
          Evidence // {count} {count === 1 ? "report" : "reports"}
        </p>
        <ol className="attack-pop-cases">
          {technique.cases.map((c, i) => (
            <li key={c.id}>
              <Link prefetch={false} href={`/blog/${c.id}`}>
                <span className="attack-pop-n">{pad(i + 1)}</span>
                <span className="flex-1">{c.title}</span>
                <span className="attack-pop-go" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>

        <Link prefetch={false} className="attack-pop-ext" href={`/attack/${technique.id}`}>
          The {technique.id} page →
        </Link>
        <a className="attack-pop-ext" href={attackUrl(technique.id)} target="_blank" rel="noopener noreferrer">
          {technique.id} on attack.mitre.org ↗
        </a>
      </div>
    </li>
  );
}

/* The coverage is computed at build time (lib/library-data.ts) by
   app/page.tsx and passed in — the case and ATT&CK data files never
   ship with this component's chunk. */
export default function AttackCoverage({ coverage }: { coverage: AttackCoverageData }) {
  const { tactics, techniqueCount, mappedCaseCount }: Props = coverage;
  const covered = tactics.filter((t) => t.techniques.length > 0);
  const max = Math.max(1, ...covered.flatMap((t) => t.techniques.map((x) => x.cases.length)));
  const maxPerTactic = Math.max(1, ...tactics.map((t) => t.techniques.length));
  /* The most-cited techniques, each with its tactic (ties: kill-chain order) */
  const top = tactics
    .flatMap((tactic) => tactic.techniques.map((technique) => ({ technique, tactic })))
    .sort((a, b) => b.technique.cases.length - a.technique.cases.length)
    .slice(0, TOP_TECHNIQUES);

  return (
    <section
      id="attack"
      aria-labelledby="attack-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-clip"
    >
      {/* Tiles fill with their heat as they scroll into view (once) */}
      <HeatReveal />
      <KanjiWatermark chars="網羅" side="left" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Header: same layout as every other section ─── */}
        <SectionHeader
          id="attack-title"
          eyebrow="ATT&CK // Methods handled"
          japanese="網羅"
          titleA="Mapped to"
          titleB="ATT&CK."
          size="lg"
          description="MITRE ATT&CK is the public catalogue of the methods attackers use, grouped by the stage of an attack — from getting in to stealing data. Below: how many methods I have handled at each stage, and the ones with the most cases. Open a tile to read its cases; every method has its own page."
          aside={
            <CounterChip
              stats={[
                { value: String(techniqueCount), label: "Techniques mapped" },
                { value: `${covered.length}/${tactics.length}`, label: "Tactics covered" },
                { value: String(mappedCaseCount), label: "Reports cited" },
              ]}
            />
          }
        />

        {/* ─── Kill-chain strip: the whole matrix at a glance ─── */}
        <FadeIn className="mb-14 md:mb-16">
          <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-foreground/60">
            <span>The stages of an attack // in order</span>
            <span className="hidden sm:inline">Brighter = more methods covered</span>
          </div>
          <ol className="attack-strip">
            {tactics.map((t) => {
              const n = t.techniques.length;
              const inner = (
                <>
                  <span className="attack-seg-n">{pad(t.order)}</span>
                  <span className="attack-seg-count">{n === 0 ? "—" : n}</span>
                  <span className="attack-seg-label">{t.short}</span>
                </>
              );
              const title = `${t.ta} · ${t.name} — ${n} ${n === 1 ? "technique" : "techniques"}`;
              return (
                <li key={t.id}>
                  {/* A covered stage opens its list on /attack; an empty one has nothing to open */}
                  {n === 0 ? (
                    <span className="attack-seg" data-off="" style={heat(n, maxPerTactic)} title={title}>
                      {inner}
                    </span>
                  ) : (
                    <Link prefetch={false} href={`/attack#tactic-${t.id}`} className="attack-seg" style={heat(n, maxPerTactic)} title={title}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </FadeIn>

        {/* ─── The most-covered methods ─── */}
        <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-foreground/60">
          <span>Most covered // by number of cases</span>
          <span className="hidden sm:inline">Click a tile for its cases</span>
        </div>
        <FadeIn y={16} duration={0.5}>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {top.map(({ technique, tactic }) => (
              <TechniqueTile key={technique.id} technique={technique} tactic={tactic} max={max} />
            ))}
          </ul>
        </FadeIn>

        <Link
          prefetch={false}
          href="/attack"
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-primary/40 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors duration-300"
        >
          All {techniqueCount} techniques, one page each →
        </Link>

        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60">
          <span className="flex items-center gap-3">
            <span className="attack-pips" style={{ "--n": 1, "--max": 1 } as CSSProperties} aria-hidden="true" />
            = one report · tint = depth of evidence
          </span>
          <span>
            Mapping per report · ATT&amp;CK Enterprise v19 ·{" "}
            <a
              href="https://attack.mitre.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-primary/50 hover:text-primary-ink"
            >
              attack.mitre.org
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
