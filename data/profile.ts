/*
 * Who the site is about: name, title, roles, contact links and the hero's
 * tagline / spec strip.
 *
 * ═══ data/profile.ts — PROFILE ═══
 * This file is deliberately tiny and imports no other content: the hero, the
 * footer bar, the command palette and the terminal all read it, so it is in
 * the first JavaScript every page downloads. The heavy lists (projects,
 * experience, certificates) stay in data/portfolio-data.ts and load later,
 * with the sections that show them.
 *
 *   PROFILE.name / title …      hero name, title, badge, availability
 *   PROFILE.roles               the typing role line in the hero
 *   PROFILE.focus               the hero's "Focus" row
 *   PROFILE.contact             e-mail, phone, socials — used site-wide
 *   PROFILE.hero.tagline/specs  hero tagline + the spec strip
 *
 * Also reachable as PORTFOLIO_DATA.profile (same object).
 */

import type { Profile } from "@/data/types";
import { CV_PDF_HREF, GITHUB_USERNAME, HOME_LOCATION, YOUTUBE_CHANNEL_URL, normalizePublicHref } from "@/lib/shared";

export const PROFILE: Profile = {
  name: "Ahmed Emad Nasr",
  title: "Information Security Officer",
  japaneseTitle: "情報セキュリティ担当 • Information Security Officer",
  availability: "Open to InfoSec roles: Officer, Engineer, GRC, SOC, IR/DFIR, IAM and Security Education",
  /* The areas shown on the hero's "Focus" row */
  focus: ["GRC", "SOC", "IR & DFIR", "Malware", "IAM", "Data Security"],
  roles: [
    "Information Security Officer",
    "Information Security Engineer",
    "GRC & Compliance Analyst",
    "SOC Analyst (L1/L2)",
    "DFIR & Malware Analyst",
    "IAM & Data Security Analyst",
    "Cybersecurity Instructor",
  ],
  contact: {
    email: "ahmed.em.nasr@gmail.com",
    phone: "+201013972690",
    github: GITHUB_USERNAME,
    linkedin: "https://www.linkedin.com/in/ahmed-emad-nasr/",
    location: HOME_LOCATION.label,
    whatsapp: "201013972690",
    youtube: YOUTUBE_CHANNEL_URL,
    instagram: "https://www.instagram.com/ahmed_emad_nasr/",
    x: "https://x.com/0x3omda",
    /* PGP key fingerprint, e.g. "ABCD 1234 …". Empty = no key published yet.
       Filling it in (with the public key saved as public/pgp-key.asc) adds
       the "PGP" link to the footer and the Encryption line to
       /.well-known/security.txt. Steps: SECURITY.md. */
    pgpFingerprint: "",
  },
  hero: {
    tagline: "From the risk register to the root cause.",
    /* The "Technical Specifications" strip under the name */
    specs: [
      { label: "Govern", value: "ISO 27001, PCI DSS, NIST CSF" },
      { label: "Detect", value: "Wazuh, Splunk, ATT&CK" },
      { label: "Respond", value: "NIST 800-61, Volatility, YARA" },
      { label: "Protect", value: "IAM, PAM, DLP" },
    ],
    cvUrl: normalizePublicHref(CV_PDF_HREF),
  },
};
