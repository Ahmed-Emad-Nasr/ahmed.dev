/* /sitemap.xml with absolute URLs (SITE_BASE_URL in lib/site.ts), plus
   image and video extensions. Case PDFs are listed as documents of their own.

   ═══ app/sitemap.ts — the list of pages for search engines ═══
   Generated at build time into out/sitemap.xml. Case pages, their
   screenshots, videos and PDFs are added automatically from the data files.
   HOW TO EDIT: only when you add a NEW PAGE (a new folder with page.tsx under
   app/) — add an entry to the array returned below. */

import type { MetadataRoute } from "next";
import { caseEvidenceLibrary, caseScreenshotsByEvidenceId } from "@/data/cases";
import { absoluteUrl, caseUrl, OG_IMAGE } from "@/lib/site";
import { GALLERY_PHOTOS, photoImagePath } from "@/data/gallery-photos";
import { journeyItems } from "@/data/journey";
import { journeyPath } from "@/data/journey-index";
import { CERTIFICATES, certificateImagePath, certificatePagePath } from "@/data/certificates";
import { SITE_VIDEOS, uploadDate, videoUrl, type SiteVideo } from "@/lib/videos";
import { PERSON_IMAGE, SITE_URL, youtubePlayer, youtubeThumb } from "@/lib/seo";
import { CERTIFICATES_LANGUAGES, GALLERY_LANGUAGES, TEACHING_LANGUAGES, TRAINING_LANGUAGES } from "@/lib/page-ids";
import { ATTACK_TECHNIQUES, PLATFORM_PAGES, casesForPlatform } from "@/lib/collections";
import { TOOL_PAGES } from "@/data/tools";

/* A URL as a sitemap needs it: asset paths have spaces ("Assets/Cases/Depi
   R4 Project/…", "Screenshot (328).webp") and Next writes <loc> as given —
   a raw space is an invalid URL, and Search Console rejects the entry.
   decodeURI first, so an already-encoded path is not encoded twice. */
const loc = (url: string) => encodeURI(decodeURI(url));

/* The home page: the portrait and the share image. The gallery page: every
   personal photo. The certificates page: every scan (each scan is listed
   again on its own page, /certificates/<slug>). */
const galleryImages = GALLERY_PHOTOS.map((p) => loc(absoluteUrl(photoImagePath(p.slug))));
const certificateImages = CERTIFICATES.map((c) => loc(absoluteUrl(certificateImagePath(c.slug))));
const homeImages = [PERSON_IMAGE, OG_IMAGE.url].map(loc);

/* Google allows 2,048 characters of description; keep well under */
const clip = (text: string, max = 1000) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/* Next writes video fields unescaped: one "&" would break the XML */
const xml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/* Each video, listed on its own page (/videos/<slug>, lib/videos.ts) —
   Google indexes a video only where it is the page's main content */
const videoEntry = (video: SiteVideo) => ({
  title: xml(video.title),
  thumbnail_loc: youtubeThumb(video.videoId),
  description: xml(clip(video.description ?? video.title)),
  player_loc: youtubePlayer(video.videoId),
  /* Same full date-time with time zone as the page's uploadDate */
  ...(uploadDate(video.publishedAt) ? { publication_date: uploadDate(video.publishedAt) } : {}),
  family_friendly: "yes" as const,
  requires_subscription: "no" as const,
  uploader: { info: SITE_URL, content: "Ahmed Emad Nasr" },
  ...(video.tags?.[0] ? { tag: xml(video.tags[0]) } : {}),
});

const teachingLanguages = Object.fromEntries(
  Object.entries(TEACHING_LANGUAGES).map(([lang, path]) => [lang, absoluteUrl(path)]),
);

const absoluteLanguages = (languages: Record<string, string>) =>
  Object.fromEntries(Object.entries(languages).map(([lang, path]) => [lang, absoluteUrl(path)]));
const trainingLanguages = absoluteLanguages(TRAINING_LANGUAGES);
const galleryLanguages = absoluteLanguages(GALLERY_LANGUAGES);
const certificatesLanguages = absoluteLanguages(CERTIFICATES_LANGUAGES);

/* Required by the static export (see the same line in app/manifest.ts) */
export const dynamic = "force-static";

