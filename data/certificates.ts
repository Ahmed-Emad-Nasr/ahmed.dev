/*
 * ═══ data/certificates.ts — EVERY certificate, one entry per document ═══
 *
 * Drawn by:  /certificates           the list with filters (app/certificates)
 *            /certificates/<slug>    one page per certificate, with every detail
 *            /ar/certificates        the list in Arabic
 * and used by: the JSON-LD, sitemap.xml (image entries), the command palette,
 * the "proof" links on the home page, and scripts/tag-images.mjs, which writes
 * the same details INTO each image file (title, description, keywords,
 * creator, copyright) so the metadata travels with the image.
 *
 * THE IMAGES live in their own folder, apart from the personal photos:
 *     public/Assets/certificates/<slug>.webp          the scan
 *     public/Assets/certificates/<slug>-thumb.webp    640px card picture (npm run thumbs)
 *
 * NEW CREDLY BADGES are added by themselves (scripts/sync-credly.mjs →
 * data/credly-badges.ts, every deploy) — nothing to do here.
 *
 * ADD A CERTIFICATE
 *   1. Save the scan as public/Assets/certificates/<slug>.webp — the slug is
 *      the address too (/certificates/<slug>): lowercase, words-with-dashes.
 *   2. Add an entry below (order here = order on the page).
 *   3. npm run thumbs && npm run images:tag   (CI runs both on every deploy)
 *   Write only what the document itself says — dates, hours, IDs. Leave a
 *   field out rather than guess.
 *
 * `legacyIndex` is the number the image had in the old gallery
 * (image_display_thumb/N.webp): old links (/gallery?cert=N) still land on the
 * right certificate. New certificates leave it out.
 */

import { CREDLY_BADGES } from "@/data/credly-badges";

/* What kind of document it is — the filter buttons:
     certifications → professional certifications passed by exam
     education      → the degree, internship and long government/institute programmes
     courses        → courses, learning paths, bootcamps and exam-prep training
     exams          → score reports of graded exams
     badges         → digital badges that verify one of the above
   Only "certifications" counts as a certification anywhere on the site. */
export type CertificateGroup = "certifications" | "education" | "courses" | "exams" | "badges";

export type Certificate = {
  /** The address (/certificates/<slug>) and the file name (Assets/certificates/<slug>.webp) */
  slug: string;
  /** The number it had in the old gallery — keeps old ?cert=N links working */
  legacyIndex?: number;
  /** The name of the certificate as written on it */
  title: string;
  /** Who issued it */
  issuer: string;
  /** The issuer's site */
  issuerUrl?: string;
  /** Who delivered or offered it, when that is someone else (a university, a partner) */
  deliveredBy?: string;
  /** What the document is, in a few words ("Course Certificate") */
  kind: string;
  group: CertificateGroup;
  /** Date of issue or completion, ISO: "2026-02-15" (or "2026-08" when only the month is known) */
  date?: string;
  /** A period instead of / beside the date: "June – December 2025" */
  period?: string;
  /** Length as written on the document: "61 h 45 min", "120 hours" */
  hours?: string;
  /** Exam score, when the document is a score */
  score?: string;
  /** Certificate / credential number printed on it */
  credentialId?: string;
  /** The issuer's own verification page — only one printed on the document or confirmed */
  verifyUrl?: string;
  /** Instructor named on the document */
  instructor?: string;
  /** The name exactly as printed */
  nameOnDocument: string;
  /** One or two lines — the card */
  summary: string;
  /** The full explanation — the certificate's own page */
  description: string;
  /** What it covers: topics, skills, modules */
  covers: readonly string[];
  /** Anything the document itself says about its own scope */
  note?: string;
};

const NAME_FULL = "Ahmed Emad Eldeen Abdelmoneam";

