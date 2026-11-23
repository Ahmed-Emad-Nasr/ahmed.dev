/* The experience / education timeline (sorted by date in data/portfolio-data.ts)

   ═══ data/experience.ts — every job, volunteer role and course ═══
   Feeds: the home page Experience section, and the JSON-LD.

   HOW TO ADD AN ENTRY: copy a { … } block below (order here doesn't matter —
   it's sorted by date):
     tag             → the role / course title
     kind            → "work" | "volunteer" | "education"  (keep `as const`)
     subTag          → organisation name. MUST match the key in ROLE_INTRO /
                       ROLE_PROOF in data/portfolio-data.ts if you want its
                       intro line, Japanese title, city and proof buttons.
     subTagHyperlink → the organisation's website
     desc            → bullet points separated by " • " (split into a list)
     startDate       → "YYYY-MM-DD";  endDate → leave out for "Present"
     skills          → chips;  certificateUrl → optional link
     hidden: true    → keep the entry in the data but leave it off the site
   Note: the home Experience section shows education only for Benha
   University (filter in data/portfolio-data.ts).

   FOLLOWS THE CV BY ITSELF: the jobs and volunteer roles read from the CV
   PDF (data/cv-from-pdf.ts, see scripts/sync-cv.mjs) are merged in at the
   end of this file — a role already here takes the CV's dates (so a job
   that ends in the CV ends here too); a role that is only in the CV is
   added with its bullet points. Entries here are never removed. */

import { CV_FROM_PDF, type CvFromPdfEntry } from "@/data/cv-from-pdf";

export type ExperienceItem = {
  tag: string;
  kind: "work" | "volunteer" | "education";
  subTag: string;
  subTagHyperlink: string;
  desc: string;
  startDate: string;
  endDate?: string;
  showDate?: boolean;
  skills: readonly string[];
  certificateUrl?: string;
  hidden?: boolean;
  /** City, for a role added from the CV */
  place?: string;
};

