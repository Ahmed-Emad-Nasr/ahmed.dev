/* The Teaching section. Its numbers are also stated in experience.ts — keep them in step.

   ═══ data/teaching.ts → components/home/TeachingSection.tsx (#teaching) ═══
   TEACHING_STATS → the big numbers;  DIPLOMA → the curriculum card
   (modules: n = number shown, title, detail);  TEACHING_ROLES → the
   "where it was taught" cards. Add an item to any array and it appears.
   TEACHING_EN bundles them with the section's own words; the Arabic page
   (/ar/teaching) uses the same shape from data/teaching-ar.ts — a change
   here (a new module, a new place) should be made there too. */

import { AUDIENCE, AUDIENCE_LABEL, fullCount, YOUTUBE_CHANNEL_URL } from "@/lib/shared";
import { TESTIMONIALS } from "@/data/testimonials";

type TeachingStat = { value: string; label: string };

export const TEACHING_STATS: TeachingStat[] = [
  { value: "300+", label: "Students at AMIT & NTI (combined)" },
  /* Counted from data/testimonials.ts — the recommendations are quoted on the home page, the students on /teaching */
  { value: String(TESTIMONIALS.length), label: "Written testimonials" },
  { value: "1st", label: "Of 250 instructors · GDG" },
  { value: AUDIENCE_LABEL.youtubeViews, label: "YouTube views" },
];

/* The SOC & Cybersecurity Diploma — the curriculum taught end to end */
export const DIPLOMA = {
  title: "SOC & Cybersecurity Diploma",
  hours: 160,
  summary:
    "A complete 160-hour practitioner path from network & OS foundations to offensive exploitation, incident handling, and live SIEM/SOC alert triage. Written and taught as one structured track with hands-on labs after every session.",
  modules: [
    { n: "01", title: "Networking Foundations (CCNA) — TCP/IP, VLANs, OSPF, ACLs, NAT & Packet Analysis", detail: "8 sessions" },
    { n: "02", title: "Linux & Windows Admin (RH124/RH134) — Permissions, Services, Hardening & Sysmon/auditd", detail: "6 sessions" },
    { n: "03", title: "CompTIA Security+ Core — Cryptography, IAM/PAM, Cloud Security, Vuln Management & GRC", detail: "12 sessions" },
    { n: "04", title: "Offensive Security & Web Pentesting (eJPT / OWASP Top 10) — Recon, Burp Suite, SQLi, XSS & Pivoting", detail: "8 sessions" },
    { n: "05", title: "SANS SEC450 & SEC504 — SOC Architecture, NIST 800-61 IR, Memory/Disk DFIR & Malware Triage", detail: "8 sessions" },
    { n: "06", title: "SIEM & Detection Engineering — Splunk SPL, IBM QRadar, Wazuh Custom Rules & Capstone SOC Lab", detail: "Labs + capstone" },
  ],
  /* What every session ends with */
  format: ["Structured slide deck & notes", "Key security terminology", "Guided hands-on lab", "Practical assessment & quiz"],
};

type TeachingRole = {
  /** The organisation — also the key of its logo (data/logos.ts) */
  org: string;
  /** Shown instead of `org` where the page is in another language */
  orgLabel?: string;
  role: string;
  period: string;
  link?: string;
  topics: string;
  /** Results, each short enough for a chip */
  results: string[];
};

