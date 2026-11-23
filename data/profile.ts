/*
 * Who the site is about: name, title, contact links and the hero's
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
 *   PROFILE.focus               the hero's "Focus" row
 *   PROFILE.contact             e-mail, phone, socials — used site-wide
 *   PROFILE.hero.tagline/specs  hero tagline + the spec strip
 *
 * Also reachable as PORTFOLIO_DATA.profile (same object).
 */

import type { Profile } from "@/data/types";
import { CV_FROM_PDF } from "@/data/cv-from-pdf";
import {
  CV_PDF_HREF, GITHUB_USERNAME, HOME_LOCATION, INSTAGRAM_URL, LINKEDIN_URL, MEDIUM_URL, TIKTOK_URL, X_URL,
  YOUTUBE_CHANNEL_URL, normalizePublicHref,
} from "@/lib/shared";

/* The CV's phone as digits with the country code ("+20 101 …" → "20101…"),
   only when it is a full international number */
const cvPhone = CV_FROM_PDF?.sections.contact?.phone?.replace(/[^\d+]/g, "");
const CV_PHONE = cvPhone && /^\+\d{10,15}$/.test(cvPhone) ? cvPhone.slice(1) : undefined;
const CV_EMAIL = CV_FROM_PDF?.sections.contact?.email || undefined;

export const PROFILE: Profile = {
  name: "Ahmed Emad Nasr",
  title: "Information Security Officer / SOC Analyst",
  availability: "Open to InfoSec roles: Officer, Engineer, GRC, SOC, IR/DFIR, IAM and Security Education",
  /* The areas shown on the hero's "Focus" row */
  focus: ["GRC", "SOC", "IR & DFIR", "Malware", "IAM", "Data Security"],
  /* E-mail, phone and WhatsApp follow the CV PDF when it has them
     (data/cv-from-pdf.ts); the values here are the fallback */
  contact: {
    email: CV_EMAIL ?? "ahmed.em.nasr@gmail.com",
    phone: CV_PHONE ? `+${CV_PHONE}` : "+201013972690",
    github: GITHUB_USERNAME,
    linkedin: LINKEDIN_URL,
    wuzzuf: "https://wuzzuf.net/me/ahmed-emad-nasr",
    location: HOME_LOCATION.workArea,
    whatsapp: CV_PHONE ?? "201013972690",
    youtube: YOUTUBE_CHANNEL_URL,
    instagram: INSTAGRAM_URL,
    x: X_URL,
    tiktok: TIKTOK_URL,
    medium: MEDIUM_URL,
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
