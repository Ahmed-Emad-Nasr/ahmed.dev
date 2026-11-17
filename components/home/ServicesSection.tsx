/*
 * ═══ components/home/ServicesSection.tsx — "What I Do." (#services) ═══
 *
 * One section for both the roles I fit and the work someone can hire me for
 * (they used to be two sections with the same title). A grid of cards right
 * under the hero. Each card = one role: icon, area, title, pitch, focus
 * chips, deliverable, numbered "Proof" links, credentials, an "Ask about it"
 * link that opens the visitor's mail app, and a CV download button.
 *
 * HOW TO EDIT
 *   • Change a card's text → its entry in the ROLES array below.
 *   • Add a card → copy a whole { id: …, … } entry in ROLES and change it.
 *     `icon` = any icon from lucide-react (import it at the top).
 *   • Remove a card → delete its entry.
 *   • service → the id of the matching entry in data/services.ts: gives the
 *     card its small Japanese label and the e-mail subject. The services
 *     themselves are also listed for Google (OfferCatalog in app/page.tsx).
 *   • Proof links (3 kinds, pick one per link):
 *       { label, href: "#work" }                → jumps on the home page
 *       { label, href: "/blog/<case-id>" }      → another page
 *       { label, params: { kind: "investigation" } } → opens the case library with the
 *                                                 case filters pre-set
 *   • Grid columns → "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" in the JSX.
 *
 * Counts like "N LetsDefend alerts investigated" are computed from
 * data/cases.ts (below), so they update by themselves when you add cases.
 * This is a server component: the case data is read at build time and never
 * sent to the browser.
 */

import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardCheck,
  Radar,
  KeyRound,
  Download,
  Bug,
  GraduationCap,
  Mail,
} from "lucide-react";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import CaseFilterLink from "@/components/blog/CaseFilterLink";
import { caseEvidenceLibrary } from "@/data/cases";
import { CV_PDF_HREF, caseKindOf, normalizePublicHref } from "@/lib/shared";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { KanjiWatermark } from "@/components/ui/kit";
import { SERVICES, type Service } from "@/data/services";
import { PROFILE } from "@/data/profile";

/* Case id → case title, so proof links show the real title from data/cases.ts */
const TITLE = new Map(caseEvidenceLibrary.map((c) => [c.id, c.title]));
/* Live counts used in proof labels */
const letsDefend = caseEvidenceLibrary.filter(
  (c) => c.platform === "LetsDefend",
).length;
const forensics = caseEvidenceLibrary.filter(
  (c) => c.category === "Digital Forensics",
).length;
const malware = caseEvidenceLibrary.filter(
  (c) => caseKindOf(c) === "investigation" && c.category === "Malware Analysis",
).length;

/* "Ask about it": the visitor's mail app, with a subject and a short form */
const BODY = "Hi Ahmed,\n\nOrganisation:\nWhat we need:\nTimeline:\n";
const mailto = (subject: string) =>
  `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(BODY)}`;
const SERVICE = new Map(SERVICES.map((s) => [s.id, s]));

/* The shape of one card — every entry in ROLES must have these fields */
type Proof = { label: string; href?: string; params?: Record<string, string> };
type Role = {
  id: string;
  title: string;
  serviceArea: string;
  icon: typeof Radar;
  pitch: string;
  focus: string[];
  deliverable: string;
  proof: Proof[];
  credential: string;
  service?: Service["id"];
};

