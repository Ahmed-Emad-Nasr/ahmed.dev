/*
 * Home-page copy that quotes numbers computed from the case library.
 * SERVER-ONLY: it pulls in the case data; page.tsx passes the finished
 * strings to the client sections as props.
 *
 * ═══ data/live-copy.ts ═══
 *   heroDescription → the hero's summary paragraph (CV_SUMMARY below)
 *   stats           → the 4 tiles of StatsBar between the hero and the What I Do cards:
 *                     target = number, suffix = "+" / "K+", label,
 *                     href = where the tile links (a route inside the site,
 *                     like "/blog#videos": it opens without a page reload)
 */

import type { Stat } from "@/data/types";
import { investigationReportCount, publishedCaseCount } from "@/data/cases";
import { PROFESSIONAL_CERTIFICATION_COUNT } from "@/data/certifications";
import { coveredTechniqueCount } from "@/data/attack";
import { AUDIENCE } from "@/lib/shared";

/** The hero summary — the same opening line as the CV PDF (its numbers are
    computed from the data) */
const CV_SUMMARY =
  "Information security officer working across GRC and compliance, security operations, DFIR, IAM and data security. " +
  `The record so far: ${investigationReportCount} hands-on investigation reports from labs and simulations, across ${publishedCaseCount} documented cases, ` +
  `${coveredTechniqueCount()} MITRE ATT&CK techniques mapped, a detection rule merged into SOC Fortress, ` +
  "GRC gap assessments at Banque Misr, and 300+ students taught at AMIT & NTI.";

type LiveCopy = {
  heroDescription: string;
  stats: Stat[];
};

export const LIVE_COPY: LiveCopy = {
  heroDescription: CV_SUMMARY,
  stats: [
    { target: investigationReportCount, suffix: "", label: "Hands-on investigations", href: "/blog?kind=investigation#cases" },
    { target: PROFESSIONAL_CERTIFICATION_COUNT, suffix: "", label: "Professional certifications", href: "/certificates" },
    { target: 300, suffix: "+", label: "Students taught", href: "/teaching" },
    { target: Math.floor(AUDIENCE.youtubeViews / 1000), suffix: "K+", label: "YouTube views", href: "/blog#videos" },
  ],
};