const HAND_WRITTEN: readonly ExperienceItem[] = [
  {
    tag: "Cybersecurity Instructor (Part-Time)",
    kind: "work",
    subTag: "AMIT Learning",
    subTagHyperlink: "https://amit-learning.com/",
    desc: "Authored a 160-hour cybersecurity curriculum and teach it across Networking (CCNA), Linux Administration, CompTIA Security+, and SANS SEC450 / SEC504 blue-team tracks — part of the 300+ students taught across AMIT & NTI. • Designed and supervise hands-on labs covering SIEM alert triage (Splunk, QRadar, Wazuh), penetration testing, IAM/PAM, and GRC gap assessments; students' own feedback is quoted on the Teaching page. • Delivered Red Hat System Administration I & II (RH124/RH134) training cohorts in collaboration with NTI.",
    startDate: "2026-02-01",
    showDate: true,
    skills: ["Security Training", "Curriculum Design", "SOC Operations", "Splunk & Wazuh", "Linux (RH124)", "Security+", "SANS SEC450/504", "GRC"],
    certificateUrl: "https://amit-learning.com/",
  },
  {
    tag: "Cybersecurity Instructor (Part-Time)",
    kind: "work",
    subTag: "National Telecommunication Institute (NTI)",
    subTagHyperlink: "https://nti.sci.eg/",
    desc: "Instructed 42+ students across Linux System Administration, Enterprise Networking, SOC Fundamentals, and Web/Network Penetration Testing (VAPT), achieving an 85%+ pass rate. • Delivered 120+ instructional hours of guided offensive and defensive labs, mentoring students through real-world attack simulations, log analysis, and incident reporting.",
    startDate: "2026-02-01",
    showDate: true,
    skills: ["SOC Fundamentals", "VAPT", "Web Penetration Testing", "Linux Administration", "Network Security", "Lab Instruction"],
    certificateUrl: "https://nti.sci.eg/",
  },
  {
    tag: "Information Security Intern",
    kind: "work",
    subTag: "Banque Misr",
    subTagHyperlink: "https://www.banquemisr.com/",
    desc: "Assessed Governance, Risk, and Compliance (GRC) gaps across 3 banking units against ISO/IEC 27001, PCI DSS, COBIT, and SWIFT CSP frameworks, delivering 6+ prioritized remediation actions. • Audited enterprise security architectures across Identity & Access Management (IAM), Privileged Access Management (PAM), Database Activity Monitoring (DAM), and DevSecOps pipelines, surfacing 5+ control gaps with actionable remediation plans. • Evaluated SIEM, DFIR, and VAPT operational workflows, identifying 9 visibility and process gaps; authored a dark-web threat intelligence monitoring proposal adopted for brand protection.",
    startDate: "2026-07-01",
    endDate: "2026-09-01",
    showDate: true,
    skills: ["ISO 27001", "PCI DSS", "COBIT", "SWIFT CSP", "IAM & PAM", "DAM", "DevSecOps Audit", "SIEM & DFIR Workflows"],
    certificateUrl: "https://www.banquemisr.com/",
  },
  {
    tag: "Incident Response Analyst Intern",
    kind: "work",
    subTag: "Digital Egypt Pioneers Initiative (DEPI)",
    subTagHyperlink: "https://www.depi.gov.eg/",
    desc: "Triaged and investigated 30+ real-world SOC alerts following the NIST SP 800-61 incident response lifecycle on TryHackMe and LetsDefend, maintaining a 95%+ true/false-positive accuracy rate. • Engineered a centralized detection lab integrating Wazuh SIEM, Suricata NIDS, VirusTotal API, Sysmon, and YARA rules, increasing endpoint and network log enrichment by 25%. • Implemented CIS Benchmark system hardening across Windows and Linux endpoints, achieving 90%+ compliance against baseline security controls.",
    startDate: "2025-06-01",
    endDate: "2026-06-01",
    showDate: true,
    skills: ["NIST 800-61", "SOC Alert Triage", "Wazuh SIEM", "Suricata", "Sysmon", "YARA", "CIS Benchmarks", "Digital Forensics"],
    certificateUrl: "https://www.depi.gov.eg/",
  },
  {
    tag: "Tutor Assistant & Coordinator (Part-Time)",
    kind: "work",
    subTag: "iSchool",
    subTagHyperlink: "https://ischool-tech.com/",
    desc: "Coordinated technical lab instruction, attendance, and session logistics for 470+ students across DEPI and DECI coding and technology programs. • Resolved technical lab environment issues and streamlined communication between instructors, students, and program coordinators to improve weekly session completion rates.",
    startDate: "2025-07-01",
    showDate: true,
    skills: ["Technical Mentoring", "Lab Coordination", "Classroom Operations", "Student Support"],
    certificateUrl: "https://ischool-tech.com/",
  },
  {
    tag: "Penetration Tester Trainee",
    kind: "work",
    subTag: "Information Technology Institute (ITI)",
    subTagHyperlink: "https://www.iti.gov.eg/",
    desc: "Identified and exploited 15+ network and web application vulnerabilities in CTF and lab environments, mapping privilege escalation and lateral movement chains to MITRE ATT&CK. • Completed all INE eJPT v2 penetration testing labs (reconnaissance, enumeration, web attacks, exploitation, and network pivoting) and passed the certified exam with a 90% score. • Solved 100% of assigned labs across PortSwigger Web Security Academy (29 labs), CyberTalents, and Hack The Box.",
    startDate: "2025-05-01",
    endDate: "2026-01-01",
    showDate: true,
    skills: ["Penetration Testing (eJPT)", "OWASP Top 10", "Burp Suite", "Metasploit", "Privilege Escalation", "Pivoting", "MITRE ATT&CK"],
    certificateUrl: "https://www.iti.gov.eg/",
  },
  {
    tag: "Network & Cloud Security Intern",
    kind: "work",
    subTag: "Huawei",
    subTagHyperlink: "https://www.huawei.com/",
    desc: "Studied enterprise network and cloud security architectures, earning Huawei HCIA-Datacom V1.0, HCIA-Cloud Computing V5.0, and HCCDA-Tech Essentials certifications with exam scores above 95%. • Configured, simulated, and hardened 10+ enterprise network topologies in Huawei eNSP covering OSPF, VLANs, STP, EtherChannel, ACLs, NAT, and IPsec VPNs.",
    startDate: "2023-07-01",
    endDate: "2023-09-01",
    showDate: true,
    skills: ["HCIA-Datacom", "HCIA-Cloud", "Huawei eNSP", "OSPF & VLANs", "ACLs & Firewalls", "Cloud Virtualization"],
    certificateUrl: "https://www.huawei.com/",
  },
  {
    tag: "Cybersecurity Instructor & Technical Trainer",
    kind: "volunteer",
    subTag: "Google Developer Groups (GDG)",
    subTagHyperlink: "https://gdg.community.dev/",
    desc: "Delivered 35+ structured cybersecurity training sessions and hands-on workshops to 120+ student learners across networking, Linux, web security, and SOC fundamentals. • Awarded Best Technical Instructor (ranked 1st among 250 instructors) and co-designed 10+ Capture The Flag (CTF) challenges for university competitions.",
    startDate: "2024-10-01",
    endDate: "2025-10-01",
    showDate: true,
    skills: ["Cybersecurity Instruction", "CTF Challenge Design", "Workshop Delivery", "Community Mentoring"],
    certificateUrl: "https://gdg.community.dev/",
  },
  {
    tag: "Technical Instructor & Committee Member",
    kind: "volunteer",
    subTag: "IEEE",
    subTagHyperlink: "https://www.ieee.org/",
    desc: "Instructed C and Python programming for 5+ student engineering teams and mentored 20+ students on embedded Arduino robotics projects, earning 2nd Place in the IEEE GHOSTEC Autonomous Racing Robot Competition.",
    startDate: "2023-07-01",
    endDate: "2023-12-01",
    showDate: true,
    skills: ["C Programming", "Python", "Embedded Systems", "Team Mentoring"],
    certificateUrl: "https://www.ieee.org/",
  },
  {
    tag: "B.Sc. in Computer Science (Information Security & Digital Forensics)",
    kind: "education",
    desc: "Graduated with Distinction with Honor (GPA: 3.78 / 4.0), ranking 8th out of 900 students in the Information Security & Digital Forensics department. • Completed graduation project VerifAI 360 (AI-Powered GRC Compliance & Risk Platform automating ISO 27001, PCI DSS, NIST, and GDPR mapping). • Core coursework: Network Security, Digital Forensics, Cryptography, Operating Systems, and Data Structures & Algorithms.",
    subTag: "Benha University",
    subTagHyperlink: "https://www.bu.edu.eg/",
    startDate: "2022-10-01",
    endDate: "2026-06-01",
    showDate: true,
    skills: ["Information Security", "Digital Forensics", "Cryptography", "Network Security", "Operating Systems"],
    certificateUrl: "https://www.bu.edu.eg/",
  },
  {
    tag: "ITI Cybersecurity Summer Training",
    hidden: true,
    kind: "education",
    subTag: "Information Technology Institute (ITI)",
    subTagHyperlink: "https://www.iti.gov.eg/",
    desc: "Completed 120 hours of foundational training in enterprise networking, Linux/Windows OS security, and offensive/defensive techniques. • Executed practical labs on reconnaissance, vulnerability scanning, and web application security.",
    startDate: "2024-09-01",
    endDate: "2024-11-01",
    showDate: true,
    skills: ["Networking", "OS Security", "Reconnaissance", "Web Security"],
    certificateUrl: "https://www.iti.gov.eg/",
  },
  {
    tag: "Introduction to Cybersecurity Bootcamp",
    hidden: true,
    kind: "education",
    subTag: "CyberTalents",
    subTagHyperlink: "https://cybertalents.com/",
    desc: "Strengthened practical knowledge of attack vectors, cryptography, web security, and threat detection. • Solved 20+ hands-on CTF challenges and defensive security labs.",
    startDate: "2024-11-01",
    endDate: "2025-01-01",
    showDate: true,
    skills: ["Cybersecurity Fundamentals", "Threat Detection", "CTF Labs"],
    certificateUrl: "https://cybertalents.com/",
  },
];

