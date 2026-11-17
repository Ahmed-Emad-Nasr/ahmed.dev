/*
 * ═══ lib/videos.ts — one page per video ( URL: /videos/<slug> ) ═══
 *
 * Google indexes a video only on a page where the video is the main thing —
 * on /blog, 25 videos side by side were "not the main content", so none was
 * indexed (Search Console → Video pages). Each video now has a page of its
 * own (app/videos/[slug]/page.tsx); /blog links to them.
 *
 * Nothing to edit: the list follows data/youtube.ts (the featured video and
 * blogYoutubeVideos, which includes the uploads added from the channel feed).
 * The slug comes from the title, so a new video gets its page automatically.
 * Two hand-written titles that make the same slug stop the build; a video
 * from the feed whose title clashes (or has no English words) gets its
 * YouTube id added to the slug instead.
 */

import { blogFeaturedYoutubeVideo, blogYoutubeVideos } from "@/data/youtube";
import type { BlogYoutubeVideo } from "@/lib/shared";
import { absoluteUrl } from "@/lib/site";

export type SiteVideo = BlogYoutubeVideo & { slug: string };

/* "Hashing and Salting Explained" → "hashing-and-salting-explained": at most
   60 characters, cut at a word. A long title keeps its part before " — " or
   " | " (the subtitle goes), and never ends on a small word ("…-with-how"). */
const SMALL = new Set(["a", "an", "and", "the", "of", "to", "in", "on", "for", "with", "how", "by", "vs", "plus", "step", "using", "from"]);
const words = (text: string) =>
  text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
const slugify = (title: string): string => {
  const full = words(title);
  const head = words(title.split(/\s[—|(]\s?|:\s/)[0] ?? title);
  const source = full.join("-").length > 60 && head.length >= 3 ? head : full;
  const out: string[] = [];
  for (const w of source) {
    if ([...out, w].join("-").length > 60) break;
    out.push(w);
  }
  while (out.length > 1 && SMALL.has(out[out.length - 1]!)) out.pop();
  return out.join("-") || "video";
};

/* Every video once, newest first. The featured video takes its details from
   blogYoutubeVideos when it is listed there too. */
const all: BlogYoutubeVideo[] = [...blogYoutubeVideos];
if (!all.some((v) => v.videoId === blogFeaturedYoutubeVideo.videoId)) {
  all.push({
    videoId: blogFeaturedYoutubeVideo.videoId,
    title: blogFeaturedYoutubeVideo.title,
    description: blogFeaturedYoutubeVideo.description,
    publishedAt: blogFeaturedYoutubeVideo.publishedAt,
  });
}

/* Hand-written videos claim their slugs first; a feed video never breaks the
   build over a clash — it takes "<slug>-<id>" */
const taken = new Set(all.filter((v) => !v.auto).map((v) => slugify(v.title)));
const slugOf = (v: BlogYoutubeVideo): string => {
  const base = slugify(v.title);
  if (!v.auto) return base;
  const slug = base === "video" || taken.has(base) ? `${base}-${v.videoId.toLowerCase()}` : base;
  taken.add(slug);
  return slug;
};

export const SITE_VIDEOS: readonly SiteVideo[] = all
  .map((v) => ({ ...v, slug: slugOf(v) }))
  .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

{
  const seen = new Map<string, string>();
  for (const v of SITE_VIDEOS) {
    const other = seen.get(v.slug);
    if (other) throw new Error(`[lib/videos.ts] "${v.title}" and "${other}" make the same page address /videos/${v.slug} — change one title`);
    /* Google's video results need uploadDate (a full date) on every video page */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.publishedAt)) throw new Error(`[lib/videos.ts] "${v.title}" needs publishedAt as "YYYY-MM-DD" in data/youtube.ts (found "${v.publishedAt}")`);
    seen.set(v.slug, v.title);
  }
}

export const videoBySlug = (slug: string) => SITE_VIDEOS.find((v) => v.slug === slug);
export const videoById = (videoId: string) => SITE_VIDEOS.find((v) => v.videoId === videoId);

/** The video's own page: path (for links) and absolute URL (for metadata) */
export const videoPath = (v: { slug: string }) => `/videos/${v.slug}`;
export const videoUrl = (v: { slug: string }) => absoluteUrl(videoPath(v));

/** Up to `n` other videos, the ones sharing the most tags first */
export function relatedVideos(video: SiteVideo, n = 3): SiteVideo[] {
  const tags = new Set((video.tags ?? []).map((t) => t.toLowerCase()));
  return SITE_VIDEOS.filter((v) => v.videoId !== video.videoId)
    .map((v) => ({ v, score: (v.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length }))
    .sort((a, b) => b.score - a.score || (b.v.publishedAt || "").localeCompare(a.v.publishedAt || ""))
    .slice(0, n)
    .map(({ v }) => v);
}

/** ISO 8601 with the time zone, as Google wants uploadDate ("2026-10-21" → Cairo midnight) */
export const uploadDate = (date: string): string | undefined => (date ? `${date}T00:00:00+02:00` : undefined);
