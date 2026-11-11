/* /sitemap.xml with absolute URLs (the site lives under /ahmed.dev), plus
   image and video extensions. Case PDFs are listed as documents of their own.

   ═══ app/sitemap.ts — the list of pages for search engines ═══
   Generated at build time into out/sitemap.xml. Case pages, their
   screenshots, videos and PDFs are added automatically from the data files.
   HOW TO EDIT: only when you add a NEW PAGE (a new folder with page.tsx under
   app/) — add an entry to the array returned below. */

import type { MetadataRoute } from "next";
import { caseEvidenceLibrary, caseScreenshotsByEvidenceId } from "@/data/cases";
import { absoluteUrl, caseUrl, OG_IMAGE } from "@/lib/site";
import { GALLERY_IMAGE_COUNT, galleryImagePath } from "@/data/certifications";
import { blogYoutubeVideos } from "@/data/youtube";
import { PERSON_IMAGE, SITE_URL, youtubeEmbed, youtubeThumb } from "@/lib/seo";

/* The home page (the whole portfolio): the portrait, the share image and
   every gallery image */
const galleryImages = Array.from({ length: GALLERY_IMAGE_COUNT }, (_, i) => absoluteUrl(galleryImagePath(i + 1)));
const homeImages = [PERSON_IMAGE, OG_IMAGE.url, ...galleryImages];

/* Google allows 2,048 characters of description; keep well under */
const clip = (text: string, max = 1000) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/* Next writes video fields unescaped: one "&" would break the XML */
const xml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/* The videos (in the blog part of the home page) */
const blogVideos = blogYoutubeVideos.map((video) => ({
  title: xml(video.title),
  thumbnail_loc: youtubeThumb(video.videoId),
  description: xml(clip(video.description ?? video.title)),
  player_loc: youtubeEmbed(video.videoId),
  publication_date: video.publishedAt,
  family_friendly: "yes" as const,
  requires_subscription: "no" as const,
  uploader: { info: SITE_URL, content: "Ahmed Emad Nasr" },
  ...(video.tags?.[0] ? { tag: xml(video.tags[0]) } : {}),
}));

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
      videos: blogVideos,
    },
    {
      url: absoluteUrl("/Assets/cv/AhmedEmadNasr_CV.pdf"),
      lastModified: latestCaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseEvidenceLibrary.map((item) => ({
      url: caseUrl(item.id),
      lastModified: parseDate(item.date),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      images: [...new Set([...(item.image ? [item.image] : []), ...(caseScreenshotsByEvidenceId[item.id] ?? [])])]
        .slice(0, 50)
        .map((src) => absoluteUrl(src)),
    })),
    /* The case PDFs that exist */
    ...caseEvidenceLibrary
      .filter((item): item is typeof item & { href: string } => Boolean(item.href))
      .map((item) => ({
        url: absoluteUrl(item.href),
        lastModified: parseDate(item.date),
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
  ];
}