/* ─── The CV's roles merged in ───────────────────────────────────────────── */

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** "Feb 2026" → "2026-02-01", "2025" → "2025-01-01", "Present" → undefined */
const isoMonth = (s: string): string | undefined => {
  const m = s.trim().match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{4})$/) ?? s.trim().match(/^(\d{1,2})\/(\d{4})$/);
  if (m) {
    const month = /^\d+$/.test(m[1]) ? Number(m[1]) : MONTHS.indexOf(m[1].toLowerCase()) + 1;
    return month >= 1 && month <= 12 ? `${m[2]}-${String(month).padStart(2, "0")}-01` : undefined;
  }
  const y = s.trim().match(/^(\d{4})$/);
  return y ? `${y[1]}-01-01` : undefined;
};
const datesOf = (dates: string) => {
  const [from, to = from] = dates.split(/\s*[–—-]\s*/);
  return { start: isoMonth(from ?? ""), end: /present|now|current|today/i.test(to) ? undefined : isoMonth(to) };
};

/* "Digital Egypt Pioneers Initiative (DEPI)" and "DEPI" are the same place */
const orgKeys = (org: string) => {
  const lower = org.toLowerCase();
  const short = lower.match(/\(([^)]+)\)/)?.[1]?.trim();
  const full = lower.replace(/\([^)]*\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  return [full, short].filter(Boolean) as string[];
};
const sameOrg = (a: string, b: string) => {
  const A = orgKeys(a), B = orgKeys(b);
  return A.some((x) => B.some((y) => x === y || (x.length > 4 && y.length > 4 && (x.includes(y) || y.includes(x)))));
};
const words = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) ?? []);
const sameRole = (a: string, b: string) => {
  const A = words(a), B = words(b);
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / Math.max(1, Math.min(A.size, B.size)) >= 0.6;
};