/* The documents, written by hand */
const LISTED: readonly Certificate[] = [
  /* ─── Degree & programmes ─── */
  {
    slug: "bsc-computers-ai-benha-university-proof-of-graduation",
    legacyIndex: 99,
    title: "B.Sc. Computers & Artificial Intelligence — Proof of Graduation",
    issuer: "Benha University",
    issuerUrl: "https://www.bu.edu.eg/",
    deliveredBy: "Faculty of Computers & Artificial Intelligence, Benha University",
    kind: "University Degree",
    group: "education",
    date: "2026-07-30",
    nameOnDocument: "احمد عماد الدين عبدالمنعم موسى",
    summary:
      "Official proof of graduation: Bachelor of Computers & AI, Information Security & Digital Forensics, grade Excellent.",
    description:
      "The official proof of graduation (إفادة نجاح) issued by Benha University's certificates and documents centre. It states that Ahmed earned the Bachelor's degree of the Faculty of Computers & Artificial Intelligence, specialising in Information Security and Digital Forensics (أمن المعلومات واكتشاف الأدلة الجنائية), with the overall grade Excellent (امتياز). The result was approved by the faculty council on 22 June 2026 and by the university on 30 July 2026. The document carries the faculty seal and the signatures of the faculty's dean, vice-dean for education and student affairs, and the director of student affairs.",
    covers: [
      "Information Security",
      "Digital Forensics",
      "Network Security",
      "Cryptography",
      "Operating Systems",
      "Data Structures & Algorithms",
    ],
    note: "Issued in Arabic. The degree certificate itself follows the proof of graduation.",
  },
  {
    slug: "banque-misr-rowad-information-security-summer-training",
    legacyIndex: 1,
    title: "Banque Misr — Rowad Program, Certificate of Completion",
    issuer: "Banque Misr",
    issuerUrl: "https://www.banquemisr.com/",
    deliveredBy: "Banque Misr — Central Administration for Training & Learning, Human Resources Sector",
    kind: "Internship Certificate",
    group: "education",
    date: "2026-08",
    period: "August 2026",
    nameOnDocument: "Ahmed Emad Nasr",
    summary:
      "Banque Misr's Rowad summer training in the bank's Information Security sector, completed August 2026.",
    description:
      "The certificate of completion (شهادة اجتياز) of Banque Misr's Rowad (رواد) programme. Banque Misr's central administration for training and learning in the Human Resources sector certifies that Ahmed passed the summer training programme in the bank's Information Security sector during August 2026. In the programme he assessed GRC gaps across banking units against ISO/IEC 27001, PCI DSS, COBIT and SWIFT CSP, and worked through IAM and PAM reviews and the bank's SIEM and DFIR workflows. Signed by the head of the Human Resources sector and the head of HR development and institutional culture.",
    covers: ["ISO/IEC 27001", "PCI DSS", "COBIT", "SWIFT CSP", "IAM & PAM", "SIEM & DFIR workflows", "GRC gap assessment"],
  },
  {
    slug: "depi-information-security-analyst-infrastructure-security",
    legacyIndex: 4,
    title: "DEPI — Information Security Analyst (Infrastructure & Security)",
    issuer: "Digital Egypt Pioneers Initiative (DEPI)",
    issuerUrl: "https://www.depi.gov.eg/",
    deliveredBy: "Ministry of Communications and Information Technology of Egypt — with Skillsoft Global Knowledge, Youth and OTO Courses",
    kind: "Ministry Track",
    group: "education",
    date: "2025-12",
    period: "June – December 2025",
    nameOnDocument: "Ahmed Emad ELdeen Abdelmoneam",
    summary:
      "Certificate of Achievement from the Digital Egypt Pioneers Program, track Infrastructure & Security — Information Security Analyst.",
    description:
      "A Certificate of Achievement for completing and achieving the core learning outcomes of the Digital Egypt Pioneers Program (DEPI), sponsored by Egypt's Ministry of Communications and Information Technology. Track: Infrastructure and Security — Information Security Analyst, June to December 2025. The track covers enterprise infrastructure security, CIS hardening and SIEM monitoring. Signed by Dr. Hesham Farouk (Technology Development Consultant, MCIT; DEPI General Manager) and Dr. Hoda Baraka (Advisor to the Minister of ICT for Technology Talents Development), with the DEPI Certified seal.",
    covers: ["Infrastructure security", "CIS Benchmarks hardening", "SIEM monitoring", "Vulnerability assessment", "Security policies"],
  },
  {
    slug: "depi-cyber-security-incident-response-analyst",
    legacyIndex: 5,
    title: "DEPI — Cyber Security Incident Response Analyst",
    issuer: "Digital Egypt Pioneers Initiative (DEPI)",
    issuerUrl: "https://www.depi.gov.eg/",
    deliveredBy: "Ministry of Communications and Information Technology of Egypt — with AMIT, Novamind and OTO Courses",
    kind: "Ministry Track",
    group: "education",
    date: "2026-07",
    period: "November 2025 – July 2026",
    nameOnDocument: "Ahmed Emad Eldeen Abdelmoneam Mousa",
    summary:
      "Certificate of Achievement from the Digital Egypt Pioneers Program, track Cyber Security Incident Response Analyst (Nov 2025 – Jul 2026).",
    description:
      "A Certificate of Achievement for completing and achieving the core learning outcomes of the Digital Egypt Pioneers Program, sponsored by Egypt's Ministry of Communications and Information Technology. Track: Cyber Security Incident Response Analyst, November 2025 to July 2026, delivered with AMIT, Novamind and OTO Courses. The track is an intensive incident response and SOC operations programme: NIST SP 800-61 triage, Wazuh and Suricata detection labs, Sysmon telemetry and YARA rules. Signed by Dr. Hesham Farouk and Dr. Hoda Baraka, with the DEPI Certified seal.",
    covers: ["NIST SP 800-61 incident response", "Alert triage", "Wazuh", "Suricata", "Sysmon", "YARA", "SOC operations"],
  },
  {
    slug: "depi-forensics-investigator-infrastructure-security",
    legacyIndex: 31,
    title: "DEPI — Forensics Investigator (Infrastructure & Security)",
    issuer: "Digital Egypt Pioneers Initiative (DEPI)",
    issuerUrl: "https://www.depi.gov.eg/",
    deliveredBy: "Ministry of Communications and Information Technology of Egypt — with Skillsoft Global Knowledge, Youth and OTO Courses",
    kind: "Ministry Track",
    group: "education",
    date: "2025-12",
    period: "June – December 2025",
    nameOnDocument: "Ahmed Emad ELdeen Abdelmoneam",
    summary:
      "Certificate of Achievement from the Digital Egypt Pioneers Program, track Infrastructure & Security — Forensics Investigator.",
    description:
      "A Certificate of Achievement for completing and achieving the core learning outcomes of the Digital Egypt Pioneers Program, sponsored by Egypt's Ministry of Communications and Information Technology. Track: Infrastructure and Security — Forensics Investigator, June to December 2025. The track covers evidence acquisition and chain of custody, memory analysis with Volatility, disk and registry forensics with Autopsy and Registry Explorer, and building a timeline of an incident. Signed by Dr. Hesham Farouk and Dr. Hoda Baraka, with the DEPI Certified seal.",
    covers: ["Evidence acquisition", "Chain of custody", "Memory forensics (Volatility)", "Disk forensics (Autopsy)", "Registry forensics", "Timeline analysis"],
  },
  {
    slug: "depi-business-english-track-round-3",
    legacyIndex: 32,
    title: "DEPI — Business English Track, Round 3",
    issuer: "Digital Egypt Pioneers Initiative (DEPI)",
    issuerUrl: "https://www.depi.gov.eg/",
    deliveredBy: "OTO Courses",
    kind: "Professional Communication",
    group: "education",
    date: "2025-12",
    period: "June – December 2025",
    nameOnDocument: "AHMED EMAD ELDEEN ABDELMONEAM MOUSA",
    summary: "Passed the Business English Track (Round 3) of Digital Egyptian Pioneers, offered by OTO Courses.",
    description:
      "A Certificate of Completion stating that Ahmed successfully passed the Business English Track, Round 3, of Digital Egyptian Pioneers — offered by OTO Courses from June 2025 to December 2025 and sponsored by Egypt's Ministry of Communications and Information Technology. It carries the DEPI STAR Certified seal. The track covers professional and technical communication in English: presentations, written reports and workplace conversation.",
    covers: ["Business English", "Technical presentations", "Professional writing", "Workplace communication"],
  },
  {
    slug: "iti-cyber-security-120-hours",
    legacyIndex: 26,
    title: "Cyber Security (120 Hours)",
    issuer: "Information Technology Institute (ITI)",
    issuerUrl: "https://www.iti.gov.eg/",
    kind: "Intensive Program",
    group: "education",
    date: "2025-09-15",
    period: "22 August – 15 September 2025",
    hours: "120 lecture hours",
    nameOnDocument: "Ahmed Emad Eldeen Abdelmoneam Mousa",
    summary:
      "ITI's 120-hour Cyber Security course: networking, advanced networks, security essentials, ethical hacking and Huawei Cloud.",
    description:
      "A To-Whom-It-May-Concern letter from the Information Technology Institute (ITI) certifying that Ahmed attended the course Cyber Security (120 hrs.) from 22 August 2025 to 15 September 2025. The letter lists the modules and their lecture hours: Computer Network Fundamentals (24), Advanced Network (24), Cyber Security Essentials (18), Ethical Hacking (24) and HCCDA Tech Essentials on Huawei Cloud (30) — 120 hours in total. Signed by Dr. Heba Saleh, Chairman of ITI, with the institute's stamp.",
    covers: [
      "Computer Network Fundamentals — 24 h",
      "Advanced Network — 24 h",
      "Cyber Security Essentials — 18 h",
      "Ethical Hacking — 24 h",
      "HCCDA Tech Essentials (Huawei Cloud) — 30 h",
    ],
  },
  {
    slug: "gdg-on-campus-benha-bootcamp-cyber-security-technical",
    legacyIndex: 36,
    title: "GDG on Campus Benha BootCamp 24/25 — Cyber Security Technical",
    issuer: "Google Developer Groups (GDG) on Campus — Benha University",
    issuerUrl: "https://gdg.community.dev/",
    kind: "Instructor & Bootcamp",
    group: "education",
    date: "2025",
    period: "BootCamp 2024/25",
    nameOnDocument: "Ahmed Emad Eldeen Abdelmoneam",
    summary:
      "Recognition as the Cyber Security Technical of GDG on Campus Benha BootCamp 24/25: 35+ sessions taught, 10+ CTF challenges built.",
    description:
      "A Certificate of Completion from Google Developer Groups on Campus — Benha University, given in recognition of Ahmed's remarkable contribution as Cyber Security Technical during the GDG on Campus Benha BootCamp 24/25. It thanks him for his dedication, teamwork and unwavering support, which it calls vital to the success of the event. During the bootcamp he delivered 35+ cybersecurity training sessions, co-designed 10+ CTF challenges, and was ranked 1st among 250 instructors. Signed by the community mentor.",
    covers: ["Teaching cybersecurity", "CTF challenge design", "Mentoring students", "Bootcamp organisation"],
  },

  /* ─── Professional certifications (passed by exam) ─── */
  {
    slug: "ejpt-junior-penetration-tester-ine-security",
    legacyIndex: 2,
    title: "eJPT — Junior Penetration Tester",
    issuer: "INE Security",
    issuerUrl: "https://security.ine.com/",
    kind: "Professional Certification",
    group: "certifications",
    date: "2026-02-15",
    credentialId: "174485594",
    score: "90%",
    nameOnDocument: "Ahmed Emad",
    summary:
      "INE Security's hands-on penetration testing certification, awarded 15 February 2026 (certification ID 174485594).",
    description:
      "The eJPT (eLearnSecurity Junior Penetration Tester) certification, awarded by INE Security on 15 February 2026 with certification ID 174485594. The eJPT is a 100% practical, proctored exam: the candidate attacks a lab network and answers questions that can only be solved by actually compromising it. It covers assessment methodology, host and network auditing, web application testing, exploitation and pivoting between networks. Signed by Tracy Wallace (Director of Content Development) and Lindsey Rinehart (Chief Executive Officer).",
    covers: [
      "Assessment methodologies",
      "Host & network auditing",
      "Host & network penetration testing",
      "Web application penetration testing",
      "Enumeration & exploitation",
      "Pivoting",
    ],
  },
  {
    slug: "ccep-certified-cybersecurity-educator-professional",
    legacyIndex: 6,
    title: "Certified Cybersecurity Educator Professional (CCEP)",
    issuer: "Red Team Leaders",
    issuerUrl: "https://courses.redteamleaders.com/",
    kind: "Professional Certification",
    group: "certifications",
    date: "2026-04-17",
    credentialId: "0700c03fef3f856b",
    verifyUrl: "https://courses.redteamleaders.com/exam-completion/0700c03fef3f856b",
    nameOnDocument: "Ahmed Emad Nasr",
    summary:
      "Completed all requirements and passed the CCEP exam — Red Team Leaders, issued 17 April 2026.",
    description:
      "Red Team Leaders acknowledges that Ahmed successfully completed all the requirements and passed the exam of the Certified Cybersecurity Educator Professional (CCEP). Issued 17 April 2026. The credential validates teaching cybersecurity: designing a curriculum, running hands-on labs, technical mentoring and assessing learners. Signed by the founder and instructor; the QR code and the printed link verify it on the issuer's site.",
    covers: ["Curriculum design", "Lab-based instruction", "Technical mentoring", "Learner assessment"],
  },
  {
    slug: "arcx-cyber-threat-intelligence-101-foundation-certification",
    legacyIndex: 15,
    title: "Cyber Threat Intelligence 101 — Foundation Threat Intelligence Analyst",
    issuer: "arcX",
    issuerUrl: "https://arcx.io/",
    kind: "Foundation Certification",
    group: "certifications",
    date: "2025-08-08",
    nameOnDocument: NAME_FULL,
    summary:
      "Passed the arcX course examination for Cyber Threat Intelligence 101 and awarded the arcX Foundation Level Threat Intelligence Analyst Certification.",
    description:
      "arcX certifies that Ahmed successfully completed the arcX course examination for Cyber Threat Intelligence 101 and has been awarded the arcX Foundation Level Threat Intelligence Analyst Certification. Date completed: 8 August 2025. The course covers the intelligence lifecycle, strategic, operational and tactical intelligence, IOC enrichment, adversary profiling and mapping to MITRE ATT&CK. Signed by Matthew Roberts (CEO) and Stewart Bertram (Head of CTI).",
    covers: ["Intelligence lifecycle", "Strategic vs. tactical intelligence", "IOC enrichment", "Adversary profiling", "MITRE ATT&CK mapping"],
  },

  /* ─── Courses, learning paths & training ─── */
  {
    slug: "ine-incident-handling-response-professional",
    legacyIndex: 3,
    title: "Incident Handling & Response Professional",
    issuer: "INE",
    issuerUrl: "https://ine.com/",
    kind: "Learning Path Certificate",
    group: "courses",
    date: "2026-03-02",
    hours: "61 h 45 min",
    instructor: "Alexis Ahmed",
    nameOnDocument: "Ahmed Emad",
    summary: "INE's Incident Handling & Response Professional learning path — 61 h 45 min, completed 2 March 2026.",
    description:
      "A Certificate of Completion from INE for the Incident Handling & Response Professional learning path, taught by Alexis Ahmed. Length 61 hours 45 minutes, completed 2 March 2026. The path follows the incident response lifecycle end to end: preparation, alert triage, investigation with SIEM and forensic tools, containment, eradication and recovery, and writing the root-cause report. Signed by Lindsey Rinehart, Chief Executive Officer of INE.",
    covers: ["Incident response lifecycle", "Alert triage", "SIEM investigation", "Digital forensics", "Containment & recovery", "Root-cause reporting"],
  },
  {
    slug: "red-hat-system-administration-1-rh124",
    legacyIndex: 10,
    title: "Red Hat System Administration I (RH124 — RHA) — Ver. 10",
    issuer: "Red Hat",
    issuerUrl: "https://www.redhat.com/",
    kind: "Official Course Certificate",
    group: "courses",
    date: "2026-05-06",
    hours: "40 credit hours",
    verifyUrl: "https://www.credly.com/badges/f9ec8659-82f6-4633-a03a-0920ded8aec0",
    nameOnDocument: "Ahmed Nasr",
    summary: "Red Hat's official RH124 course, version 10 — 40 credit hours, 6 May 2026, verifiable on Credly.",
    description:
      "A Red Hat Certificate of Attendance for the official course Red Hat System Administration I (RH124 — RHA), version 10, dated 6 May 2026, with 40 credit hours. RH124 is the first course of the Red Hat Certified System Administrator path: the command line, files and permissions, users and groups, processes and systemd services, logs, networking, storage, SSH and package management on Red Hat Enterprise Linux. Signed by Karl Reynolds, Senior Director, Global Learning Services; verifiable on Credly.",
    covers: ["Linux command line", "Users, groups & permissions", "systemd services", "Logging", "Networking", "Storage", "SSH", "Package management"],
  },
  {
    slug: "tryhackme-soc-level-1-learning-path",
    legacyIndex: 11,
    title: "SOC Level 1 Learning Path",
    issuer: "TryHackMe",
    issuerUrl: "https://tryhackme.com/",
    kind: "Learning Path",
    group: "courses",
    date: "2025-07-14",
    hours: "87 h 50 min",
    credentialId: "THM-QYV8WBJM4W",
    verifyUrl: "https://tryhackme.com/certificate/THM-QYV8WBJM4W",
    nameOnDocument: NAME_FULL,
    summary: "TryHackMe's SOC Level 1 path — 87 h 50 min of hands-on blue-team labs, completed 14 July 2025.",
    description:
      "TryHackMe's Certificate of Completion for the SOC Level 1 Learning Path, completed 14 July 2025 after 87 hours 50 minutes of course work (certificate THM-QYV8WBJM4W). The path trains the first-line SOC analyst in hands-on rooms: cyber defence frameworks, cyber threat intelligence, network security and traffic analysis, endpoint security monitoring, SIEM (Splunk and ELK), digital forensics and incident response, and phishing analysis. Signed by Ben Spring (CEO) and Ashu Savani (CTO).",
    covers: ["Cyber defence frameworks", "Threat intelligence", "Network traffic analysis", "Endpoint monitoring", "SIEM (Splunk, ELK)", "DFIR", "Phishing analysis"],
  },
  {
    slug: "tryhackme-soc-level-2-learning-path",
    legacyIndex: 12,
    title: "SOC Level 2 Learning Path",
    issuer: "TryHackMe",
    issuerUrl: "https://tryhackme.com/",
    kind: "Learning Path",
    group: "courses",
    date: "2025-10-10",
    hours: "68 h 50 min",
    credentialId: "THM-VXWU2KHLTF",
    verifyUrl: "https://tryhackme.com/certificate/THM-VXWU2KHLTF",
    nameOnDocument: NAME_FULL,
    summary: "TryHackMe's SOC Level 2 path — 68 h 50 min of advanced SOC labs, completed 10 October 2025.",
    description:
      "TryHackMe's Certificate of Completion for the SOC Level 2 Learning Path, completed 10 October 2025 after 68 hours 50 minutes (certificate THM-VXWU2KHLTF). The path moves from triage to investigation: log analysis, detection engineering with Sigma and YARA, threat hunting, threat emulation, malware analysis and incident response. Signed by Ben Spring (CEO) and Ashu Savani (CTO).",
    covers: ["Log analysis", "Detection engineering (Sigma, YARA)", "Threat hunting", "Threat emulation", "Malware analysis", "Incident response"],
  },
  {
    slug: "tryhackme-jr-penetration-tester-learning-path",
    legacyIndex: 28,
    title: "Jr Penetration Tester Learning Path",
    issuer: "TryHackMe",
    issuerUrl: "https://tryhackme.com/",
    kind: "Learning Path",
    group: "courses",
    date: "2025-09-15",
    hours: "30 h 40 min",
    credentialId: "THM-2DNEDQWNHI",
    verifyUrl: "https://tryhackme.com/certificate/THM-2DNEDQWNHI",
    nameOnDocument: NAME_FULL,
    summary: "TryHackMe's Jr Penetration Tester path — 30 h 40 min, completed 15 September 2025.",
    description:
      "TryHackMe's Certificate of Completion for the Jr Penetration Tester Learning Path, completed 15 September 2025 after 30 hours 40 minutes (certificate THM-2DNEDQWNHI). The path covers the offensive basics in hands-on rooms: penetration testing methodology, web application security and Burp Suite, network security and Nmap, vulnerability research, Metasploit, and Linux and Windows privilege escalation. Signed by Ben Spring (CEO) and Ashu Savani (CTO).",
    covers: ["Pentest methodology", "Web application security", "Burp Suite", "Nmap", "Metasploit", "Privilege escalation"],
  },
  {
    slug: "cisco-ccna-introduction-to-networks",
    legacyIndex: 7,
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "MOHE 01 — Banha University, Faculty of Computer",
    kind: "Course Certificate",
    group: "courses",
    date: "2024-12-22",
    instructor: "Ahmed Mohamed Tawfik Ali",
    nameOnDocument: NAME_FULL,
    summary: "The first of the three CCNA courses, offered by Benha University's Faculty of Computers — completed 22 December 2024.",
    description:
      "Cisco Networking Academy's certificate for successfully completing CCNA: Introduction to Networks (ITN), offered by MOHE 01 — Banha University, Faculty of Computer, through the Cisco Networking Academy programme. Completion date 22 December 2024; instructor Ahmed Mohamed Tawfik Ali. ITN is the first of the three CCNA 200-301 courses: network architectures, IPv4 and IPv6 addressing and subnetting, Ethernet, the TCP/IP suite and basic router and switch configuration.",
    covers: ["Network architectures", "IPv4 & IPv6 addressing", "Subnetting", "Ethernet", "TCP/IP", "Basic device configuration"],
  },
  {
    slug: "cisco-ccna-switching-routing-wireless-essentials",
    legacyIndex: 8,
    title: "CCNA: Switching, Routing & Wireless Essentials",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "MOHE 01 — Banha University, Faculty of Computer",
    kind: "Course Certificate",
    group: "courses",
    date: "2024-12-22",
    instructor: "Ahmed Mohamed Tawfik Ali",
    nameOnDocument: NAME_FULL,
    summary: "The second CCNA course — switching, routing and wireless — completed 22 December 2024.",
    description:
      "Cisco Networking Academy's certificate for successfully completing CCNA: Switching, Routing, and Wireless Essentials (SRWE), offered by MOHE 01 — Banha University, Faculty of Computer. Completion date 22 December 2024; instructor Ahmed Mohamed Tawfik Ali. SRWE covers VLANs and inter-VLAN routing, STP, EtherChannel, DHCPv4 and SLAAC/DHCPv6, first-hop redundancy, LAN security, wireless LANs and static routing.",
    covers: ["VLANs & trunking", "Inter-VLAN routing", "STP", "EtherChannel", "DHCPv4/v6", "FHRP", "Wireless LANs", "Layer 2 security"],
  },
  {
    slug: "cisco-ccna-enterprise-networking-security-automation",
    legacyIndex: 9,
    title: "CCNA: Enterprise Networking, Security & Automation",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "MOHE 01 — Banha University, Faculty of Computer",
    kind: "Course Certificate",
    group: "courses",
    date: "2024-12-22",
    instructor: "Ahmed Mohamed Tawfik Ali",
    nameOnDocument: NAME_FULL,
    summary: "The third CCNA course — OSPF, ACLs, NAT, VPNs and automation — completed 22 December 2024.",
    description:
      "Cisco Networking Academy's certificate for successfully completing CCNA: Enterprise Networking, Security, and Automation (ENSA), offered by MOHE 01 — Banha University, Faculty of Computer. Completion date 22 December 2024; instructor Ahmed Mohamed Tawfik Ali. ENSA covers single-area OSPFv2, network security concepts, ACLs, NAT, WAN concepts, VPNs and IPsec, QoS, network management, network design, virtualisation and automation.",
    covers: ["OSPFv2", "ACLs", "NAT", "WAN", "VPN & IPsec", "QoS", "Network virtualisation", "Network automation"],
  },
  {
    slug: "cisco-junior-cybersecurity-analyst-career-path",
    legacyIndex: 29,
    title: "Junior Cybersecurity Analyst Career Path",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    kind: "Career Path",
    group: "courses",
    date: "2025-10-18",
    nameOnDocument: NAME_FULL,
    summary: "Cisco's student-level credential for the Junior Cybersecurity Analyst Career Path, issued 18 October 2025.",
    description:
      "Cisco Networking Academy's Certificate of Course Completion: Ahmed achieved the student-level credential for completing the Junior Cybersecurity Analyst Career Path, issued 18 October 2025, signed by Lynn Bloomer, Director, Cisco Networking Academy. The certificate lists what the student was able to do proficiently: recommend cybersecurity controls to enhance network and information security; mitigate network security threats; mitigate systems security threats; evaluate an organisation's security posture with vulnerability and risk assessment tools; recommend incident management activities for an incident response plan; and serve effectively as a network security employee.",
    covers: [
      "Recommend security controls",
      "Mitigate network threats",
      "Mitigate system threats",
      "Vulnerability & risk assessment",
      "Incident response planning",
    ],
  },
  {
    slug: "microsoft-student-soc-program-foundations",
    legacyIndex: 30,
    title: "Student SOC Program Foundations Training",
    issuer: "Microsoft",
    issuerUrl: "https://www.microsoft.com/",
    kind: "Program Certificate",
    group: "courses",
    date: "2025-07-22",
    nameOnDocument: NAME_FULL,
    summary: "Microsoft's Certification of Completion for the Student SOC Program Foundations training, 22 July 2025.",
    description:
      "Microsoft's Certification of Completion presented to Ahmed for completing the Student SOC Program Foundations training, completed on 22 July 2025. The programme introduces modern security operations on Microsoft's stack: how a SOC works, SIEM and XDR concepts with Microsoft Sentinel and Defender, KQL hunting queries and incident triage.",
    covers: ["Security operations", "SIEM & XDR concepts", "Microsoft Sentinel & Defender", "KQL", "Incident triage"],
  },
  {
    slug: "cybertalents-introduction-to-cybersecurity-bootcamp-cohort-10",
    legacyIndex: 13,
    title: "Introduction to Cybersecurity Bootcamp — Cohort 10",
    issuer: "CyberTalents",
    issuerUrl: "https://cybertalents.com/",
    kind: "Bootcamp Certificate of Graduation",
    group: "courses",
    date: "2025-01-10",
    period: "15 December 2024 – 10 January 2025",
    nameOnDocument: NAME_FULL,
    summary: "Graduated from CyberTalents' Introduction to Cybersecurity Bootcamp, Cohort 10 (15 Dec 2024 – 10 Jan 2025).",
    description:
      "CyberTalents' Certificate of Graduation for successfully completing the Introduction to Cybersecurity Bootcamp — Cohort 10, which ran from 15 December 2024 to 10 January 2025. The bootcamp introduces attack vectors and the defensive controls against them through practical CTF-style challenges in web, network, cryptography and forensics.",
    covers: ["Attack vectors", "Defensive controls", "Web security", "Cryptography basics", "Forensics basics", "CTF challenges"],
  },
  {
    slug: "iti-universities-pentesting-bootcamp-2025",
    legacyIndex: 14,
    title: "ITI Universities Pentesting Bootcamp 2025",
    issuer: "CyberTalents & ITI",
    issuerUrl: "https://cybertalents.com/",
    deliveredBy: "Information Technology Institute (ITI)",
    kind: "Bootcamp Certificate",
    group: "courses",
    date: "2025-11-01",
    period: "17 October – 1 November 2025",
    credentialId: "00000002598",
    nameOnDocument: NAME_FULL,
    summary: "Completed the ITI Universities Pentesting Bootcamp 2025 by CyberTalents and ITI (17 Oct – 1 Nov 2025).",
    description:
      "A Certificate of Completion from CyberTalents and the Information Technology Institute (ITI) for successfully completing the ITI Universities Pentesting Bootcamp 2025, which ran from 17 October to 1 November 2025 (certificate no. 00000002598). The bootcamp covers web application vulnerabilities, network exploitation and CTF challenges.",
    covers: ["Web vulnerabilities", "Network exploitation", "Reconnaissance", "CTF challenges"],
  },
  {
    slug: "mahara-tech-cybersecurity-for-beginners",
    legacyIndex: 16,
    title: "Cybersecurity For Beginners",
    issuer: "Mahara-Tech (ITI)",
    issuerUrl: "https://maharatech.gov.eg/",
    deliveredBy: "Ministry of Communications and IT & ITI — content partner VMware",
    kind: "Track Certificate",
    group: "courses",
    date: "2025-04-24",
    hours: "35 hours · 8 courses",
    credentialId: "xyPaGtJUn5",
    nameOnDocument: "Ahmed Emad",
    summary: "Mahara-Tech's Cybersecurity For Beginners track — 8 courses, 35 hours, completed 24 April 2025.",
    description:
      "ITI's platform Mahara-Tech certifies that Ahmed completed the Cybersecurity For Beginners track of its Cybersecurity Academy: 8 courses, 35 hours, completed 24 April 2025, verification code xyPaGtJUn5. Content partner: VMware; the certificate carries the logos of Egypt's Ministry of Communications and IT and ITI. The track covers security principles, the threat landscape, cryptography basics, network and endpoint defence and security operations.",
    covers: ["Security principles", "Threat landscape", "Cryptography basics", "Network defence", "Endpoint defence"],
  },
  {
    slug: "mahara-tech-malware-analysis-fundamentals",
    legacyIndex: 27,
    title: "Malware Analysis Fundamentals",
    issuer: "Mahara-Tech (ITI)",
    issuerUrl: "https://maharatech.gov.eg/",
    kind: "Course Certificate",
    group: "courses",
    date: "2023-06-21",
    hours: "5 h 20 min",
    credentialId: "r1iv6sRbxn",
    nameOnDocument: "Ahmed Emad Nasr",
    summary: "Mahara-Tech's Malware Analysis Fundamentals — 5 h 20 min, completion date 21/06/23, code r1iv6sRbxn.",
    description:
      "ITI's platform Mahara-Tech certifies that Ahmed completed Malware Analysis Fundamentals: course time 5 hours 20 minutes, completion date printed 21/06/23, verification code r1iv6sRbxn. The certificate is issued to every trainee who fulfils the requirements for passing the course. It covers static and dynamic analysis: PE headers, strings and imports, sandbox monitoring and pulling indicators of compromise from a sample.",
    covers: ["Static analysis", "Dynamic analysis", "PE headers", "Strings & imports", "Sandboxing", "IOC extraction"],
  },
  {
    slug: "netriders-sec450-gsoc-prep",
    legacyIndex: 17,
    title: "SEC450 — GSOC Prep",
    issuer: "NetRiders",
    issuerUrl: "https://netriders.academy/",
    kind: "SOC Training",
    group: "courses",
    instructor: "Mohamed Amr",
    nameOnDocument: "Ahmed Emad ELdeen",
    summary: "NetRiders' SEC450 course preparing for the GIAC GSOC: blue-team fundamentals and SOC operations.",
    description:
      "NetRiders' Certificate of Completion for the course SEC450 — GSOC Prep, taught by Mohamed Amr and signed by the CEO & Founder. The course follows SANS SEC450 (Blue Team Fundamentals) and prepares for the GIAC Security Operations Certified (GSOC) exam: how a SOC is built, SIEM architecture, alert triage methodology, network and endpoint telemetry and incident automation. The QR code verifies it against NetRiders' records.",
    covers: ["SOC architecture", "SIEM", "Alert triage methodology", "Network telemetry", "Endpoint telemetry", "Automation"],
  },
  {
    slug: "netriders-sec504-gcih-prep",
    legacyIndex: 21,
    title: "SEC504 — GCIH Prep",
    issuer: "NetRiders",
    issuerUrl: "https://netriders.academy/",
    kind: "Incident Handling",
    group: "courses",
    instructor: "Mohamed Amr",
    nameOnDocument: "Ahmed Emad ELdeen",
    summary: "NetRiders' SEC504 course preparing for the GIAC GCIH: hacker tools, techniques and incident handling.",
    description:
      "NetRiders' Certificate of Completion for the course SEC504 — GCIH Prep, taught by Mohamed Amr and signed by the CEO & Founder. The course follows SANS SEC504 (Hacker Tools, Techniques & Incident Handling) and prepares for the GIAC Certified Incident Handler (GCIH): the NIST SP 800-61 incident handling steps paired with the attacker techniques they answer, memory and network forensics, and containment strategies.",
    covers: ["Incident handling process", "Attacker TTPs", "Memory forensics", "Network forensics", "Containment"],
  },
  {
    slug: "netriders-ecir-prep",
    legacyIndex: 18,
    title: "eCIR Prep",
    issuer: "NetRiders",
    issuerUrl: "https://netriders.academy/",
    kind: "IR & DFIR Training",
    group: "courses",
    instructor: "Ahmed Sultan",
    nameOnDocument: "Ahmed Emad ELdeen",
    summary: "NetRiders' preparation course for INE's eCIR (Certified Incident Responder).",
    description:
      "NetRiders' Certificate of Completion for the course eCIR Prep, taught by Ahmed Sultan. It prepares for INE's eCIR (Certified Incident Responder): investigations in Splunk and ELK, memory and disk forensics, detecting lateral movement, and packet analysis. The QR code verifies it against NetRiders' records.",
    covers: ["Splunk", "ELK", "Memory forensics", "Disk forensics", "Lateral movement detection", "Packet analysis"],
  },
  {
    slug: "netriders-security-plus-sy0-601-prep",
    legacyIndex: 19,
    title: "CompTIA Security+ (SY0-601) Prep",
    issuer: "NetRiders Academy",
    issuerUrl: "https://netriders.academy/",
    kind: "Security Training",
    group: "courses",
    hours: "35 h",
    credentialId: "c6a0abc9d26293be",
    instructor: "Ahmed Sultan",
    nameOnDocument: "ahmedemad-ae",
    summary: "NetRiders Academy's 35-hour Security+ SY0-601 preparation course (certification ID c6a0abc9d26293be).",
    description:
      "NetRiders Academy's Certificate of Completion for the course Security+ SY0-601 Prep — 35 hours, instructor Ahmed Sultan, certification ID c6a0abc9d26293be (issued to the academy username ahmedemad-ae). The course covers the five domains of CompTIA Security+ SY0-601: attacks, threats and vulnerabilities; architecture and design; implementation; operations and incident response; and governance, risk and compliance.",
    covers: ["Threats & vulnerabilities", "Security architecture", "Implementation", "Operations & incident response", "Governance, risk & compliance"],
  },
  {
    slug: "netriders-digital-forensics-fundamentals",
    legacyIndex: 33,
    title: "Digital Forensics Fundamentals",
    issuer: "NetRiders",
    issuerUrl: "https://netriders.academy/",
    kind: "DFIR Training",
    group: "courses",
    instructor: "AbdelAleem Khaled",
    nameOnDocument: "Ahmed Emad ELdeen",
    summary: "NetRiders' Digital Forensics Fundamentals course, taught by AbdelAleem Khaled.",
    description:
      "NetRiders' Certificate of Completion for the course Digital Forensics Fundamentals, taught by AbdelAleem Khaled and signed by the CEO & Founder. The course covers chain of custody, disk imaging, Windows registry and event log artefacts, browser forensics and writing the forensic report.",
    covers: ["Chain of custody", "Disk imaging", "Registry artefacts", "Event logs", "Browser forensics", "Forensic reporting"],
  },
  {
    slug: "netriders-ejptv1-prep",
    legacyIndex: 34,
    title: "eJPTv1 Prep",
    issuer: "NetRiders Academy",
    issuerUrl: "https://netriders.academy/",
    kind: "Pentest Training",
    group: "courses",
    date: "2024-11-25",
    hours: "55 h online",
    credentialId: "f90e528e8beb0086",
    nameOnDocument: "Ahmed Emad ELdeen Abdelmoneam",
    summary: "NetRiders Academy's 55-hour online eJPTv1 preparation course, 25 November 2024.",
    description:
      "NetRiders Academy's Certificate of Achievement: Ahmed successfully completed the 55-hour online course eJPTv1 Prep on 25 November 2024 (valid certificate ID f90e528e8beb0086). The course prepares for INE's eJPT with practical labs: footprinting and scanning with Nmap, web attacks, password cracking, exploitation and pivoting.",
    covers: ["Footprinting", "Nmap scanning", "Web attacks", "Password cracking", "Exploitation", "Pivoting"],
  },
  {
    slug: "udemy-red-teaming-ethical-hacking-bug-hunting-penetration-test",
    legacyIndex: 20,
    title: "Red Teaming, Ethical Hacking, Bug Hunting & Penetration Test",
    issuer: "Udemy",
    issuerUrl: "https://www.udemy.com/",
    kind: "Course Certificate",
    group: "courses",
    date: "2025-11-01",
    hours: "94 total hours",
    credentialId: "UC-8e74c3b3-0f83-4d2d-980b-6591d2d0e233",
    verifyUrl: "https://ude.my/UC-8e74c3b3-0f83-4d2d-980b-6591d2d0e233",
    instructor: "Hossam Ayman Shady",
    nameOnDocument: "Ahmed Emad Eldeen Abdelmonem Mousa Nasr",
    summary: "A 94-hour Udemy course in offensive security by Hossam Ayman Shady, completed 1 November 2025.",
    description:
      "Udemy's Certificate of Completion for Red Teaming, Ethical Hacking, Bug Hunting & Penetration Test, taught by Hossam Ayman Shady. Date 1 November 2025, length 94 total hours, certificate UC-8e74c3b3-0f83-4d2d-980b-6591d2d0e233 (reference number 0004). The course covers reconnaissance, the OWASP Top 10 web vulnerabilities, bug-bounty hunting, network attacks, privilege escalation, red-team operations and report writing.",
    covers: ["Reconnaissance", "OWASP Top 10", "Bug hunting", "Network attacks", "Privilege escalation", "Red teaming", "Reporting"],
  },
  {
    slug: "huawei-hccda-tech-essentials-course",
    legacyIndex: 23,
    title: "HCCDA — Tech Essentials Course",
    issuer: "Huawei ICT Academy",
    issuerUrl: "https://e.huawei.com/en/talent/",
    kind: "Course Certificate",
    group: "courses",
    date: "2025-09-10",
    credentialId: "ICT20250910000215",
    nameOnDocument: "Ahmed Emad Eldeen",
    summary: "Huawei ICT Academy course certificate for HCCDA — Tech Essentials (study and course exam), 10 September 2025.",
    description:
      "A Huawei ICT Academy Certificate of Completion: Ahmed successfully completed the study and the course exam of the HCCDA — Tech Essentials course. Issue date 10 September 2025, certificate code ICT20250910000215. The course covers Huawei Cloud's essentials for developers and architects: compute, storage, VPC networking, IAM and cloud security controls. It was taught as the Huawei Cloud module of ITI's 120-hour Cyber Security course.",
    covers: ["Huawei Cloud compute", "Cloud storage", "VPC networking", "Cloud IAM", "Cloud security"],
    note: "As the certificate itself notes, it verifies completion of the course and does not represent passing the Huawei Certification exam.",
  },
  {
    slug: "huawei-hcia-datacom-v1-course",
    legacyIndex: 24,
    title: "HCIA-Datacom V1.0 Course",
    issuer: "Huawei Talent Online",
    issuerUrl: "https://e.huawei.com/en/talent/",
    kind: "Course Certificate",
    group: "courses",
    date: "2024-08-23",
    nameOnDocument: "Ahmed Emad",
    summary: "Huawei Talent Online course certificate: completed and passed the HCIA-Datacom V1.0 course, 23 August 2024.",
    description:
      "A Huawei Talent Online course certificate (结课证书): Ahmed successfully completed and received a passing grade in the HCIA-Datacom V1.0 Course. Date of issue 23 August 2024, signed by the director of the ICT Talent Partner Development Department, Huawei ICT Strategy & Marketing. The course covers enterprise data communication on Huawei VRP: switching, VLANs and STP, OSPF routing, ACLs, NAT, IPsec VPN and network management.",
    covers: ["Huawei VRP", "VLANs & STP", "OSPF", "ACLs", "NAT", "IPsec VPN", "Network management"],
    note: "As the certificate itself notes, it proves the course assessment was passed and does not represent the Huawei certification of the technology domain.",
  },
  {
    slug: "huawei-hcia-datacom-learning-course-attendance",
    legacyIndex: 35,
    title: "Huawei HCIA-Datacom Learning Course — Certificate of Attendance",
    issuer: "Huawei",
    issuerUrl: "https://e.huawei.com/",
    kind: "Course Attendance",
    group: "courses",
    period: "28 July – 5 September 2024",
    date: "2024-09-05",
    nameOnDocument: "Ahmed Emad El-Din Abdelmonem",
    summary: "Attended and completed Huawei's HCIA-Datacom learning course, 28 July – 5 September 2024.",
    description:
      "A Certificate of Attendance stating that Ahmed successfully completed the Huawei HCIA-Datacom Learning Course, from 28 July 2024 to 5 September 2024. The instructor-led course practised enterprise routing, switching and network security on lab topologies in Huawei eNSP, and ended with the online course exam recorded on the HCIA-Datacom V1.0 course certificate.",
    covers: ["Enterprise routing", "Switching", "Network security", "Huawei eNSP labs"],
  },
  {
    slug: "huawei-hcia-cloud-computing-v5-course",
    legacyIndex: 25,
    title: "HCIA-Cloud Computing V5.0 Course",
    issuer: "Huawei ICT Academy",
    issuerUrl: "https://e.huawei.com/en/talent/",
    kind: "Course Certificate",
    group: "courses",
    date: "2025-07-24",
    credentialId: "EBG20250724000003",
    nameOnDocument: "Ahmed Emad",
    summary: "Huawei ICT Academy course certificate for HCIA-Cloud Computing V5.0 (study and course exam), 24 July 2025.",
    description:
      "A Huawei ICT Academy Certificate of Completion: Ahmed successfully completed the study and the course exam of the HCIA-Cloud Computing V5.0 Course. Issue date 24 July 2025, certificate code EBG20250724000003. The course covers virtualisation of compute, network and storage, cloud resource pools, FusionCompute and hardening the virtual environment.",
    covers: ["Compute virtualisation", "Network virtualisation", "Storage virtualisation", "Cloud resource pools", "FusionCompute"],
    note: "As the certificate itself notes, it verifies completion of the course and does not represent passing the Huawei Certification exam.",
  },

  /* ─── Exam score reports ─── */
  {
    slug: "cisco-ccna-200-301-certification-practice-exam-98",
    legacyIndex: 37,
    title: "CCNA (200-301) Certification Practice Exam — 98%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem03 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 98%",
    group: "exams",
    date: "2024-12-21",
    score: "98%",
    nameOnDocument: "—",
    summary: "The full CCNA 200-301 certification practice exam, passed with 98% (December 2024).",
    description:
      "The result page of the CCNA (200-301) Certification Practice Exam in Cisco Networking Academy, class CCNA: Sem03 — SecurityDept — G02: 2024-2025. The exam opened on 18 December 2024 and was due 21 December 2024 (100 points). Score: 98% — \"Congratulations, you have passed the assessment.\" The breakdown by exam domain shows 100% in Network Fundamentals, Network Access, IP Services, Security Fundamentals, and Automation and Programmability.",
    covers: ["Network Fundamentals", "Network Access", "IP Connectivity", "IP Services", "Security Fundamentals", "Automation & Programmability"],
  },
  {
    slug: "cisco-network-security-course-final-exam-97",
    legacyIndex: 38,
    title: "Network Security — Course Final Exam, 97%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    kind: "Exam Score · 97%",
    group: "exams",
    score: "97%",
    nameOnDocument: "—",
    summary: "The final exam of Cisco's Network Security course, passed with 97%.",
    description:
      "The result page of the Course Final Exam of Cisco Networking Academy's Network Security course. Score: 97% — \"Congratulations, you have passed the exam.\" The course outline beside it shows every module completed at 100%, including VPNs, site-to-site IPsec VPNs, the ASA, ASA firewall configuration and network security testing.",
    covers: ["Firewalls & ASA", "AAA", "IPS", "Site-to-site IPsec VPN", "Layer 2/3 security", "Network security testing"],
  },
  {
    slug: "cisco-ccna-introduction-to-networks-final-exam-98",
    legacyIndex: 39,
    title: "CCNA Semester 1 — Course Final Exam, 98%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem01 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 98%",
    group: "exams",
    score: "98%",
    nameOnDocument: "—",
    summary: "CCNA: Introduction to Networks — course final exam passed with 98%.",
    description:
      "The result page of the CCNA: Introduction to Networks Course Final Exam, class CCNA: Sem01 — SecurityDept — G02: 2024-2025. Score: 98% — \"Congratulations, you have passed the exam.\"",
    covers: ["Network fundamentals", "IP addressing", "Ethernet", "Application layer", "Network security fundamentals", "Building a small network"],
  },
  {
    slug: "cisco-ccna-srwe-final-exam-92",
    legacyIndex: 40,
    title: "CCNA Semester 2 — Course Final Exam, 92%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem02 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 92%",
    group: "exams",
    score: "92%",
    nameOnDocument: "—",
    summary: "CCNA: Switching, Routing & Wireless Essentials — course final exam passed with 92%.",
    description:
      "The result page of the CCNA: Switching, Routing, and Wireless Essentials Course Final Exam, class CCNA: Sem02 — SecurityDept — G02: 2024-2025. Score: 92% — \"Congratulations, you have passed the exam.\"",
    covers: ["Switching", "VLANs", "STP", "EtherChannel", "Static routing", "Wireless LANs"],
  },
  {
    slug: "cisco-ccna-ensa-final-exam-88",
    legacyIndex: 41,
    title: "CCNA Semester 3 — Course Final Exam, 88%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem03 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 88%",
    group: "exams",
    score: "88%",
    nameOnDocument: "—",
    summary: "CCNA: Enterprise Networking, Security & Automation — course final exam passed with 88%.",
    description:
      "The result page of the Enterprise Networking, Security, and Automation Final Exam, class CCNA: Sem03 — SecurityDept — G02: 2024-2025. Score: 88% — \"Congratulations, you have passed the exam.\"",
    covers: ["OSPF", "ACLs", "NAT", "VPN", "Network virtualisation", "Network automation"],
  },
  {
    slug: "cisco-ccna-checkpoint-ip-addressing-100",
    legacyIndex: 42,
    title: "CCNA Semester 1 — Checkpoint Exam: IP Addressing, 100%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem01 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 100%",
    group: "exams",
    score: "100%",
    nameOnDocument: "—",
    summary: "A perfect 100% on the IP Addressing checkpoint exam (IPv4 networks, IPv6 addressing).",
    description:
      "The result page of the Checkpoint Exam: IP Addressing Exam, class CCNA: Sem01 — SecurityDept — G02: 2024-2025. Score: 100% — \"Congratulations, you have passed the assessment.\" Every learning objective at 100%: IPv4 networks, connectivity utilities and IPv6 addressing.",
    covers: ["IPv4 networks", "Subnetting & VLSM", "Connectivity utilities", "IPv6 addressing"],
  },
  {
    slug: "cisco-ccna-checkpoint-switching-vlans-inter-vlan-routing-97",
    legacyIndex: 43,
    title: "CCNA Semester 2 — Checkpoint Exam: Switching, VLANs & Inter-VLAN Routing, 97%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem02 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 97%",
    group: "exams",
    score: "97%",
    nameOnDocument: "—",
    summary: "97% on the Switching Concepts, VLANs and Inter-VLAN Routing checkpoint exam.",
    description:
      "The result page of the Checkpoint Exam: Switching Concepts, VLANs, and Inter-VLAN Routing Exam, class CCNA: Sem02 — SecurityDept — G02: 2024-2025. Score: 97% — \"Congratulations, you have passed the assessment.\" By objective: initial device configuration security 100%, switching operation 100%, VLANs 77.8%, inter-VLAN routing on subinterfaces 100%.",
    covers: ["Initial device configuration", "Switching operation", "VLANs & 802.1Q trunking", "Router-on-a-stick"],
  },
  {
    slug: "cisco-ccna-checkpoint-ospf-concepts-configuration-100",
    legacyIndex: 44,
    title: "CCNA Semester 3 — Checkpoint Exam: OSPF Concepts & Configuration, 100%",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    deliveredBy: "CCNA: Sem03 — SecurityDept — G02: 2024-2025",
    kind: "Exam Score · 100%",
    group: "exams",
    date: "2024-12-21",
    score: "100%",
    nameOnDocument: "—",
    summary: "A perfect 100% on the OSPF Concepts and Configuration checkpoint exam.",
    description:
      "The result page of the Checkpoint Exam: OSPF Concepts and Configuration Exam, class CCNA: Sem03 — SecurityDept — G02: 2024-2025. Opened 18 December 2024, due 21 December 2024 (100 points). Score: 100% — \"Congratulations, you have passed the assessment.\" Both objectives at 100%: OSPF operation, and troubleshooting with a systematic approach.",
    covers: ["OSPF neighbour adjacencies", "DR/BDR election", "OSPF configuration", "Systematic troubleshooting"],
  },

  /* ─── Verified badges ─── */
  {
    slug: "ejpt-junior-penetration-tester-badge",
    legacyIndex: 45,
    title: "eJPT — Junior Penetration Tester Badge",
    issuer: "INE Security",
    issuerUrl: "https://security.ine.com/",
    kind: "Verified Badge",
    group: "badges",
    date: "2026-02-15",
    nameOnDocument: "—",
    summary: "INE Security's digital badge for passing the eJPT exam.",
    description:
      "The official digital badge INE Security issues with the eJPT — Junior Penetration Tester certification (certification ID 174485594, awarded 15 February 2026). The badge is the shareable proof of the certification on profiles such as LinkedIn.",
    covers: ["eJPT certification"],
  },
  {
    slug: "cisco-badge-ccna-introduction-to-networks",
    legacyIndex: 46,
    title: "Verified Badge — CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    kind: "Verified Badge",
    group: "badges",
    date: "2024-12-22",
    nameOnDocument: "—",
    summary: "Cisco Networking Academy's Verified badge for CCNA: Introduction to Networks.",
    description:
      "Cisco Networking Academy's Verified digital badge (issued through Credly) for completing CCNA: Introduction to Networks — the badge that goes with the course certificate of 22 December 2024.",
    covers: ["CCNA: Introduction to Networks"],
  },
  {
    slug: "cisco-badge-ccna-switching-routing-wireless-essentials",
    legacyIndex: 47,
    title: "Verified Badge — CCNA: Switching, Routing & Wireless Essentials",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    kind: "Verified Badge",
    group: "badges",
    date: "2024-12-22",
    nameOnDocument: "—",
    summary: "Cisco Networking Academy's Verified badge for CCNA: Switching, Routing & Wireless Essentials.",
    description:
      "Cisco Networking Academy's Verified digital badge (issued through Credly) for completing CCNA: Switching, Routing & Wireless Essentials — the badge that goes with the course certificate of 22 December 2024.",
    covers: ["CCNA: Switching, Routing & Wireless Essentials"],
  },
  {
    slug: "cisco-badge-ccna-enterprise-networking-security-automation",
    legacyIndex: 48,
    title: "Verified Badge — CCNA: Enterprise Networking, Security & Automation",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    kind: "Verified Badge",
    group: "badges",
    date: "2024-12-22",
    nameOnDocument: "—",
    summary: "Cisco Networking Academy's Verified badge for CCNA: Enterprise Networking, Security & Automation.",
    description:
      "Cisco Networking Academy's Verified digital badge (issued through Credly) for completing CCNA: Enterprise Networking, Security & Automation — the badge that goes with the course certificate of 22 December 2024.",
    covers: ["CCNA: Enterprise Networking, Security & Automation"],
  },
  {
    slug: "cisco-badge-junior-cybersecurity-analyst-career-path",
    legacyIndex: 49,
    title: "Verified Badge — Junior Cybersecurity Analyst Career Path",
    issuer: "Cisco Networking Academy",
    issuerUrl: "https://www.netacad.com/",
    kind: "Verified Badge",
    group: "badges",
    date: "2025-10-18",
    nameOnDocument: "—",
    summary: "Cisco Networking Academy's Verified badge for the Junior Cybersecurity Analyst Career Path.",
    description:
      "Cisco Networking Academy's Verified digital badge (issued through Credly) for completing the Junior Cybersecurity Analyst Career Path — the badge that goes with the career-path certificate issued 18 October 2025.",
    covers: ["Junior Cybersecurity Analyst Career Path"],
  },
];

