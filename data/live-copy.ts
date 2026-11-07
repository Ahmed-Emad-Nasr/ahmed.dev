/*
 * Home-page copy that quotes numbers computed from the case library.
 * SERVER-ONLY: it pulls in the case data; page.tsx passes the finished
 * strings to the client sections as props.
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
  heroEvidence: `${investigationReportCount} investigation reports · ${coveredTechniqueCount()} attack techniques covered`,
  stats: [
    { target: investigationReportCount, suffix: "", label: "Investigation reports", href: `${normalizePublicHref("/blog")}?kind=investigation#cases` },
    { target: ALL_GALLERY_CERTIFICATES.length, suffix: "", label: "Certificates & badges", href: `${normalizePublicHref("/gallery")}#all-certificates` },
    { target: 300, suffix: "+", label: "Students taught", href: "#teaching" },
    { target: 60, suffix: "K+", label: "YouTube views", href: `${normalizePublicHref("/blog")}#videos` },
  ],
};
