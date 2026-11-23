#!/usr/bin/env node
/*
 * scripts/sync-youtube.mjs — adds new uploads from the YouTube channel to the
 * site by itself.  npm run videos:sync
 *
 * Reads the channel's public feed (the latest 15 videos; no API key) and
 * writes every video that data/youtube.ts does not list yet into
 * data/youtube-feed.ts. data/youtube.ts merges that list in, so a new video
 * gets its card on /blog, its own page /videos/<slug>, a sitemap entry and
 * VideoObject data — with no code change.
 *
 * GitHub Actions runs this before every build (daily, .github/workflows/
 * nextjs.yml) and commits data/youtube-feed.ts back, so a video stays on
 * the site after it scrolls out of the feed's latest 15.
 *
 * Videos you list by hand in data/youtube.ts always win: add one there (same
 * videoId, with your own description, tags and notes) and it is dropped from
 * data/youtube-feed.ts on the next run. A videoId in HIDDEN_VIDEOS (same
 * file) is never added.
 *
 * It also keeps a counter of the channel's uploads (YOUTUBE_CHANNEL_VIDEOS,
 * same file): every upload the feed shows that was never counted before
 * adds 1 — hidden and hand-written ones included. YOUTUBE_COUNTED_IDS is the
 * list of the uploads already counted. scripts/sync-stats.mjs (run next)
 * uses this counter only when it can't read YouTube's own number.
 *
 * Offline / YouTube down → a warning, the file is left as it is, the build
 * goes on with the videos it already has.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CHANNEL_ID = "UCb9u196eayC3vO9hDqr2ruA";
/* YOUTUBE_FEED_URL: only to test against a saved copy of the feed */
const FEED_URL = process.env.YOUTUBE_FEED_URL ?? `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANUAL_FILE = join(ROOT, "data", "youtube.ts");
const FEED_FILE = join(ROOT, "data", "youtube-feed.ts");
const MAX_DESCRIPTION = 360;
const MAX_TAGS = 6;

const ARABIC = /[؀-ۿ]/;
const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]).trim() : "";
};

/* "GRC Teams Explained | … | شرح بالعربي #shorts" → the English parts only
   (the site is in English); a title with no English part is kept whole */
export function cleanTitle(raw) {
  const noTags = raw.replace(/#[\p{L}\p{N}_]+/gu, "").trim();
  const parts = noTags.split("|").map((p) => p.trim()).filter(Boolean);
  const latin = parts.filter((p) => !ARABIC.test(p));
  return (latin.length ? latin.join(" | ") : noTags).replace(/\s{2,}/g, " ");
}

/* The description without links and hashtags, cut at a word near
   MAX_DESCRIPTION; the Latin hashtags become the video's tags */
export function cleanDescription(raw, title) {
  const tags = [...new Set([...raw.matchAll(/#([A-Za-z][A-Za-z0-9_]{1,40})/g)].map((m) => m[1]))]
    .filter((t) => t.toLowerCase() !== "shorts")
    .slice(0, MAX_TAGS);
  let text = raw
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/[\s|•·:\-–—]+$/u, "").trim())
    .filter((l) => /[\p{L}\p{N}]/u.test(l))
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (text.length > MAX_DESCRIPTION) {
    const cut = text.slice(0, MAX_DESCRIPTION);
    text = `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 200)).replace(/[\s,;:.–—-]+$/u, "")}…`;
  }
  return { description: text || `${title} — a video from the 0x3omda YouTube channel.`, tags };
}

/* The upload day in Cairo, as data/youtube.ts writes it ("YYYY-MM-DD") */
export const cairoDay = (iso) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" });

export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => {
      const videoId = tag(entry, "yt:videoId");
      const published = tag(entry, "published");
      const title = cleanTitle(tag(entry, "title") || tag(entry, "media:title"));
      if (!/^[\w-]{11}$/.test(videoId) || !published || !title) return null;
      const { description, tags } = cleanDescription(tag(entry, "media:description"), title);
      return {
        videoId,
        title,
        description,
        publishedAt: cairoDay(published),
        tags: tags.length ? tags : ["Cybersecurity"],
        auto: true,
      };
    })
    .filter(Boolean);
}

/* One exported value of the generated file, as JSON: from "= " to the first
   line that ends in ";" (pretty-printed JSON never ends a line with one) */
const readExport = (src, name) => {
  const at = src.indexOf(`export const ${name}`);
  if (at < 0) return undefined;
  const start = src.indexOf("= ", at) + 2;
  const end = src.slice(start).search(/;\r?\n|;$/);
  return JSON.parse(src.slice(start, start + end));
};

const readSaved = () => {
  try {
    const src = readFileSync(FEED_FILE, "utf8");
    return {
      videos: readExport(src, "YOUTUBE_FEED") ?? [],
      channelVideos: readExport(src, "YOUTUBE_CHANNEL_VIDEOS"),
      counted: readExport(src, "YOUTUBE_COUNTED_IDS"),
    };
  } catch {
    return { videos: [] };
  }
};

const json = (value) => JSON.stringify(value, null, 2).replace(/\n/g, "\r\n");

function write(videos, channelVideos, counted) {
  const body = json(videos);
  writeFileSync(
    FEED_FILE,
    [
      "/*",
      " * GENERATED by scripts/sync-youtube.mjs from the YouTube channel feed —",
      " * do not edit by hand. To give one of these videos your own text, tags",
      " * or notes, add it to data/youtube.ts (same videoId): it then leaves",
      " * this list on the next sync.",
      " */",
      'import type { BlogYoutubeVideo } from "@/lib/shared";',
      "",
      `export const YOUTUBE_FEED: BlogYoutubeVideo[] = ${body};`,
      "",
      "/* Counter of the channel's uploads: +1 for every upload the feed shows that",
      "   is not in YOUTUBE_COUNTED_IDS yet. scripts/sync-stats.mjs uses it only when",
      "   it can't read YouTube's own number (data/live-stats.ts). */",
      `export const YOUTUBE_CHANNEL_VIDEOS = ${channelVideos};`,
      "",
      "/* The uploads already counted in YOUTUBE_CHANNEL_VIDEOS */",
      `export const YOUTUBE_COUNTED_IDS: string[] = ${json(counted)};`,
      "",
    ].join("\r\n"),
  );
}

async function main() {
  const src = readFileSync(MANUAL_FILE, "utf8");
  /* Written up by hand, plus HIDDEN_VIDEOS (never shown) */
  const hidden = src.match(/HIDDEN_VIDEOS[^=]*=\s*\[([^\]]*)\]/)?.[1] ?? "";
  const manual = new Set([
    ...[...src.matchAll(/\bvideoId:\s*"([\w-]{11})"/g)].map((m) => m[1]),
    ...[...hidden.matchAll(/"([\w-]{11})"/g)].map((m) => m[1]),
  ]);
  let fresh;
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fresh = parseFeed(await res.text());
  } catch (error) {
    console.warn(`videos:sync — YouTube feed unavailable (${error.message}); keeping data/youtube-feed.ts as it is`);
    return;
  }

  /* Saved videos stay (the feed only holds the latest 15); the feed's copy
     of a video updates a saved one; hand-listed videos leave the list */
  const saved = readSaved();
  const byId = new Map(saved.videos.map((v) => [v.videoId, v]));
  for (const v of fresh) byId.set(v.videoId, v);
  const videos = [...byId.values()]
    .filter((v) => !manual.has(v.videoId))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.videoId.localeCompare(b.videoId));

  /* The channel count: every upload the feed shows that was never counted
     adds 1. First run (no count saved yet): every video the site knows is
     counted, and the count starts at that number. */
  const counted = new Set(saved.counted ?? [...manual, ...saved.videos.map((v) => v.videoId)]);
  let channelVideos = saved.channelVideos ?? counted.size;
  const uploaded = fresh.filter((v) => !counted.has(v.videoId));
  for (const v of uploaded) counted.add(v.videoId);
  channelVideos += uploaded.length;

  const before = JSON.stringify(saved.videos);
  write(videos, channelVideos, [...counted].sort());
  const added = videos.filter((v) => !before.includes(`"${v.videoId}"`));
  console.log(
    `videos:sync — ${fresh.length} in the feed, ${videos.length} added automatically` +
      (added.length ? ` (new: ${added.map((v) => v.title).join("; ")})` : " (nothing new)") +
      `; channel: ${channelVideos} videos` + (uploaded.length ? ` (+${uploaded.length})` : ""),
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
