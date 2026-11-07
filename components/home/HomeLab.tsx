/*
 * HomeLab — the SOC lab as an architecture diagram (what attacks it, what it
 * collects, where logs go, what happens when a rule fires). Pure SVG + CSS:
 * dashes and packets travel in the direction the data flows.
 */

import SectionHeader from "@/components/ui/SectionHeader";
import { KanjiWatermark } from "@/components/ui/kit";
import FadeIn from "@/components/ui/FadeIn";
import Logo from "@/components/ui/Logo";
import { logoFor } from "@/data/logos";
import { LOGO_FILES, LOGO_MARKS } from "@/components/ui/logo-data";
import { normalizePublicHref } from "@/lib/shared";
import { Crosshair, FileSearch, Radar, ShieldCheck } from "lucide-react";

type Node = {
  id: string; x: number; y: number; w: number; h: number; title: string; sub: string; tone: "primary" | "accent" | "tertiary" | "muted";
  /** The name its logo is found by (data/logos.ts) */
  logo: string;
  /** What it does, for someone who has never heard of it */
  plain: string;
};

const NODES: Node[] = [
  { id: "kali", x: 20, y: 40, w: 210, h: 74, title: "Kali Linux", sub: "Atomic Red Team · manual", tone: "primary", logo: "Kali Linux", plain: "The attacker's computer. I use it to launch real attack techniques against the lab." },
  { id: "pfsense", x: 20, y: 190, w: 210, h: 74, title: "pfSense", sub: "Firewall · segmentation", tone: "muted", logo: "pfSense", plain: "The firewall — the lab's front door, deciding which traffic may pass between networks." },
  { id: "ids", x: 20, y: 340, w: 210, h: 74, title: "Suricata + Zeek", sub: "Network IDS · traffic logs", tone: "tertiary", logo: "Suricata", plain: "Network watchers. They read every packet and flag traffic that matches known attacks." },
  { id: "win", x: 310, y: 40, w: 210, h: 74, title: "Windows hosts", sub: "Sysmon · Wazuh agent · FIM", tone: "muted", logo: "Windows", plain: "Ordinary office PCs — the targets. Sysmon records every program they start." },
  { id: "linux", x: 310, y: 190, w: 210, h: 74, title: "Linux hosts", sub: "auditd · Wazuh agent · FIM", tone: "muted", logo: "Linux", plain: "Servers — also targets. auditd records who did what, and file changes are tracked." },
  { id: "wazuh", x: 600, y: 150, w: 210, h: 154, title: "Wazuh SIEM", sub: "Manager · indexer · dashboard", tone: "primary", logo: "Wazuh", plain: "The brain. It collects every log in one place and checks it against my detection rules." },
  { id: "vt", x: 850, y: 40, w: 180, h: 74, title: "VirusTotal", sub: "Hash enrichment (API)", tone: "accent", logo: "VirusTotal", plain: "A free service that checks a file against dozens of antivirus engines at once." },
  { id: "yara", x: 850, y: 190, w: 180, h: 74, title: "YARA + script", sub: "Scan · auto-quarantine", tone: "accent", logo: "YARA", plain: "Scans suspicious files for known malware patterns and moves bad ones into quarantine automatically." },
  { id: "hive", x: 850, y: 340, w: 180, h: 74, title: "TheHive", sub: "Case management", tone: "tertiary", logo: "TheHive", plain: "Where each alert becomes a case to investigate, with notes and evidence in one place." },
];

/* The test loop, before the diagram */
const STEPS = [
  { icon: Crosshair, title: "Attack", text: "I play the attacker from Kali Linux, running real attack techniques — scripted (Atomic Red Team) and by hand." },
  { icon: FileSearch, title: "Record", text: "Every machine writes down what happens: Sysmon on Windows, auditd on Linux, Suricata and Zeek on the network." },
  { icon: Radar, title: "Detect", text: "All of it flows into Wazuh, which checks it against my detection rules and raises an alert when one matches." },
  { icon: ShieldCheck, title: "Respond", text: "The alert is checked against VirusTotal, a YARA scan quarantines bad files, and a case opens in TheHive. Missed something? I fix the rule and attack again." },
];

