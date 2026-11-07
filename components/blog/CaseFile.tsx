"use client";

/*
 * CaseFile — the structured half of a case page (data/case-details.ts) as
 * pieces CaseArticle places under its five headings: verdict, facts, attack
 * chain, timeline, indicators, response, detection, lessons, files, report. The chain and timeline draw themselves as they scroll in
 * (CSS transitions switched on once, skipped with reduced motion).
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

function SectionTitle({ icon, children, japanese, id }: { icon: ReactNode; children: ReactNode; japanese?: string; id?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-[2px] bg-primary" aria-hidden="true" />
      <span className="text-primary-ink" aria-hidden="true">{icon}</span>
      <h3 id={id} className="font-mono text-[0.625rem] text-primary-ink tracking-[0.35em] uppercase font-bold">{children}</h3>
      {japanese && <span className="brush-jp text-base text-foreground/30" lang="ja" aria-hidden="true" data-jp={japanese} />}
      <span className="flex-1 h-px bg-gradient-to-r from-foreground/10 to-transparent" aria-hidden="true" />
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

export function VerdictBar({
  verdict,
  severity,
  verdictPlain,
  severityPlain,
}: Pick<CaseDetail, "verdict" | "severity"> & { verdictPlain?: string; severityPlain?: string }) {
  if (!verdict) return null;
  return (
    <FadeIn y={16} duration={0.6}
      className="relative mb-10 flex flex-col sm:flex-row sm:items-center gap-4 border border-foreground/10 bg-surface/60 px-6 py-5 overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-[3px] bg-primary" aria-hidden="true" />
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.35em] text-foreground/60">Verdict</span>
      </div>
      <div className="flex-1">
        <p className="text-base md:text-lg text-foreground font-light leading-snug">{verdict}</p>
        {(verdictPlain || severityPlain) && (
          <p className="mt-2 text-sm text-foreground/60 font-light leading-relaxed">
            {[verdictPlain, severityPlain && `Severity: ${severityPlain}`].filter(Boolean).join(" ")}
          </p>
        )}
      </div>
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
          Addresses are “defanged” (84.38.130[.]118) so they can&apos;t be clicked by accident · click a row to copy
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
          <FileText size={28} className="text-primary-ink transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
          <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.3em] text-foreground">Read the PDF on this page</span>
          <span className="text-xs text-foreground/60">Opens the technical report right here — or use “View technical PDF” at the top</span>
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

/* ── The pieces, for components/blog/CaseArticle.tsx ─────────────────── */

export function TeamBanner({ team }: { team: string }) {
  return (
    <FadeIn y={12} duration={0.5} className="flex items-start gap-3 border border-tertiary/30 bg-tertiary/5 px-5 py-4">
      <Users size={16} className="text-tertiary mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-sm text-foreground/80"><span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-tertiary mr-2">Team project</span>{team}</p>
    </FadeIn>
  );
}

export function CaseFacts({ facts }: { facts: NonNullable<CaseDetail["facts"]> }) {
  return (
    <div>
      <SectionTitle icon={<Fingerprint size={13} />} japanese="概要">Key facts</SectionTitle>
      <Facts facts={facts} />
    </div>
  );
}

export function CaseChain({ chain }: { chain: NonNullable<CaseDetail["chain"]> }) {
  return (
    <div>
      <SectionTitle icon={<GitBranch size={13} />} japanese="連鎖">How the attack unfolded</SectionTitle>
      <Chain chain={chain} />
      <p className="mt-4 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
        The codes (T1190 …) are MITRE ATT&amp;CK technique IDs — click one for the public description
      </p>
    </div>
  );
}

export function CaseTimeline({ timeline }: { timeline: NonNullable<CaseDetail["timeline"]> }) {
  return (
    <div>
      <SectionTitle icon={<History size={13} />} japanese="時系列">Timeline</SectionTitle>
      <Timeline timeline={timeline} />
    </div>
  );
}

export function CaseIocs({ iocs }: { iocs: NonNullable<CaseDetail["iocs"]> }) {
  return (
    <div>
      <SectionTitle icon={<Fingerprint size={13} />} japanese="痕跡">Indicators of compromise (IOCs) — {iocs.length}</SectionTitle>
      <p className="mb-4 max-w-3xl text-sm text-foreground/60 font-light leading-relaxed">
        The clues the attacker left — addresses, domains, accounts and file fingerprints. Defenders search for and block these.
      </p>
      <Iocs iocs={iocs} />
    </div>
  );
}

export function CaseResponse({ response }: { response: NonNullable<CaseDetail["response"]> }) {
  return (
    <div>
      <SectionTitle icon={<ShieldCheck size={13} />} japanese="対応">What was done to stop and fix it</SectionTitle>
      <ul className="grid sm:grid-cols-2 gap-3">
        {response.map((r, i) => (
          <FadeIn as="li" y={14} duration={0.5} delay={Math.min(i, 6) * 0.06} key={i} className="flex gap-3 border border-foreground/5 bg-surface/40 px-4 py-3">
            <ListChecks size={14} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm text-foreground/80 leading-relaxed">{r}</span>
          </FadeIn>
        ))}
      </ul>
    </div>
  );
}

export function CaseDetection({ items }: { items: NonNullable<CaseDetail["detection"]> }) {
  return (
    <div>
      <SectionTitle icon={<Code2 size={13} />} japanese="検知">Detection rules written for it</SectionTitle>
      <p className="mb-4 max-w-3xl text-sm text-foreground/60 font-light leading-relaxed">
        Rules that make security tools raise an alarm automatically the next time this happens. Click the language label to copy one.
      </p>
      <Detection items={items} />
    </div>
  );
}

export function CaseLessons({ lessons }: { lessons: string }) {
  return (
    <div>
      <SectionTitle icon={<BookOpen size={13} />} japanese="教訓">What I&apos;d do differently</SectionTitle>
      <p className="text-base text-foreground/80 leading-relaxed border-l-2 border-accent pl-5">{lessons}</p>
    </div>
  );
}

export function CaseAttachments({ attachments }: { attachments: NonNullable<CaseDetail["attachments"]> }) {
  return (
    <div>
      <SectionTitle icon={<Paperclip size={13} />} japanese="添付">Supporting files</SectionTitle>
      <ul className="flex flex-wrap gap-3">
        {attachments.map((a) => (
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
  );
}

export function CaseReport({ href, title, pages }: { href: string; title: string; pages?: number }) {
  return (
    <div>
      <SectionTitle icon={<FileText size={13} />} japanese="報告書">
        The full technical report{pages ? ` — ${pages} pages` : ""}
      </SectionTitle>
      <ReportViewer href={href} title={title} />
    </div>
  );
}