export const TEACHING_ROLES: TeachingRole[] = [
  {
    org: "AMIT Learning",
    role: "Cybersecurity Instructor",
    period: "Now",
    link: "https://amit-learning.com/",
    topics: "Authoring and teaching the 160-hour cybersecurity track: CCNA Networking, Red Hat Linux (RH124/RH134), CompTIA Security+, SANS SEC450/SEC504, Splunk/QRadar/Wazuh SIEM labs, Web VAPT, IAM and GRC.",
    results: ["160-hour track", "Red Hat RH124/RH134 cohorts", "Student testimonials"],
  },
  {
    org: "National Telecommunication Institute (NTI)",
    role: "Cybersecurity Instructor",
    period: "Now",
    link: "https://nti.sci.eg/",
    topics: "Delivering intensive hands-on training in Linux System Administration, Enterprise Networking, SOC Operations, Alert Triage, and Web/Network Penetration Testing.",
    results: ["42+ students", "85%+ pass rate", "120+ lab hours"],
  },
  {
    org: "iSchool",
    role: "Tutor Assistant & Lab Coordinator",
    period: "Now",
    link: "https://ischool-tech.com/",
    topics: "Managing technical lab instruction, student mentoring, and session operations across DEPI and DECI coding and technology initiatives.",
    results: ["470+ students supported", "DEPI & DECI cohorts"],
  },
  {
    org: "Google Developer Groups (GDG)",
    role: "Cybersecurity Instructor & CTF Co-Designer",
    period: "2024 – 2025",
    link: "https://gdg.community.dev/",
    topics: "Structured cybersecurity workshops covering network security, Linux, web vulnerabilities and blue-team fundamentals, plus university CTF challenge design.",
    results: ["35+ sessions", "120+ learners", "1st of 250 instructors", "10+ CTF challenges"],
  },
  {
    org: "IEEE Benha",
    role: "Technical Instructor",
    period: "2023",
    link: "https://www.ieee.org/",
    topics: "C and Python programming instruction and embedded systems mentoring for student engineering teams building autonomous Arduino robotic cars.",
    results: ["5+ teams", "20+ students", "2nd Place IEEE GHOSTEC"],
  },
  {
    org: "YouTube — @AhmedEmadNasr-0x3omda",
    role: "Creator — Security Walkthroughs & Labs",
    period: "Ongoing",
    link: YOUTUBE_CHANNEL_URL,
    topics: "Step-by-step video walkthroughs on Wazuh SIEM deployment, TryHackMe SOC simulations, WannaCry & PDF malware analysis, Burp Suite, and GRC fundamentals.",
    results: [`${AUDIENCE_LABEL.youtubeSubscribers} subscribers`, `${fullCount(AUDIENCE.youtubeViews)} views`, `${AUDIENCE.youtubeVideos} videos`],
  },
];

/* ─── The section's own words, and the whole content in one object ─── */

type TeachingUi = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  description: string;
  /** The chip beside the title: value and label */
  hoursChip: { value: string; label: string };
  /** "Curriculum // 160 hours" */
  curriculumLabel: string;
  /** Screen-reader word before a module number: "Module" → "Module 01: " */
  moduleLabel: string;
  sessionEndsWith: string;
  /** The period value that marks a current role (highlighted) */
  now: string;
  /** The "training for your team" box at the end */
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
    /** The e-mail it opens: subject and the first lines of the body */
    subject: string;
    body: string;
    /** A second link next to the button: the training page (/training) */
    more?: { label: string; href: string };
  };
};

export type TeachingContent = {
  lang: "en" | "ar";
  stats: TeachingStat[];
  diploma: typeof DIPLOMA;
  roles: TeachingRole[];
  ui: TeachingUi;
};

export const TEACHING_EN: TeachingContent = {
  lang: "en",
  stats: TEACHING_STATS,
  diploma: DIPLOMA,
  roles: TEACHING_ROLES,
  ui: {
    eyebrow: "Ahmed Emad Nasr // Cybersecurity Instructor",
    titleA: "Pass it",
    titleB: "Forward.",
    description:
      "I teach security as well as practise it. Below: the full course I wrote, what each module covers, and where I have taught it — with the results.",
    hoursChip: { value: `${DIPLOMA.hours}h`, label: "Curriculum written" },
    curriculumLabel: `Curriculum // ${DIPLOMA.hours} hours`,
    moduleLabel: "Module",
    sessionEndsWith: "Every session ends with",
    now: "Now",
    cta: {
      eyebrow: "Training // For your team",
      title: "Need this training for your team?",
      text: "The diploma, or any module of it — for a company SOC team, a university, or a training centre. In English or Arabic, on site in Cairo or Benha, or online.",
      button: "Request a training",
      subject: "Cybersecurity training request",
      body: "Hi Ahmed,\n\nOrganisation:\nTopic / modules:\nNumber of trainees and their level:\nOn site or online:\nPreferred dates:\n",
      more: { label: "Formats & details", href: "/training" },
    },
  },
};