/* A node's logo inside the SVG: the file, else the brand mark (no monogram — the title is right there) */
function NodeLogo({ name, x, y }: { name: string; x: number; y: number }) {
  const spec = logoFor(name);
  if (!spec) return null;
  const file = LOGO_FILES[spec.slug];
  if (file) return <image href={normalizePublicHref(file)} x={x} y={y} width="20" height="20" preserveAspectRatio="xMidYMid meet" />;
  const mark = spec.icon ? LOGO_MARKS[spec.icon] : undefined;
  if (!mark) return null;
  return (
    <svg x={x} y={y} width="20" height="20" viewBox="0 0 24 24" fill={mark[1] ?? "currentColor"} aria-hidden="true">
      <path d={mark[2]} />
    </svg>
  );
}

const hasNodeLogo = (name: string) => {
  const spec = logoFor(name);
  return Boolean(spec && (LOGO_FILES[spec.slug] || (spec.icon && LOGO_MARKS[spec.icon])));
};

const TONE: Record<Node["tone"], string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  tertiary: "var(--tertiary)",
  muted: "color-mix(in srgb, var(--foreground) 35%, transparent)",
};

/* Links as paths, in the direction the data flows */
const LINKS: { d: string; tone: Node["tone"]; label?: string; lx?: number; ly?: number; dur: number }[] = [
  { d: "M230 77 H310", tone: "primary", label: "attack", lx: 270, ly: 68, dur: 2.2 },
  { d: "M230 77 C270 77 270 227 310 227", tone: "primary", dur: 2.8 },
  { d: "M125 264 V340", tone: "muted", label: "mirror", lx: 160, ly: 306, dur: 2 },
  { d: "M520 77 C560 77 560 190 600 190", tone: "muted", label: "logs", lx: 585, ly: 118, dur: 2.4 },
  { d: "M520 227 H600", tone: "muted", dur: 2 },
  { d: "M230 377 C420 377 460 270 600 270", tone: "tertiary", label: "alerts", lx: 420, ly: 352, dur: 3.2 },
  { d: "M810 190 C830 190 830 77 850 77", tone: "accent", dur: 2.2 },
  { d: "M810 227 H850", tone: "accent", dur: 1.8 },
  { d: "M810 270 C830 270 830 377 850 377", tone: "tertiary", dur: 2.4 },
];

