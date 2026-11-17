/* The CV as a web page (/cv) — the same content as the PDF CV, so search
   engines can read it and "Ahmed Emad Nasr CV" finds a real page.

   ═══ data/cv.ts → app/cv/page.tsx ═══
   When you update the PDF (public/Assets/cv/AhmedEmadNasr_CV.pdf), update the
   same lines here — the page and the PDF should say the same thing.
   **double asterisks** = bold (the numbers, as in the PDF).
   A project link that is empty ("") is not shown. */

import { CV_PDF_HREF, GITHUB_USERNAME } from "@/lib/shared";

type CvEntry = {
  title: string;
  org: string;
  place: string;
  dates: string;
  points: string[];
};

type CvProject = {
  title: string;
  stack: string;
  github?: string;
  demo?: string;
  points: string[];
};

export const CV = {
  pdf: CV_PDF_HREF,
  /** Shown under the name, and in the page's description */
  headline: "Information Security Officer · Cybersecurity Instructor",
  contact: {
    phone: "+20 101 397 2690",
    email: "ahmed.em.nasr@gmail.com",
    linkedin: "https://linkedin.com/in/ahmed-emad-nasr",
    wuzzuf: "https://wuzzuf.net/me/ahmed-emad-nasr",
    github: `https://github.com/${GITHUB_USERNAME}`,
  },
  education: {
    degree: "Bachelor of Science (B.Sc.), Computer Science – Information Security and Digital Forensics",
    school: "Benha University",
    place: "Benha, Egypt",
    date: "Jun 2026",
    gpa: "3.78/4.0",
    coursework: "Network Security, Digital Forensics, Cryptography, Operating Systems, Data Structures & Algorithms",
  },
  experience: [
    {
      title: "Cybersecurity Instructor",
      org: "AMIT Learning",
      place: "Cairo, Egypt",
      dates: "Feb 2026 – Present",
      points: [
        "Authored curriculum and instructed **300+** students in Networking, Linux, **Security+**, and SANS SEC**450** / SEC**504**",
        "Delivered hands-on **SOC**, Pentest, **IAM**, and **GRC** labs, achieving a **10/10** average student feedback score",
        "Delivered Red Hat System Administration I & II courses in collaboration with NTI, achieving a **100%** student pass rate",
      ],
    },
    {
      title: "Information Security Intern",
      org: "Banque Misr",
      place: "Cairo, Egypt",
      dates: "Jul 2026 – Sep 2026",
      points: [
        "Assessed GRC gaps across **3** units via ISO **27001**, **PCI DSS**, COBIT & SWIFT KPIs; delivered **6+** remediation actions",
        "Audited enterprise architectures across **IAM**, **PAM**, & DevSecOps, surfacing **5+** control gaps with remediation plans",
        "Audited **SIEM**/DFIR/VAPT workflows, identifying **9** gaps; dark-web intel recommendation adopted for brand protection",
      ],
    },
    {
      title: "Incident Response Analyst Intern",
      org: "Digital Egypt Pioneers Initiative (DEPI)",
      place: "Cairo, Egypt",
      dates: "Jun 2025 – Jun 2026",
      points: [
        "Triaged **30+** SOC alerts via NIST **800-61** on THM, LetsDefend & CyberDefenders; maintained **95%+** accuracy rate",
        "Completed all INE **eCIR** labs (threat hunting, SIEM, DFIR) and selected **eCDFP** labs (disk, memory & network forensics)",
      ],
    },
    {
      title: "Penetration Tester Trainee",
      org: "Information Technology Institute (ITI)",
      place: "Benha, Egypt",
      dates: "May 2025 – Jan 2026",
      points: [
        "Completed all INE eJPT labs (reconnaissance, enumeration, exploitation, pivoting) & passed the exam with a **90%** score",
        "Solved **100%** of assigned labs on PortSwigger, CyberTalents, and Hack The Box (HTB)",
      ],
    },
  ] satisfies CvEntry[],
  projects: [
    {
      title: "Enterprise SOC Environment & Insider Threat Deception",
      stack: "VMware, Wazuh, TheHive, Suricata, Zeek, YARA, FIM, auditd, Sysmon, Python, VirusTotal",
      github: "https://github.com/Ahmed-Emad-Nasr/SOC-Environment",
      demo: "https://youtube.com/playlist?list=PLO1VSSKnwZUgbiE0ev1TUr5wPI9kxxbgL",
      points: [
        "Authored a custom Wazuh rule, merged by maintainers into open-source SOC Fortress (**1.5k+** stars)",
        "Simulated **50+** attacks to validate detection rules; achieved **95%+** true positive rate across TTPs",
        "Built Python script to hash files, query threat intel & auto-quarantine malware, cutting triage time by **10%**",
      ],
    },
    {
      title: "Malware Analysis & Prevention Strategy",
      stack: "Wireshark, FakeNet-NG, DIE, CFF Explorer, Process Hacker, Process Explorer, FIM, JavaScript, PDF Parsing",
      github: "https://github.com/Ahmed-Emad-Nasr/Malware-Analysis-and-Prevention-Strategy",
      demo: "https://youtube.com/playlist?list=PLO1VSSKnwZUgGaiDZXU-mKuh8CUZx-gAd",
      points: [
        "Deployed isolated lab; analyzed **20+** malware samples via DIE & CFF Explorer to extract actionable IOCs",
        "Conducted dynamic analysis using Wireshark & FakeNet-NG to uncover Command and Control (C**2**) traffic behaviors",
        "Engineered a parsing utility and leveraged FIM to detect & extract embedded malicious payloads (**18+** downloads)",
      ],
    },
    {
      title: "VerifAI 360 Compliance Framework",
      stack: "Python, AI/LLMs, GRC, ISO 27001, NIST, PCI DSS, GDPR",
      github: "https://github.com/Ahmed-Emad-Nasr/VerifAI360-Compliance-Framwork",
      demo: "https://youtu.be/G-Ys6VuV91g",
      points: [
        "Architected an AI-powered GRC platform to automate evidence validation and regulatory control mapping",
        "Engineered risk scoring & automated gap analysis generating remediation plans, cutting manual assessment effort by **30%**",
        "Accelerated assessments by **15%** via automated control mapping across **150+** frameworks",
      ],
    },
    {
      title: "Vulnerability Assessment & Threat Simulation",
      stack: "Nessus, Kali Linux, Metasploitable, DVWA, MITRE ATT&CK, Cyber Kill Chain",
      github: "https://github.com/Ahmed-Emad-Nasr/SOC-Environment",
      /* The playlist link in the PDF (list=PLcw8B9lEwARs) looks cut short —
         put the full one here once it is fixed */
      demo: "",
      points: [
        "Conducted Nessus VA and validated vulnerabilities via Kali Linux Pentest POCs on Metasploitable and DVWA",
        "Simulated **15+** attacks mapped to Cyber Kill Chain & MITRE ATT&CK to assess impact and recommend fixes",
      ],
    },
    {
      title: "Cybersecurity Portfolio & Technical Blog",
      stack: "Next.js, React, TypeScript, JavaScript, HTML, CSS, Framer Motion, GitHub Pages, Medium",
      github: "https://github.com/Ahmed-Emad-Nasr/ahmed.dev",
      points: [
        "Developed & deployed a technical portfolio & blog, attracting **1,200+** organic visitors",
        "Published **80+** security cases, CTFs, & complex lab solutions, earning **22+** GitHub stars from the security community",
      ],
    },
  ] satisfies CvProject[],
  skills: [
    ["SIEM & Detection", "Wazuh, Splunk, ELK Stack, Security Onion, Sysmon"],
    ["Incident Response & Threat Detection", "Security Monitoring, Incident Detection, Alert Triage, IOC Analysis, Log Analysis"],
    ["Network Security", "TCP/IP, IDS/IPS, Suricata, Wireshark, Zeek, Packet Analysis"],
    ["Identity & Access", "IAM, PAM, RBAC, Access Control"],
    ["Malware & Forensics", "YARA, Volatility, Autopsy, PEStudio"],
    ["Programming & Automation", "Python, Bash, PowerShell, Regex"],
    ["Frameworks & Standards", "MITRE ATT&CK, NIST CSF, NIST 800-61, NIST 800-53, ISO 27001, Cyber Kill Chain"],
    ["Operating Systems", "Windows, Windows Server, Linux"],
    ["Soft Skills", "Analytical Thinking, Problem Solving, Team Collaboration, Communication, Adaptability, Attention to Detail"],
  ] as const,
  certifications: [
    ["eLearnSecurity Junior Penetration Tester v2 (eJPT v2)", "INE", "2026"],
    ["Certified Cybersecurity Educator Professional (CCEP)", "Red Team Leaders", "2026"],
    ["Red Hat System Administration I (RH124)", "Red Hat", "2026"],
    ["HCIA-Datacom V1.0 & HCCDA-Tech Essentials", "Huawei", "2025"],
    ["SOC Level 1 & SOC Level 2 Learning Paths", "TryHackMe", "2025"],
    ["Malware Analysis Fundamentals", "Mahara-Tech (ITI)", "2025"],
    ["Cyber Threat Intelligence 101", "arcX", "2025"],
    ["Cisco Certified Network Associate (CCNA 200-301)", "Cisco Systems", "2024"],
  ] as const,
  volunteering: [
    {
      title: "Cybersecurity Instructor (Volunteer)",
      org: "Google Developer Groups (GDG)",
      place: "Benha, Egypt",
      dates: "Oct 2024 – Oct 2025",
      points: ["Delivered **35+** sessions to **120+** learners, ranked **1st** among **250** instructors, & co-designed **10+** CTF challenges"],
    },
    {
      title: "Technical Instructor & Committee Member",
      org: "IEEE",
      place: "Benha, Egypt",
      dates: "Jul 2023 – Dec 2023",
      points: ["Led C/Python training for **5+** engineering teams, enabling **20+** students to build Arduino robotic cars"],
    },
  ] satisfies CvEntry[],
  awards: [
    "**Academic Excellence:** Ranked **8th of 900** in Information Security and Digital Forensics at Benha University",
    "Ranked in the Top **1%** of users globally on the TryHackMe platform",
    "Scaled a cybersecurity YouTube channel to **500+** subscribers & **60,000+** views, featuring practical tutorials",
    "Ranked **44th** out of **450** in the ITI & CyberTalents CTF Competition",
    "Officially recognized as a Top Achiever in the Digital Egypt Pioneers Initiative (DEPI) – Round **4**",
  ],
  languages: [
    ["Arabic", "Native"],
    ["English", "Professional Working Proficiency"],
  ] as const,
};
