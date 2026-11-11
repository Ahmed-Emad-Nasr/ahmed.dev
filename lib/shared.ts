/*
 * lib/shared.ts — the case/video types and the small helpers used across
 * the site (asset paths, dates, case kinds, defanging).
 *
 * Most used helpers:
 *   normalizePublicHref("Assets/x.pdf") → "/ahmed.dev/Assets/x.pdf" in production.
 *     ALWAYS wrap paths to files in public/ with it (images, PDFs) when you
 *     write a plain <a>/<img> — otherwise they break on GitHub Pages, where
 *     the site lives under /ahmed.dev. (next/link and PageLink add it for you.)
 *   CV_PDF_HREF → the CV file. Replace the PDF in public/Assets/cv/ with the
 *     same name, or change this path.
 *   CASE_KINDS / caseKindOf → how a case's `type` becomes its kind filter.
 *   defang() → shows IOCs safely (1.2.3[.]4, hxxp://…).
 */

export type PdfResource = {
  id: string;
  title: string;
  /** investigation / project / lab / note — see caseKindOf below */
  kind?: CaseKind;
  /** From case-details.ts, for the card's verdict line and severity badge */
  verdict?: string;
  severity?: string;
  description?: string;
  platform: string;
  type: string;
  category?: string;
  difficulty?: string;
  /** The PDF report — absent for image-only cases */
  href?: string;
  tags?: readonly string[];
  tools?: readonly string[];
  skillsGained?: readonly string[];
  readTime?: number;
  date?: string;
};

export type GalleryState = {
  title: string;
  screenshots: string[];
  index: number;
};

export type ChannelVideo = {
  videoId: string;
  title: string;
  description?: string;
  publishedAt?: string;
  sourceUrl: string;
  caseId?: string;
  tags?: readonly string[];
};

export type CaseEvidence = {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
  category: string;
  difficulty: string;
  /** The PDF report — absent for image-only cases */
  href?: string;
  tags: readonly string[];
  tools: readonly string[];
  skillsGained: readonly string[];
  readTime: number;
  date: string;
  image?: string;
};

export type BlogYoutubeVideo = {
  videoId: string;
  title: string;
  description?: string;
  publishedAt: string;
  tags?: readonly string[];
  /** The case page this video walks through, when there is one */
  caseId?: string;
};

export type FeaturedYoutubeVideo = {
  videoId: string;
  title: string;
  description?: string;
  sourceUrl: string;
};

export type BlogYoutubePlaylist = {
  playlistId: string;
  title: string;
  description?: string;
  sourceUrl: string;
  thumbnailVideoId?: string;
  tags?: readonly string[];
  videoCount?: number;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** The CV PDF, in public/ */
export const CV_PDF_HREF = "Assets/cv/AhmedEmadNasr_CV.pdf";

/** A public/ asset path with the deploy prefix (/ahmed.dev in production).
    If the repo is renamed, set NEXT_PUBLIC_BASE_PATH (see .env.example) and
    basePath in next.config.mjs to the new name. */
export const normalizePublicHref = (href: string): string => {
  if (/^https?:\/\//i.test(href)) return href;
  const basePath =
    process.env.NEXT_PUBLIC_BASE_PATH ??
    (process.env.NODE_ENV === "production" ? "/ahmed.dev" : "");
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `${basePath}${normalized}`.replace(/\/\//g, "/");
};

/** The thumbnail next to an image (npm run thumbs): a.webp → a-thumb.webp */
export const getThumbnail = (imgPath: string): string =>
  imgPath.replace(/(\.webp|\.png|\.jpg|\.jpeg)$/i, "-thumb$1");

export const formatDate = (value: string): string => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : dateFormatter.format(parsed);
};

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@AhmedEmad-0x3omda";

/* Where he lives — the ONE place the personal location is written. The
   profile, the terminal, the JSON-LD and the geo meta tags all read
   it. (Each job's own city stays on its Experience card, data/portfolio-data.ts.) */
export const HOME_LOCATION = {
  label: "Benha, Egypt",
  city: "Benha",
  region: "Qalyubia",
  regionCode: "EG-KB",
  country: "EG",
  lat: 30.4667,
  lng: 31.1833,
} as const;

/* The GitHub account: profile links, project links and the contribution graph */
export const GITHUB_USERNAME = "Ahmed-Emad-Nasr";

/* This site's own repository (the security policy link in security.txt) */
export const REPO_URL = `https://github.com/${GITHUB_USERNAME}/ahmed.dev`;

/* The PGP public key, in public/ — see SECURITY.md for how to add it */
export const PGP_KEY_FILE = "pgp-key.asc";

/* ── Case kinds ──────────────────────────────────────────────────────────
   The library mixes four different things, and a reviewer reads them very
   differently: an incident report is evidence of the job, a capstone or rule
   pack is something built, a lab write-up is practice, and a learning-room
   note is study. The kind is derived from the case type (plus a short list of
   learning rooms), so a new case is classified without extra data. */

export type CaseKind = "investigation" | "project" | "lab" | "note";

export const CASE_KINDS: readonly { id: CaseKind; label: string; short: string }[] = [
  { id: "investigation", label: "Investigations & reports", short: "Investigation" },
  { id: "project", label: "Projects & rule packs", short: "Project" },
  { id: "lab", label: "Labs & write-ups", short: "Lab" },
  { id: "note", label: "Learning notes", short: "Note" },
];

const REPORT_TYPES = new Set(["PDF Report", "DOCX & PDF Report", "Report"]);
const PROJECT_TYPES = new Set(["Project Report", "Team Playbook", "Detection Rules", "Intel Brief"]);

/* TryHackMe learning rooms: concept walkthroughs rather than hands-on investigations */
const NOTE_IDS = new Set([
  "iam-access-control-room",
  "offensive-security-intro",
  "soc-l2-alert-triage",
  "report-writing-soc-l2",
  "defensive-security-trends",
  "monitoring-active-directory",
  "intro-to-antivirus",
  "intro-to-digital-forensics",
  "legal-considerations-dfir",
]);

export const caseKindOf = (c: { id: string; type: string }): CaseKind =>
  REPORT_TYPES.has(c.type) ? "investigation" : PROJECT_TYPES.has(c.type) ? "project" : NOTE_IDS.has(c.id) ? "note" : "lab";

export const isReportType = (type: string) => REPORT_TYPES.has(type);

/* Show a network indicator without making it clickable or resolvable:
   84.38.130.118 → 84.38.130[.]118, http://a.b/c.sct → hxxp://a[.]b/c.sct,
   x@pm.me → x[@]pm[.]me. Hashes and file paths pass through unchanged. */
export const defang = (value: string): string => {
  const m = value.match(/^([a-z]+:\/\/)?([^/\s]+)(.*)$/i);
  if (!m) return value;
  const scheme = (m[1] ?? "").replace(/^http/i, "hxxp");
  const host = m[2].replace("@", "[@]").replace(/\.(?=[^.]*$)/, "[.]");
  return `${scheme}${host}${m[3]}`;
};
