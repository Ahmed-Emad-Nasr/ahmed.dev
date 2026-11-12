/*
 * The "about the work" sections — taken from Sensei-Dev's layout, with
 * Ahmed's own data. Nothing here is a new claim: every line repeats what
 * the experience, cases, certifications or teaching sections already prove.
 *
 * ═══ data/about.ts → components/home/{ToolsSection,UsesSection,PathSection,NowSection,FaqSection}.tsx ═══
 *   TOOL_GROUPS → "Tools of the Trade." (#tools) — built from data/skills.ts,
 *                 so the CV skill list and this section never disagree
 *   USES        → "Daily Drivers." — what each part of a job is done with
 *   PATH        → "The Path." — one line per year, from data/experience.ts
 *   NOW         → "Right Now." — update when a role starts or ends
 *   FAQ         → "Fair Questions." (#faq) — the accordion before Contact
 *   PROCESS     → "Risk to Response." (#process) — how a security job runs
 *   TICKER      → the drifting band of words between sections
 */

import { skillGroups } from "@/data/skills";

/* One Japanese label per skill group (data/skills.ts ids) */
const GROUP_JP: Record<string, string> = {
  grc: "統治",
  siem: "監視",
  ir: "対応",
  forensics: "鑑識",
  identity: "認証",
  data: "データ",
  vuln: "強化",
  cloud: "雲",
  intel: "脅威",
  network: "網",
  frameworks: "枠組",
  automation: "自動",
};

export const TOOL_GROUPS = skillGroups
  .filter((g) => g.id !== "soft")
  .map((g) => ({ id: g.id, title: g.label, japanese: GROUP_JP[g.id] ?? "技", items: g.items }));

export const USES = [
  { id: "detect", title: "Detect", japanese: "検知", items: ["Wazuh", "Splunk", "Suricata", "Zeek", "Sysmon"] },
  { id: "investigate", title: "Investigate", japanese: "調査", items: ["Volatility", "Autopsy", "FTK Imager", "Wireshark", "YARA"] },
  { id: "govern", title: "Govern", japanese: "統治", items: ["ISO 27001", "NIST CSF", "PCI DSS", "MITRE ATT&CK"] },
  { id: "automate", title: "Automate", japanese: "自動", items: ["Python", "Bash", "PowerShell", "Linux"] },
] as const;

export const PATH = [
  { year: "2022", title: "Started CS", detail: "Began B.Sc. Computer Science (Information Security & Digital Forensics) at Benha University." },
  { year: "2023", title: "Huawei & IEEE", detail: "Network & Cloud Security intern at Huawei; technical instructor and committee member at IEEE." },
  { year: "2024", title: "Teaching security", detail: "Cybersecurity instructor at GDG: 35+ sessions, 10+ CTF challenges, ranked 1st of 250 instructors." },
  { year: "2025", title: "Offense & response", detail: "Penetration Tester trainee at ITI and Incident Response Analyst intern at DEPI." },
  { year: "2026", title: "Graduated with distinction", detail: "Benha University, GPA 3.78 / 4.0 — ranked 8th of 900 in the department." },
  { year: "2026", title: "Banque Misr & instructor", detail: "Information Security intern at Banque Misr; part-time cybersecurity instructor at NTI and AMIT Learning." },
] as const;

export const NOW = [
  { label: "Teaching", detail: "Part-time cybersecurity instructor at AMIT Learning (since Sep 2026) and NTI (since Feb 2026)." },
  { label: "Coordinating", detail: "Tutor assistant & coordinator at iSchool: technical labs for DEPI and DECI programs." },
  { label: "Publishing", detail: "Security write-ups in the case library and walkthroughs on YouTube." },
  { label: "Open to", detail: "InfoSec roles: Officer, Engineer, GRC, SOC, IR/DFIR, IAM and Security Education." },
] as const;

export const FAQ = [
  { q: "Which roles are you open to?", a: "Information security roles — Officer, Engineer, GRC, SOC, IR/DFIR, IAM and security education." },
  { q: "Where are you based?", a: "Benha, Egypt." },
  { q: "Where is the proof of the work?", a: "In the case library: every case opens with a plain summary, with the reports, screenshots and MITRE ATT&CK mapping underneath." },
  { q: "Do you teach?", a: "Yes — 300+ students at AMIT Learning and NTI, plus 35+ sessions and 10+ CTF challenges with GDG." },
  { q: "Which certifications do you hold?", a: "eJPT v2, CCNA, HCIA-Datacom, HCIA-Cloud, CCEP and more — every scan is in the proof gallery." },
  { q: "How do I reach you?", a: "Email, WhatsApp or LinkedIn — all linked in the contact section below." },
] as const;

/* The NIST CSF functions, folded into four steps */
export const PROCESS = [
  { id: "govern", index: "01", title: "Govern", japanese: "統治", description: "Assets, risks and controls mapped against ISO 27001 and NIST CSF. Every gap gets an owner, a priority and a fix." },
  { id: "protect", index: "02", title: "Protect", japanese: "防御", description: "Least privilege, hardened baselines, encrypted data — IAM, PAM and CIS Benchmarks before anything else." },
  { id: "detect", index: "03", title: "Detect", japanese: "検知", description: "Baselines, logs and alerts. Know what normal looks like, then map what isn't to ATT&CK." },
  { id: "respond", index: "04", title: "Respond", japanese: "対応", description: "Contain, eradicate, recover — NIST 800-61, not instinct — then a report with the root cause and the fix." },
] as const;

export const TICKER = ["統治", "防御", "検知", "対応", "調査", "FROM THE RISK REGISTER TO THE ROOT CAUSE"];