export default function HomeLab() {
  return (
    <section id="lab" aria-label="Home lab" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      <KanjiWatermark chars="道場" side="right" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          titleA="How I Test"
          titleB="Security."
          description="I built a small company network at home — my “home lab” — to attack it safely and check that the defences notice. Most of my projects and detection rules were built and tested here. It works in four steps:"
        />

        <ol className="-mt-6 md:-mt-10 mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 bg-background px-5 py-5">
              <span className="flex items-center gap-3">
                <span className="font-mono text-[0.625rem] font-bold text-primary-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <s.icon size={16} className="text-accent" aria-hidden="true" />
                <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.25em] text-foreground">{s.title}</span>
              </span>
              <p className="text-sm text-foreground/60 font-light leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>

        <p className="mb-4 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-foreground/60">
          The lab as a map — the moving dots show which way the data flows
        </p>

        {/* Scrolls sideways on narrow screens — focusable so keyboard users can
            scroll it too (arrow keys), and named for screen readers */}
        <FadeIn as="figure" y={30} duration={0.8} className="relative border border-foreground/10 bg-surface/40 p-4 md:p-8 overflow-x-auto" tabIndex={0} aria-labelledby="lab-title">
          <svg viewBox="0 0 1040 440" className="min-w-[760px] w-full h-auto" role="img" aria-labelledby="lab-title lab-desc">
            <title id="lab-title">SOC home lab architecture</title>
            <desc id="lab-desc">
              Kali Linux attacks Windows and Linux endpoints behind pfSense. Endpoint logs (Sysmon, auditd, file integrity) and Suricata and Zeek network alerts flow into Wazuh. Wazuh enriches hashes through VirusTotal, triggers a YARA scan and quarantine script, and opens cases in TheHive.
            </desc>
            <defs>
              <pattern id="lab-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.05" />
              </pattern>
            </defs>
            <rect width="1040" height="440" fill="url(#lab-grid)" className="text-foreground" />

            {/* Links: dashed, flowing in the data's direction, each with a packet */}
            {LINKS.map((l, i) => (
              <g key={i}>
                <path d={l.d} fill="none" stroke={TONE[l.tone]} strokeOpacity="0.25" strokeWidth="2" />
                {i % 2 === 0 && (
                  <path d={l.d} fill="none" stroke={TONE[l.tone]} strokeWidth="2" strokeDasharray="6 10" className="lab-flow" style={{ animationDuration: `${l.dur}s` }} />
                )}
                {i % 2 === 0 && (
                  <circle r="4" fill={TONE[l.tone]} className="lab-packet">
                    <animateMotion dur={`${l.dur * 1.6}s`} repeatCount="indefinite" path={l.d} begin={`${(i * 0.37).toFixed(2)}s`} />
                  </circle>
                )}
                {l.label && (
                  <text x={l.lx} y={l.ly} textAnchor="middle" className="lab-label" fill="currentColor">
                    {l.label}
                  </text>
                )}
              </g>
            ))}

            {/* Nodes */}
            {NODES.map((n) => (
              <g key={n.id} className="lab-node">
                <rect x={n.x} y={n.y} width={n.w} height={n.h} fill="var(--surface)" stroke={TONE[n.tone]} strokeOpacity="0.55" />
                <rect x={n.x} y={n.y} width="3" height={n.h} fill={TONE[n.tone]} />
                <NodeLogo name={n.logo} x={n.x + 16} y={n.y + (n.h > 100 ? 18 : 16)} />
                {n.id === "wazuh" && (
                  <circle cx={n.x + n.w - 16} cy={n.y + 16} r="5" fill="var(--primary)" className="lab-beacon" />
                )}
                <text x={n.x + (hasNodeLogo(n.logo) && n.h <= 100 ? 44 : 16)} y={n.y + (n.h > 100 ? 66 : 32)} className="lab-title" fill="currentColor">
                  {n.title}
                </text>
                <text x={n.x + 16} y={n.y + (n.h > 100 ? 90 : 54)} className="lab-sub" fill="currentColor">
                  {n.sub}
                </text>
                {n.id === "wazuh" && (
                  <text x={n.x + 16} y={n.y + 118} className="lab-sub" fill="var(--primary)">
                    52 custom rules
                  </text>
                )}
              </g>
            ))}
          </svg>
          <p className="md:hidden mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-primary-ink flex items-center gap-2" aria-hidden="true">
            Swipe for the full lab <span className="inline-block animate-pulse">→</span>
          </p>
          <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
            <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-primary" /> attack path</span>
            <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-foreground/40" /> telemetry</span>
            <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-tertiary" /> alerts &amp; cases</span>
            <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-accent" /> enrichment &amp; response</span>
          </figcaption>
        </FadeIn>

        {/* Every part, in plain words */}
        <h3 className="mt-14 mb-6 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">What each part does</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NODES.map((n) => (
            <li key={n.id} className="flex gap-4 border border-foreground/5 bg-surface/40 p-4">
              <Logo name={n.logo} size={40} />
              <div className="min-w-0">
                <p className="font-display text-sm font-black uppercase tracking-tight text-foreground">{n.title}</p>
                <p className="mt-1 text-sm text-foreground/60 font-light leading-relaxed">{n.plain}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