/* ═══ THE CARDS — edit / add / remove entries here (shown in this order) ═══ */
const ROLES: Role[] = [
  {
    id: "information-security-officer",
    title: "Information Security Officer",
    serviceArea: "Security Governance & Risk",
    icon: ClipboardCheck,
    pitch:
      "Support a risk-led security program: governance, compliance, control ownership, remediation tracking and audit-ready evidence.",
    focus: ["ISO 27001", "PCI DSS", "NIST CSF", "Control Assurance"],
    deliverable: "Risk register + control assurance report",
    proof: [
      { label: "Banque Misr - GRC gaps across 3 units", href: "#experience" },
      { label: "VerifAI 360 - compliance and risk platform", href: "#work" },
      {
        label: "PCI DSS & GDPR detection coverage",
        href: "/blog/3omda-custom-detection-rules",
      },
    ],
    credential: "ISO 27001 · PCI DSS · COBIT · SWIFT",
    service: "grc",
  },
  {
    id: "information-security-engineer",
    title: "Information Security Engineer",
    serviceArea: "Detection & System Hardening",
    icon: Radar,
    pitch:
      "Turn security requirements into working controls across SIEM, endpoint telemetry, network detection, CIS hardening and cloud services.",
    focus: ["Wazuh SIEM", "Suricata & Zeek", "Sysmon", "CIS Benchmarks"],
    deliverable: "Tuned detection rules + hardened baseline",
    proof: [
      {
        label: "Wazuh + Sysmon detection environment",
        href: "/blog/soc-env-depi-r3-project",
      },
      {
        label: "Custom Wazuh detection rule pack",
        href: "/blog/3omda-custom-detection-rules",
      },
      { label: "AWS KMS security lab", href: "/blog/aws-kms-security" },
    ],
    credential: "Wazuh · Suricata · Sysmon · YARA · AWS KMS",
    service: "soc",
  },
  {
    id: "grc",
    title: "GRC / Compliance Analyst",
    serviceArea: "Governance, Risk & Compliance",
    icon: ClipboardCheck,
    pitch:
      "Gap assessments against ISO 27001, PCI DSS, NIST CSF, COBIT and SWIFT CSP - then the policies and a remediation plan teams can follow.",
    focus: ["Gap Assessments", "Remediation Planning", "COBIT & SWIFT", "GDPR"],
    deliverable: "Gap report + remediation plan",
    proof: [
      { label: "Banque Misr - GRC gaps across 3 units", href: "#experience" },
      { label: "VerifAI 360 - my GRC platform", href: "#work" },
      {
        label: "PCI DSS & GDPR tags in my detection rules",
        href: "/blog/3omda-custom-detection-rules",
      },
    ],
    credential: "Banque Misr internship certificate",
    service: "grc",
  },
  {
    id: "soc",
    title: "SOC Analyst (L1/L2)",
    serviceArea: "Security Operations & Triage",
    icon: Radar,
    pitch:
      "Alert triage, log analysis and SIEM tuning - separating real attacks from noise, writing a clear verdict, and building the rule that catches the next one.",
    focus: ["Alert Triage", "Wazuh & Splunk", "ELK Stack", "Sysmon"],
    deliverable: "Triage notes + tuned SIEM rules",
    proof: [
      {
        label: `${letsDefend} LetsDefend alerts investigated`,
        params: { q: "LetsDefend" },
      },
      {
        label:
          TITLE.get("3omda-custom-detection-rules") ?? "Custom Wazuh rules",
        href: "/blog/3omda-custom-detection-rules",
      },
      {
        label: TITLE.get("soc-env-depi-r3-project") ?? "Mini SOC capstone",
        href: "/blog/soc-env-depi-r3-project",
      },
    ],
    credential: "TryHackMe SOC Level 1 & 2 · DEPI IR track",
    service: "soc",
  },
  {
    id: "dfir",
    title: "IR / DFIR & Malware Analyst",
    serviceArea: "Incident Response, DFIR & Malware",
    icon: Bug,
    pitch:
      "NIST 800-61 incident response: memory, disk, registry and browser artifacts to a timeline; malware samples dissected in an isolated lab to IOCs and YARA.",
    focus: ["NIST 800-61", "Volatility & Autopsy", "YARA", "FakeNet-NG"],
    deliverable: "IR report + forensic timeline + YARA/IOCs",
    proof: [
      {
        label: `${forensics} digital forensics cases`,
        params: { cat: "Digital Forensics" },
      },
      {
        label: `${malware} malware analysis reports`,
        params: { kind: "investigation", cat: "Malware Analysis" },
      },
      {
        label: TITLE.get("malware-analysis-wannacry") ?? "WannaCry analysis",
        href: "/blog/malware-analysis-wannacry",
      },
    ],
    credential: "INE Incident Handling & Response Professional · eJPT",
    service: "dfir",
  },
  {
    id: "iam",
    title: "IAM & Data Security Analyst",
    serviceArea: "IAM, PAM & Data Protection",
    icon: KeyRound,
    pitch:
      "Access reviews, PAM and least privilege; data classification, DLP and encryption - ensuring the right people reach the right data and nothing leaks.",
    focus: ["IAM & PAM", "Least Privilege", "DLP", "AWS KMS"],
    deliverable: "Access review + control gap report",
    proof: [
      {
        label: "Banque Misr - IAM, PAM & DevSecOps audit",
        href: "#experience",
      },
      {
        label: TITLE.get("soc257-pdf") ?? "Compromised VPN account",
        href: "/blog/soc257-pdf",
      },
      {
        label: TITLE.get("usb-forensics-report") ?? "PII leak via USB",
        href: "/blog/usb-forensics-report",
      },
    ],
    credential: "Banque Misr internship · AWS KMS lab",
  },
  {
    id: "cybersecurity-instructor",
    title: "Cybersecurity Instructor",
    serviceArea: "Security Training & Labs",
    icon: GraduationCap,
    pitch:
      "Make complex security concepts practical: structured curricula, hands-on labs, CTF challenges and mentoring for beginners and practitioners.",
    focus: ["Curriculum Design", "Hands-On Labs", "CTF Design", "Mentoring"],
    deliverable: "Structured course + hands-on labs",
    proof: [
      { label: "300+ students at AMIT Learning & NTI", href: "/teaching" },
      { label: "35+ GDG sessions and CTF challenges", href: "#experience" },
      { label: "Security walkthroughs", href: "/blog#videos" },
    ],
    credential: "CCEP · SOC & Cybersecurity Diploma (160h)",
    service: "training",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      {/* Old links to #roles (the section's name before the merge) land here */}
      <span id="roles" className="absolute top-0" aria-hidden="true" />
      {/* … and old links to #process (Risk to Response, removed) */}
      <span id="process" className="absolute top-0" aria-hidden="true" />
      <KanjiWatermark chars="役務" side="left" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="services-title"
          eyebrow="Services // Roles & work"
          japanese="役務"
          titleA="What I"
          titleB="Do."
          description="Each card is a role I work in and the work you can hire me for in it. Each one ends with something you keep: a report, a running system or a trained team. Full-time, project or course; on site in Cairo or Benha, or online."
        />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {ROLES.map((r, idx) => {
          const Icon = r.icon;
          const service = r.service ? SERVICE.get(r.service) : undefined;
          return (
            /* FadeIn = slide-up entrance when scrolled into view (each card 0.1s later).
               TiltCard = 3D tilt on hover. CardEffects = the red top line / glow. */
            <FadeIn y={36} duration={0.7} delay={idx * 0.1} key={r.id}>
              <TiltCard className="group spotlight spotlight-blue relative h-full flex flex-col bg-surface/60 border border-foreground/5 p-7 hover:border-tertiary/40 transition-colors duration-300 overflow-hidden">
                <CardEffects index={idx + 1} tone="blue" topLine />
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-tertiary/10 border border-tertiary/30">
                    <Icon
                      size={18}
                      className="text-tertiary transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {service && (
                    <span className="jp-eyebrow text-[0.6875rem] text-foreground/25" lang="ja" aria-hidden="true" data-jp={service.japanese} />
                  )}
                </div>
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-tertiary mb-1.5">
                  {r.serviceArea}
                </span>
                <h3 className="font-display text-xl font-black uppercase tracking-tight text-foreground mb-3 leading-tight">
                  {r.title}
                </h3>
                <p className="text-sm text-foreground/60 font-light leading-relaxed mb-5">
                  {r.pitch}
                </p>
                <ul
                  className="mb-5 flex flex-wrap gap-2"
                  aria-label={`${r.title} focus areas`}
                >
                  {r.focus.map((focus) => (
                    <li
                      key={focus}
                      className="px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-tertiary bg-tertiary/10 border border-tertiary/20"
                    >
                      {focus}
                    </li>
                  ))}
                </ul>
                <div className="mb-5 py-2.5 px-3 border-l-2 border-accent bg-accent/5 font-mono text-[0.625rem] text-accent tracking-[0.15em] uppercase">
                  → {r.deliverable}
                </div>
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-foreground/60 mb-2">
                  Proof
                </span>
                <ul className="grid gap-2 mb-6">
                  {r.proof.map((p, i) => {
                    const cls =
                      "group/p flex items-start gap-2 text-sm text-foreground/80 hover:text-primary-ink transition-colors";
                    const inner = (
                      <>
                        <span className="mt-0.5 font-mono text-[0.5625rem] font-bold text-primary-ink tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{p.label}</span>
                        <ArrowUpRight
                          size={13}
                          className="mt-0.5 shrink-0 opacity-40 transition-all duration-300 group-hover/p:opacity-100 group-hover/p:translate-x-[1.7px] group-hover/p:-translate-y-[1.7px]"
                          aria-hidden="true"
                        />
                      </>
                    );
                    /* Pick the right link type: filter link / same-page anchor / other page */
                    return (
                      <li key={p.label}>
                        {p.params ? (
                          <CaseFilterLink params={p.params} className={cls}>
                            {inner}
                          </CaseFilterLink>
                        ) : p.href?.startsWith("#") ? (
                          <a href={p.href} className={cls}>
                            {inner}
                          </a>
                        ) : (
                          <Link prefetch={false} href={p.href ?? "/"} className={cls}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto pt-4 border-t border-foreground/5">
                  <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-accent leading-snug">
                    {r.credential}
                  </span>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <a
                      href={mailto(service?.subject ?? r.title)}
                      className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/60 hover:text-tertiary transition-colors duration-300"
                    >
                      <Mail size={12} aria-hidden="true" /> Ask about it
                      <span className="sr-only"> — {r.title}</span>
                    </a>
                    <a
                      href={normalizePublicHref(CV_PDF_HREF)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-2 border border-foreground/10 text-foreground/60 hover:text-white hover:bg-primary hover:border-primary transition-colors"
                      aria-label={`Download the CV (${r.title})`}
                      title="Download the CV"
                    >
                      <Download size={13} />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          );
        })}
      </div>
      </div>
    </section>
  );
}
