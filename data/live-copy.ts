/*
 * Home-page copy that quotes numbers computed from the case library.
 * SERVER-ONLY: it pulls in the case data; page.tsx passes the finished
 * strings to the client sections as props.
 *
 * ═══ data/live-copy.ts ═══
 *   heroDescription → the hero's summary paragraph (= CV_SUMMARY in data/cv.ts)
 *   heroEvidence    → the "Evidence" row in the hero's field record
 *   stats           → the 4 tiles of StatsBar under the roles cards:
 *                     target = number, suffix = "+" / "K+", label, japanese,
 *                     href = where the tile links
 */

import type { Stat } from "@/data/types";
import { investigationReportCount } from "@/data/cases";
import { ALL_GALLERY_CERTIFICATES } from "@/data/certifications";
import { coveredTechniqueCount } from "@/data/attack";
import { CV_SUMMARY } from "@/data/cv";
import { normalizePublicHref } from "@/lib/shared";

type LiveCopy = {
  heroDescription: string;
  heroEvidence: string;
  stats: Stat[];
};

export const LIVE_COPY: LiveCopy = {
  heroDescription: CV_SUMMARY,
  heroEvidence: `${investigationReportCount} incident investigations · ${coveredTechniqueCount()} attack techniques covered`,
  stats: [
    { target: investigationReportCount, suffix: "", label: "Incident investigations", japanese: "記録", href: `${normalizePublicHref("/blog")}?kind=investigation#cases` },
    { target: ALL_GALLERY_CERTIFICATES.length, suffix: "", label: "Certificates earned", japanese: "認定", href: `${normalizePublicHref("/gallery")}#all-certificates` },
    { target: 300, suffix: "+", label: "Students taught", japanese: "指導", href: "#teaching" },
    { target: 60, suffix: "K+", label: "YouTube views", japanese: "動画", href: `${normalizePublicHref("/blog")}#videos` },
  ],
};