/* A case's "YYYY-MM-DD" date → Date (today if missing or invalid) */
const parseDate = (value?: string): Date => {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export default function sitemap(): MetadataRoute.Sitemap {
  // The most recent date in the library = the site's real last update
  const latestCaseDate = caseEvidenceLibrary.reduce<Date>((latest, item) => {
    const date = parseDate(item.date);
    return date > latest ? date : latest;
  }, new Date(0));

  /* One entry per URL. priority (0–1) and changeFrequency are hints only. */
  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestCaseDate,
      changeFrequency: "weekly",
      priority: 1,
      images: homeImages,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestCaseDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    /* The teaching page in English and Arabic: each names the other (hreflang) */
    {
      url: absoluteUrl("/teaching"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: teachingLanguages },
    },
    {
      url: absoluteUrl("/ar/teaching"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: teachingLanguages },
    },
    {
      url: absoluteUrl("/gallery"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
      images: galleryImages,
      alternates: { languages: galleryLanguages },
    },
    /* The CV page and the videos page */
    {
      url: absoluteUrl("/cv"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/videos"),
      lastModified: SITE_VIDEOS[0]?.publishedAt ? parseDate(SITE_VIDEOS[0].publishedAt) : latestCaseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    /* The gallery in Arabic (its images are listed on /gallery) */
    {
      url: absoluteUrl("/ar/gallery"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: galleryLanguages },
    },
    /* Every certificate: the list in English and Arabic, then one page each */
    {
      url: absoluteUrl("/certificates"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
      images: certificateImages,
      alternates: { languages: certificatesLanguages },
    },
    {
      url: absoluteUrl("/ar/certificates"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: certificatesLanguages },
    },
    ...CERTIFICATES.map((c) => ({
      url: absoluteUrl(certificatePagePath(c.slug)),
      lastModified: c.date && /^\d{4}-\d{2}-\d{2}$/.test(c.date) ? parseDate(c.date) : latestCaseDate,
      changeFrequency: "yearly" as const,
      priority: c.group === "certifications" || c.group === "education" ? 0.6 : 0.4,
      images: [loc(absoluteUrl(certificateImagePath(c.slug)))],
    })),
    /* The journey, then one page per step, platform, recommendation and sport */
    {
      url: absoluteUrl("/journey"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...journeyItems().map((i) => ({
      url: absoluteUrl(journeyPath(i.slug)),
      lastModified: i.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(i.isoDate) ? parseDate(i.isoDate) : latestCaseDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
      ...(i.photos.length ? { images: i.photos.slice(0, 12).map((p) => loc(absoluteUrl(photoImagePath(p.slug)))) } : {}),
    })),
    /* Training for teams, in English and Arabic: each names the other (hreflang) */
    {
      url: absoluteUrl("/training"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: trainingLanguages },
    },
    {
      url: absoluteUrl("/ar/training"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: trainingLanguages },
    },
    /* ATT&CK: the hub and one page per technique (lib/collections.ts) */
    {
      url: absoluteUrl("/attack"),
      lastModified: latestCaseDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...ATTACK_TECHNIQUES.map((t) => ({
      url: absoluteUrl(`/attack/${t.id}`),
      lastModified: latestCaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    /* One page per training platform's write-ups */
    ...PLATFORM_PAGES.map((p) => ({
      url: absoluteUrl(`/writeups/${p.slug}`),
      lastModified: parseDate(casesForPlatform(p.platform)[0]?.date),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    /* One page per tool (data/tools.ts) */
    ...TOOL_PAGES.map((t) => ({
      url: absoluteUrl(`/projects/${t.id}`),
      lastModified: latestCaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(t.screenshots?.length ? { images: t.screenshots.map((s) => loc(absoluteUrl(s.src))) } : {}),
    })),
    {
      url: loc(absoluteUrl("/Assets/cv/AhmedEmadNasr_CV.pdf")),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseEvidenceLibrary.map((item) => ({
      url: loc(caseUrl(item.id)),
      lastModified: parseDate(item.date),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      images: [...new Set([...(item.image ? [item.image] : []), ...(caseScreenshotsByEvidenceId[item.id] ?? [])])]
        .slice(0, 50)
        .map((src) => loc(absoluteUrl(src))),
    })),
    /* One page per video */
    ...SITE_VIDEOS.map((video) => ({
      url: loc(videoUrl(video)),
      lastModified: video.publishedAt ? parseDate(video.publishedAt) : latestCaseDate,
      changeFrequency: "yearly" as const,
      priority: 0.7,
      videos: [videoEntry(video)],
    })),
    /* The case PDFs that exist */
    ...caseEvidenceLibrary
      .filter((item): item is typeof item & { href: string } => Boolean(item.href))
      .map((item) => ({
        url: loc(absoluteUrl(item.href)),
        lastModified: parseDate(item.date),
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
  ];
}