function mergeCv(items: readonly ExperienceItem[]): ExperienceItem[] {
  const out = items.map((i) => ({ ...i }));
  const fromCv: [CvFromPdfEntry, ExperienceItem["kind"]][] = [
    ...(CV_FROM_PDF?.sections.experience ?? []).map((e) => [e, "work"] as [CvFromPdfEntry, ExperienceItem["kind"]]),
    ...(CV_FROM_PDF?.sections.volunteering ?? []).map((e) => [e, "volunteer"] as [CvFromPdfEntry, ExperienceItem["kind"]]),
  ];
  for (const [e, kind] of fromCv) {
    const { start, end } = datesOf(e.dates);
    if (!start) continue;
    const atOrg = out.filter((i) => i.kind !== "education" && sameOrg(i.subTag, e.org));
    const match = atOrg.find((i) => sameRole(i.tag, e.title)) ?? (atOrg.length === 1 ? atOrg[0] : undefined);
    if (match) {
      /* Same role: the CV's months win (a job that ended, a corrected start) */
      if (match.startDate.slice(0, 7) !== start.slice(0, 7)) match.startDate = start;
      if (end) match.endDate = end;
      else delete match.endDate;
      continue;
    }
    const desc = e.points.map((p) => p.replace(/\*\*/g, "")).join(" • ");
    out.push({
      tag: e.title,
      kind,
      subTag: e.org,
      subTagHyperlink: "",
      desc,
      startDate: start,
      ...(end ? { endDate: end } : {}),
      showDate: true,
      skills: [],
      place: e.place,
    });
  }
  return out;
}

export const knowledgeEducationItems: ExperienceItem[] = mergeCv(HAND_WRITTEN);
