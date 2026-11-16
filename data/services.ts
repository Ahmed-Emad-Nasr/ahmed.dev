/*
 * ═══ data/services.ts — "What I Do." (#services on the home page) ═══
 *
 * The work someone can hire me for, as fixed pieces of work: what it is,
 * what it is done with, what they get at the end, and one link to the proof
 * on this site. Shown by components/home/ServicesSection.tsx.
 *
 * TO EDIT: change the text of an entry. TO ADD: copy a whole { … } entry.
 *   japanese    → the small label in the card's corner
 *   deliverable → what the client holds at the end (one short line)
 *   proof       → a page or section that shows I have done it:
 *                 "/blog/<case-id>", "/training", "#experience" …
 *   subject     → the subject line of the e-mail the "Ask about it" link opens
 */

export type Service = {
  id: string;
  title: string;
  japanese: string;
  description: string;
  stack: string[];
  deliverable: string;
  proof: { label: string; href: string };
  subject: string;
};

export const SERVICES: Service[] = [
  {
    id: "grc",
    title: "GRC Gap Assessment",
    japanese: "監査",
    description:
      "Your controls measured against ISO 27001, PCI DSS or NIST CSF: what is in place, what is missing, and what to fix first — written so management can act on it.",
    stack: ["ISO 27001", "PCI DSS", "NIST CSF", "Risk register", "Policies"],
    deliverable: "Gap report + roadmap",
    proof: { label: "Gap assessments at Banque Misr", href: "#experience" },
    subject: "GRC gap assessment",
  },
  {
    id: "soc",
    title: "SOC on Wazuh",
    japanese: "監視",
    description:
      "A working open-source SOC for a small team: Wazuh SIEM, Suricata and Sysmon, with detection rules written for your own logs instead of noise.",
    stack: ["Wazuh", "Suricata", "Sysmon", "Custom rules", "MITRE ATT&CK"],
    deliverable: "Running SIEM + rule pack",
    proof: { label: "My 52 custom Wazuh rules", href: "/blog/3omda-custom-detection-rules" },
    subject: "SOC / Wazuh setup",
  },
  {
    id: "dfir",
    title: "Incident Investigation",
    japanese: "調査",
    description:
      "A suspicious alert, e-mail, file or machine looked at properly: what happened, how far it got, what it touched, and how to close the door.",
    stack: ["Alert triage", "Memory & disk", "Malware analysis", "IOCs", "YARA"],
    deliverable: "Incident report + IOCs",
    proof: { label: "The investigations, by technique", href: "/attack" },
    subject: "Incident investigation",
  },
  {
    id: "training",
    title: "Training & Workshops",
    japanese: "研修",
    description:
      "The SOC & Cybersecurity Diploma, one module of it, or a short workshop — for a company team, a university or a training centre, in English or Arabic.",
    stack: ["SOC", "Security+", "SIEM labs", "English / Arabic"],
    deliverable: "Course + hands-on labs",
    proof: { label: "Formats and modules", href: "/training" },
    subject: "Cybersecurity training request",
  },
];