/* Every certificate on the site: the ones above, then the Credly badges
   that are not among them (scripts/sync-credly.mjs, every deploy) */
export const CERTIFICATES: readonly Certificate[] = [...LISTED, ...CREDLY_BADGES];

/* ─── Helpers ─── */

const CERTIFICATE_FOLDER = "Assets/certificates";

/** The scan: Assets/certificates/<slug>.webp (no leading slash — normalizePublicHref adds the base path) */
export const certificateImagePath = (slug: string): string => `${CERTIFICATE_FOLDER}/${slug}.webp`;
/** The 640px card picture made by npm run thumbs */
export const certificateThumbPath = (slug: string): string => `${CERTIFICATE_FOLDER}/${slug}-thumb.webp`;
/** The certificate's own page */
export { certificatePagePath } from "@/data/certificate-paths";

export const certificateBySlug = (slug: string): Certificate | undefined => CERTIFICATES.find((c) => c.slug === slug);

/** Certificates of one group */
export const certificateGroupCount = (group: CertificateGroup): number =>
  CERTIFICATES.filter((c) => c.group === group).length;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-02-15" → "15 February 2026", "2026-08" → "August 2026", "2025" → "2025" */
const formatCertificateDate = (date?: string): string | undefined => {
  if (!date) return undefined;
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return String(y);
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
};

/** When, for display: the period if there is one, else the date */
export const certificateWhen = (c: Certificate): string | undefined => c.period ?? formatCertificateDate(c.date);

/** The words for search engines and for the image file's own metadata */
export const certificateKeywords = (c: Certificate): string[] => [
  ...new Set([
    "Ahmed Emad Nasr",
    "Ahmed Emad",
    c.title,
    c.issuer,
    c.kind,
    ...(c.credentialId ? [c.credentialId] : []),
    ...c.covers.map((t) => t.replace(/\s+—\s+\d+\s*h$/, "")),
    "cybersecurity certificate",
    "information security",
  ]),
];

/** One sentence that describes the image itself (alt text, image caption) */
export const certificateAlt = (c: Certificate): string =>
  `${c.title} — ${c.kind.toLowerCase()} issued by ${c.issuer} to Ahmed Emad Nasr${certificateWhen(c) ? `, ${certificateWhen(c)}` : ""}.`;
