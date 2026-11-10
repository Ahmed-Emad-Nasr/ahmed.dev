"use client";

/*
 * CaseFile — the structured half of a case page (data/case-details.ts):
 * verdict, facts, attack chain, timeline, indicators, response, detection
 * and the report. The chain and timeline draw themselves as they scroll in
 * (CSS transitions switched on once, skipped with reduced motion).
 *
 * ═══ components/blog/CaseFile.tsx — the structured part of a CASE PAGE ═══
 * Draws data/case-details.ts → caseDetails["<case-id>"]. Each block appears
 * only if that field exists for the case:
 *   verdict + severity → VerdictBar       facts     → Facts
 *   chain (attack chain) → Chain          timeline  → Timeline
 *   iocs (indicators, copyable) → Iocs    detection → Detection (rules / queries)
 *   the PDF report → ReportViewer (embedded viewer + download)
 * The field names and allowed values are the CaseDetail type at the top of
 * data/case-details.ts. Add a field there + a block here to show something new.
 *
 * The case page is laid out as plain-language chapters, so the blocks are
 * drawn one `part` at a time (see CaseArticle.tsx):
 *   part="happened" → team, key facts, how the attack unfolded, timeline
 *   part="prevent"  → fixes and safeguards, detection rules, lessons
 *   part="evidence" → indicators, attachments, the embedded PDF report
 * Every block keeps its full technical content; only the titles are plain,
 * with one sentence saying what the block is.
 */

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useInView as useFramerInView } from "framer-motion";
import {
  AlertOctagon, Check, ClipboardCopy, Copy, FileText, Fingerprint, GitBranch, History,
  ListChecks, Paperclip, ShieldCheck, Users, BookOpen, Code2,
} from "lucide-react";
import { defang, normalizePublicHref } from "@/lib/shared";
import type { CaseDetail, IocType } from "@/data/case-details";
import FadeIn from "@/components/ui/FadeIn";

/* ── Shared bits ─────────────────────────────────────────────────────── */

/** true once the element has scrolled into view (and stays true) */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useFramerInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return { ref, inView };
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1400);
    } catch {
      /* clipboard blocked (insecure context) */
    }
  }, []);
  return { copied, copy };
}

/* hint = one plain sentence under the title, before the technical content */
function SectionTitle({ icon, children, japanese, id, hint }: { icon: ReactNode; children: ReactNode; japanese: string; id?: string; hint?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-[2px] bg-primary" aria-hidden="true" />
        <span className="text-primary-ink" aria-hidden="true">{icon}</span>
        <h3 id={id} className="font-mono text-[0.625rem] text-primary-ink tracking-[0.35em] uppercase font-bold">{children}</h3>
        <span className="brush-jp text-base text-foreground/30" lang="ja" aria-hidden="true" data-jp={japanese} />
        <span className="flex-1 h-px bg-gradient-to-r from-foreground/10 to-transparent" aria-hidden="true" />
      </div>
      {hint && <p className="mt-2 max-w-2xl text-sm text-foreground/60 font-light leading-relaxed">{hint}</p>}
    </div>
  );
}

const SEVERITY_TONE: Record<NonNullable<CaseDetail["severity"]>, string> = {
  Critical: "text-primary-ink border-primary/50 bg-primary/10",
  High: "text-accent border-accent/40 bg-accent/10",
  Medium: "text-tertiary border-tertiary/40 bg-tertiary/10",
  Low: "text-foreground/70 border-foreground/20 bg-foreground/[0.04]",
};

const NETWORK_IOC = new Set<IocType>(["ip", "domain", "url", "email"]);
const IOC_LABEL: Record<IocType, string> = {
  ip: "IP", domain: "Domain", url: "URL", email: "E-mail", hash: "Hash", file: "File", registry: "Registry", account: "Account", other: "Artifact",
};

/* ATT&CK links: T1566.001 → /techniques/T1566/001/ */
const attackUrl = (id: string) => `https://attack.mitre.org/techniques/${id.replace(".", "/")}/`;

/* ── Verdict ─────────────────────────────────────────────────────────── */

export function VerdictBar({ verdict, severity }: Pick<CaseDetail, "verdict" | "severity">) {
  if (!verdict) return null;
  return (
    <FadeIn y={16} duration={0.6}
      className="relative mb-10 flex flex-col sm:flex-row sm:items-center gap-4 border border-foreground/10 bg-surface/60 px-6 py-5 overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-[3px] bg-primary" aria-hidden="true" />
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.35em] text-foreground/60">In one line</span>
      </div>
      <p className="flex-1 text-base md:text-lg text-foreground font-light leading-snug">{verdict}</p>
      {severity && (
        <span className={`self-start sm:self-auto inline-flex items-center gap-2 px-3 py-1.5 border font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] ${SEVERITY_TONE[severity]}`}>
          <AlertOctagon size={12} aria-hidden="true" /> {severity}
        </span>
      )}
    </FadeIn>
  );
}

/* ── Facts + chain ───────────────────────────────────────────────────── */

function Facts({ facts }: { facts: NonNullable<CaseDetail["facts"]> }) {
  return (
    <dl className="border border-foreground/10 bg-surface/60 divide-y divide-foreground/5">
      {facts.map((f, i) => (
        <FadeIn x={-12} y={0} duration={0.5} delay={i * 0.05} key={f.label} className="grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3">
          <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60 pt-0.5">{f.label}</dt>
          <dd className="text-sm text-foreground/85 [overflow-wrap:anywhere]">{f.value}</dd>
        </FadeIn>
      ))}
    </dl>
  );
}

function Chain({ chain }: { chain: NonNullable<CaseDetail["chain"]> }) {
  const { ref, inView } = useInView<HTMLOListElement>();
  const step = 0.35; // seconds between nodes
  return (
    <ol ref={ref} className="relative pl-8" data-inview={inView}>
      {/* the spine draws from top to bottom across the whole chain */}
      <span
        className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-primary via-primary/70 to-accent origin-top scale-y-0 transition-transform ease-out data-[on=true]:scale-y-100"
        style={{ transitionDuration: `${chain.length * step}s` }}
        data-on={inView}
        aria-hidden="true"
      />
      <span className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-foreground/10" aria-hidden="true" />
      {chain.map((c, i) => (
        <li key={i} className="relative pb-5 last:pb-0">
          <span
            className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center border border-foreground/20 bg-background font-mono text-[0.5625rem] font-bold text-foreground/60 transition-all duration-500 data-[on=true]:border-primary data-[on=true]:text-primary-ink"
            style={{ transitionDelay: `${i * step}s` }}
            data-on={inView}
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 opacity-70 translate-x-2 transition-all duration-500 data-[on=true]:opacity-100 data-[on=true]:translate-x-0 motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-none"
            style={{ transitionDelay: `${i * step}s` }}
            data-on={inView}
          >
            <span className="text-sm md:text-[0.95rem] text-foreground/85 leading-relaxed">{c.step}</span>
            {c.technique && (
              <a
                href={attackUrl(c.technique)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.625rem] font-bold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
              >
                {c.technique}
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ── Timeline ────────────────────────────────────────────────────────── */

function Timeline({ timeline }: { timeline: NonNullable<CaseDetail["timeline"]> }) {
  const { ref, inView } = useInView<HTMLOListElement>();
  return (
    <ol ref={ref} className="relative border-l border-foreground/10 ml-2">
      <span
        className="absolute -left-px top-0 h-full w-[2px] bg-tertiary origin-top scale-y-0 transition-transform ease-out data-[on=true]:scale-y-100"
        style={{ transitionDuration: `${Math.max(0.6, timeline.length * 0.3)}s` }}
        data-on={inView}
        aria-hidden="true"
      />
      {timeline.map((t, i) => (
        <li
          key={i}
          className="relative pl-7 pb-6 last:pb-0 opacity-70 translate-y-1.5 transition-all duration-500 data-[on=true]:opacity-100 data-[on=true]:translate-y-0"
          style={{ transitionDelay: `${i * 0.3}s` }}
          data-on={inView}
        >
          <span className="absolute -left-[6px] top-1.5 h-[11px] w-[11px] rotate-45 border border-tertiary bg-background" aria-hidden="true" />
          <time className="block font-mono text-[0.6875rem] font-bold tracking-wider text-tertiary tabular-nums">{t.time}</time>
          <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{t.event}</p>
        </li>
      ))}
    </ol>
  );
}

/* ── Indicators ──────────────────────────────────────────────────────── */

function Iocs({ iocs }: { iocs: NonNullable<CaseDetail["iocs"]> }) {
  const { copied, copy } = useCopy();
  const shown = (t: IocType, v: string) => (NETWORK_IOC.has(t) ? defang(v) : v);
  const csv = ["type,value,note", ...iocs.map((i) => [IOC_LABEL[i.type], shown(i.type, i.value), i.note ?? ""].map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <p className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
          Network indicators are defanged · click a row to copy
        </p>
        <button
          type="button"
          onClick={() => void copy("__all", csv)}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-foreground/10 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/70 hover:border-accent/50 hover:text-accent transition-colors"
        >
          {copied === "__all" ? <Check size={12} /> : <ClipboardCopy size={12} />} {copied === "__all" ? "Copied" : "Copy all as CSV"}
        </button>
      </div>
      <ul className="border border-foreground/10 divide-y divide-foreground/5 bg-surface/40">
        {iocs.map((i, k) => {
          const value = shown(i.type, i.value);
          const key = `${k}`;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => void copy(key, value)}
                className="group w-full text-left grid grid-cols-1 md:grid-cols-[6rem_1fr_auto] items-start gap-x-4 gap-y-1 px-4 py-3 hover:bg-foreground/[0.03] transition-colors"
              >
                <span className="sr-only">Copy </span>
                <span className="font-mono text-[0.5625rem] font-bold uppercase tracking-[0.25em] text-foreground/60 pt-0.5">{IOC_LABEL[i.type]}</span>
                <span className="min-w-0">
                  <span className={`block font-mono text-xs [overflow-wrap:anywhere] ${i.type === "hash" ? "text-primary-ink" : NETWORK_IOC.has(i.type) ? "text-accent" : "text-tertiary"}`}>
                    {value}
                  </span>
                  {i.note && <span className="block mt-1 text-xs text-foreground/60">{i.note}</span>}
                </span>
                <span className="hidden md:flex items-center text-foreground/30 group-hover:text-foreground/70 transition-colors" aria-hidden="true">
                  {copied === key ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Detection ───────────────────────────────────────────────────────── */

function Detection({ items }: { items: NonNullable<CaseDetail["detection"]> }) {
  const { copied, copy } = useCopy();
  return (
    <div className="grid gap-6">
      {items.map((d, k) => (
        <FadeIn as="figure" y={20} duration={0.6} key={d.title} className="border border-foreground/10 bg-[#0a0a0c] overflow-hidden">
          <figcaption className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-white/5">
            <span className="flex items-center gap-2">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-primary/70" />
                <span className="w-2 h-2 rounded-full bg-accent/70" />
                <span className="w-2 h-2 rounded-full bg-tertiary/70" />
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/60">{d.title}</span>
            </span>
            <button
              type="button"
              onClick={() => void copy(`${k}`, d.code)}
              className="inline-flex items-center gap-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
            >
              {copied === `${k}` ? <Check size={12} /> : <Copy size={12} />} {copied === `${k}` ? "Copied" : d.lang}
            </button>
          </figcaption>
          <pre className="overflow-x-auto p-4 text-[0.75rem] leading-relaxed text-white/85 font-mono" tabIndex={0} aria-label={`${d.title} — code`}>
            {d.code.split("\n").map((line, i) => (
              <span key={i} className="block">
                <span className="inline-block w-8 select-none text-right pr-4 text-white/20" aria-hidden="true">{i + 1}</span>
                {line}
              </span>
            ))}
          </pre>
        </FadeIn>
      ))}
    </div>
  );
}

/* ── Report viewer ───────────────────────────────────────────────────── */

function ReportViewer({ href, title }: { href: string; title: string }) {
  const [open, setOpen] = useState(false);
  const src = normalizePublicHref(href);
  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative w-full border border-dashed border-foreground/15 bg-surface/40 px-6 py-10 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
        >
          <FileText size={28} className="text-primary-ink transition-transform duration-500 group-hover:-translate-y-[3.4px]" aria-hidden="true" />
          <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.3em] text-foreground">Read the full report here</span>
          <span className="text-xs text-foreground/60">Opens the technical PDF inside this page — nothing is downloaded</span>
        </button>
      ) : (
        <div className="border border-foreground/10 bg-surface">
          <iframe src={`${src}#view=FitH`} title={`${title} — report`} className="w-full h-[80vh]" loading="lazy" />
          <p className="px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
            Not showing? <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary-ink underline underline-offset-4">Open the PDF in a new tab</a>
          </p>
        </div>
      )}
    </div>
  );
}

/* ── The case file ───────────────────────────────────────────────────── */

export type CaseFilePart = "happened" | "prevent" | "evidence";

/* Which parts have something to show for this case (CaseArticle uses it to
   decide which chapters exist) */
export const caseFileHas = (detail: CaseDetail | undefined, href?: string): Record<CaseFilePart, boolean> => ({
  happened: Boolean(detail && (detail.team || detail.facts?.length || detail.chain?.length || detail.timeline?.length)),
  prevent: Boolean(detail && (detail.response?.length || detail.detection?.length || detail.lessons)),
  evidence: Boolean(href || (detail && (detail.iocs?.length || detail.attachments?.length))),
});

export default function CaseFile({ detail, href, title, part }: { detail?: CaseDetail; href?: string; title: string; part: CaseFilePart }) {
  /* ── What happened ── */
  if (part === "happened") {
    if (!detail) return null;
    const hasChainOrFacts = Boolean(detail.facts?.length || detail.chain?.length);
    return (
      <div className="grid gap-14">
        {detail.team && (
          <FadeIn y={12} duration={0.5} className="flex items-start gap-3 border border-tertiary/30 bg-tertiary/5 px-5 py-4">
            <Users size={16} className="text-tertiary mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-foreground/80"><span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-tertiary mr-2">Team project</span>{detail.team}</p>
          </FadeIn>
        )}

        {hasChainOrFacts && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10">
            {detail.facts?.length ? (
              <div>
                <SectionTitle icon={<Fingerprint size={13} />} japanese="概要" hint="Who and what was involved.">Key facts</SectionTitle>
                <Facts facts={detail.facts} />
              </div>
            ) : null}
            {detail.chain?.length ? (
              <div>
                <SectionTitle
                  icon={<GitBranch size={13} />}
                  japanese="連鎖"
                  hint="The attacker's moves, one after another. The T-codes link to MITRE ATT&CK, the public catalogue of attack techniques."
                >
                  How the attack unfolded
                </SectionTitle>
                <Chain chain={detail.chain} />
              </div>
            ) : null}
          </div>
        )}

        {detail.timeline?.length ? (
          <div>
            <SectionTitle icon={<History size={13} />} japanese="時系列" hint="The same events with their dates and times.">When it happened</SectionTitle>
            <Timeline timeline={detail.timeline} />
          </div>
        ) : null}
      </div>
    );
  }

  /* ── How to stop it happening again ── */
  if (part === "prevent") {
    if (!detail) return null;
    return (
      <div className="grid gap-14">
        {detail.response?.length ? (
          <div>
            <SectionTitle
              icon={<ShieldCheck size={13} />}
              japanese="対応"
              hint="What was done — or should be done — to stop the damage and close the gap."
            >
              Fixes and safeguards
            </SectionTitle>
            <ul className="grid sm:grid-cols-2 gap-3">
              {detail.response.map((r, i) => (
                <FadeIn as="li" y={14} duration={0.5} delay={Math.min(i, 6) * 0.06} key={i} className="flex gap-3 border border-foreground/5 bg-surface/40 px-4 py-3">
                  <ListChecks size={14} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-foreground/80 leading-relaxed">{r}</span>
                </FadeIn>
              ))}
            </ul>
          </div>
        ) : null}

        {detail.detection?.length ? (
          <div>
            <SectionTitle
              icon={<Code2 size={13} />}
              japanese="検知"
              hint="Rules a monitoring system can run so the same behaviour raises an alarm next time. This part is technical — copy the code as it is."
            >
              Detection rules
            </SectionTitle>
            <Detection items={detail.detection} />
          </div>
        ) : null}

        {detail.lessons && (
          <div>
            <SectionTitle icon={<BookOpen size={13} />} japanese="教訓">What I&apos;d do differently</SectionTitle>
            <p className="text-base text-foreground/80 leading-relaxed border-l-2 border-accent pl-5">{detail.lessons}</p>
          </div>
        )}
      </div>
    );
  }

  /* ── Evidence & supporting files ── */
  return (
    <div className="grid gap-14">
      {detail?.iocs?.length ? (
        <div>
          <SectionTitle
            icon={<Fingerprint size={13} />}
            japanese="痕跡"
            hint="The traces the attacker left behind — addresses, files and fingerprints other defenders can search for (called indicators of compromise, or IOCs)."
          >
            Traces left behind — {detail.iocs.length}
          </SectionTitle>
          <Iocs iocs={detail.iocs} />
        </div>
      ) : null}

      {detail?.attachments?.length ? (
        <div>
          <SectionTitle icon={<Paperclip size={13} />} japanese="添付" hint="Extra documents that belong to this case.">Supporting files</SectionTitle>
          <ul className="flex flex-wrap gap-3">
            {detail.attachments.map((a) => (
              <li key={a.href}>
                <a
                  href={a.href.startsWith("http") ? a.href : normalizePublicHref(a.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-foreground/10 text-sm text-foreground/80 hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  <Paperclip size={13} className="text-primary-ink" aria-hidden="true" /> {a.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {href && (
        <div>
          <SectionTitle
            icon={<FileText size={13} />}
            japanese="報告書"
            hint="The original report, with every command, screenshot and finding."
          >
            The full technical report{detail?.pages ? ` — ${detail.pages} pages` : ""}
          </SectionTitle>
          <ReportViewer href={href} title={title} />
        </div>
      )}
    </div>
  );
}
