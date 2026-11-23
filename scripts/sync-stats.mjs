#!/usr/bin/env node
/*
 * scripts/sync-stats.mjs — refreshes the numbers the site shows by itself.
 *   npm run stats:sync
 *
 * Writes data/live-stats.ts (GitHub Actions runs it every morning, after
 * videos:sync, and commits the file back):
 *
 *   YouTube    subscribers, total views, uploads, and every playlist with
 *              its real id and size (a new playlist appears on the site, a
 *              playlist id saved wrong is corrected by matching its title).
 *                · with YOUTUBE_API_KEY (a free YouTube Data API v3 key,
 *                  saved as a repository secret): the official numbers
 *                · without it: read from the channel's public pages (the
 *                  numbers YouTube shows, e.g. "610 subscribers")
 *   TryHackMe  the public profile (rank, rooms, badges …) — the fallback
 *              the TryHackMe card uses when the live read fails at build time
 *
 * Every source is optional: what can't be read (offline, YouTube changed its
 * page, rate limit) keeps its last value, with a warning. A number that drops
 * by more than half in one day is treated as a misread and ignored. The
 * script never fails the build.
 *
 * LinkedIn has no public way to read a follower count, so that one stays in
 * AUDIENCE (lib/shared.ts), written by hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CHANNEL_ID = "UCb9u196eayC3vO9hDqr2ruA";
const TRYHACKME_USERNAME = "Ahmed.Emad.Nasr";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATS_FILE = join(ROOT, "data", "live-stats.ts");
const FEED_FILE = join(ROOT, "data", "youtube-feed.ts");
const API_KEY = process.env.YOUTUBE_API_KEY?.trim();
const MAX_DESCRIPTION = 360;

/* ─── Small helpers ──────────────────────────────────────────────────────── */

const today = () => new Date().toISOString().slice(0, 10);
const isCount = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
const warn = (msg) => console.warn(`::warning::stats:sync — ${msg}`);

/** "610" → 610, "1,234" → 1234, "1.2K" → 1200, "3.4M" → 3400000, "No" → 0 */
export const parseCount = (raw) => {
  const s = String(raw).trim().replace(/,/g, "");
  if (/^no$/i.test(s)) return 0;
  const m = s.match(/^(\d+(?:\.\d+)?)\s*([KMB])?$/i);
  if (!m) return undefined;
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[m[2]?.toUpperCase()] ?? 1;
  return Math.round(Number(m[1]) * mult);
};

/** A new number replaces the saved one unless it looks like a misread */
const accept = (name, next, prev) => {
  if (!isCount(next)) return prev;
  if (isCount(prev) && prev > 20 && next < prev / 2) {
    warn(`${name} read as ${next} (was ${prev}) — kept ${prev}`);
    return prev;
  }
  return next;
};

async function get(url, { json = false } = {}) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      /* Skips YouTube's cookie-consent page (served instead of the channel in some regions) */
      Cookie: "CONSENT=YES+cb; SOCS=CAI",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
    },
  });
  if (!response.ok) throw new Error(`${response.status} from ${new URL(url).host}`);
  return json ? response.json() : response.text();
}

/* ─── The saved file ─────────────────────────────────────────────────────── */

const MARK = "export const LIVE_STATS: LiveStats = ";

function readSaved() {
  const src = readFileSync(STATS_FILE, "utf8");
  const at = src.indexOf(MARK);
  if (at < 0) throw new Error("data/live-stats.ts: LIVE_STATS not found");
  const body = src.slice(at + MARK.length);
  return { head: src.slice(0, at), stats: JSON.parse(body.slice(0, body.lastIndexOf(";"))) };
}

/* The upload counter data/youtube-feed.ts keeps (scripts/sync-youtube.mjs):
   used when YouTube's own number can't be read */
function feedCounter() {
  try {
    const m = readFileSync(FEED_FILE, "utf8").match(/export const YOUTUBE_CHANNEL_VIDEOS = (\d+);/);
    return m ? Number(m[1]) : undefined;
  } catch {
    return undefined;
  }
}

/* ─── YouTube: the official API ──────────────────────────────────────────── */

async function youtubeFromApi() {
  const base = "https://www.googleapis.com/youtube/v3";
  const channel = await get(`${base}/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`, { json: true });
  const s = channel.items?.[0]?.statistics;
  if (!s) throw new Error("the API returned no channel");

  const playlists = [];
  let page = "";
  do {
    const r = await get(
      `${base}/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=50&key=${API_KEY}${page ? `&pageToken=${page}` : ""}`,
      { json: true },
    );
    for (const p of r.items ?? []) {
      playlists.push({
        id: p.id,
        title: p.snippet?.title?.trim() ?? "",
        description: (p.snippet?.description ?? "").trim().slice(0, MAX_DESCRIPTION),
        count: Number(p.contentDetails?.itemCount ?? 0),
      });
    }
    page = r.nextPageToken ?? "";
  } while (page);

  return {
    subscribers: s.hiddenSubscriberCount ? undefined : Number(s.subscriberCount),
    views: Number(s.viewCount),
    videos: Number(s.videoCount),
    playlists,
  };
}

/* ─── YouTube: the public pages (no key) ─────────────────────────────────── */

/* The page's data object (ytInitialData), as text: the numbers are searched
   inside it rather than in the whole HTML */
const pageData = (html) => {
  const at = html.indexOf("ytInitialData");
  return at < 0 ? html : html.slice(at);
};

/** "610 subscribers" / "86 videos" / "61,234 views" → the number before the word */
export const countBefore = (text, word) => {
  /* The first "<key>": "<number> <word>" — the header's numbers come before
     any video title in the page data */
  const m = text.match(new RegExp(`"[A-Za-z]+"\\s*:\\s*"([\\d.,]+[KMB]?|No)\\s+${word}s?\\b`, "i"));
  return m ? parseCount(m[1]) : undefined;
};

/** Every playlist on the channel's Playlists tab: { id, title, count } */
export const playlistsFromPage = (text) => {
  const found = new Map();
  /* New layout: one "lockupViewModel" per playlist */
  for (const chunk of text.split('"lockupViewModel"').slice(1)) {
    const id = chunk.match(/"contentId"\s*:\s*"((?:PL|OL)[\w-]{10,})"/)?.[1];
    const title = chunk.match(/"title"\s*:\s*\{\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
    const count = chunk.match(/"text"\s*:\s*"(\d[\d,]*) (?:videos?|lessons?)"/)?.[1];
    if (id && title && count && !found.has(id)) found.set(id, { id, title: JSON.parse(`"${title}"`), description: "", count: parseCount(count) });
  }
  /* Older layout: "gridPlaylistRenderer" */
  for (const chunk of text.split('"gridPlaylistRenderer"').slice(1)) {
    const id = chunk.match(/"playlistId"\s*:\s*"((?:PL|OL)[\w-]{10,})"/)?.[1];
    const title = chunk.match(/"title"\s*:\s*\{\s*"runs"\s*:\s*\[\s*\{\s*"text"\s*:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
    const count = chunk.match(/"videoCountShortText"\s*:\s*\{\s*"simpleText"\s*:\s*"([\d,]+)"/)?.[1];
    if (id && title && count && !found.has(id)) found.set(id, { id, title: JSON.parse(`"${title}"`), description: "", count: parseCount(count) });
  }
  return [...found.values()];
};

async function youtubeFromPages() {
  const channel = `https://www.youtube.com/channel/${CHANNEL_ID}`;
  const q = "?hl=en&gl=US&persist_hl=1";
  const out = {};

  try {
    const home = pageData(await get(`${channel}${q}`));
    out.subscribers = countBefore(home, "subscriber");
    out.videos = countBefore(home, "video");
  } catch (e) {
    warn(`channel page: ${e.message}`);
  }
  try {
    const about = pageData(await get(`${channel}/about${q}`));
    out.views = countBefore(about, "view");
    out.subscribers ??= countBefore(about, "subscriber");
    out.videos ??= countBefore(about, "video");
  } catch (e) {
    warn(`about page: ${e.message}`);
  }
  try {
    out.playlists = playlistsFromPage(pageData(await get(`${channel}/playlists${q}`)));
  } catch (e) {
    warn(`playlists page: ${e.message}`);
  }
  return out;
}

/* ─── TryHackMe ──────────────────────────────────────────────────────────── */

async function tryHackMe() {
  const data = await get(`https://tryhackme.com/api/v2/public-profile?username=${encodeURIComponent(TRYHACKME_USERNAME)}`, { json: true });
  const fields = ["rank", "topPercentage", "level", "completedRoomsNumber", "badgesNumber", "totalPoints"];
  if (!data || data.isPrivateProfile || !fields.every((f) => isCount(data[f]))) throw new Error("unexpected answer");
  return { ...Object.fromEntries(fields.map((f) => [f, data[f]])), asOf: today() };
}

/* ─── Run ────────────────────────────────────────────────────────────────── */

async function main() {
  const { head, stats: saved } = readSaved();
  const next = structuredClone(saved);
  const read = [];

  /* YouTube */
  let yt = {};
  if (API_KEY) {
    try {
      yt = await youtubeFromApi();
      read.push("YouTube (API)");
    } catch (e) {
      warn(`YouTube API: ${e.message} — trying the public pages`);
    }
  }
  if (!yt.views && !yt.subscribers) {
    yt = await youtubeFromPages();
    if (isCount(yt.subscribers) || isCount(yt.views) || yt.playlists?.length) read.push("YouTube (pages)");
  }
  next.youtube.subscribers = accept("subscribers", yt.subscribers, saved.youtube.subscribers);
  next.youtube.views = accept("views", yt.views, saved.youtube.views);
  /* Uploads: YouTube's number when read, else the daily counter of new uploads */
  const counter = feedCounter();
  next.youtube.videos = isCount(yt.videos) && yt.videos > 0
    ? accept("videos", yt.videos, saved.youtube.videos)
    : Math.max(saved.youtube.videos, counter ?? 0);
  if (yt.playlists?.length) {
    /* An empty playlist is skipped; the API's descriptions win over the saved ones */
    const old = new Map(saved.playlists.map((p) => [p.id, p]));
    next.playlists = yt.playlists
      .filter((p) => p.count > 0)
      .map((p) => ({ ...p, description: p.description || old.get(p.id)?.description || "" }));
  }

  /* TryHackMe */
  try {
    next.tryhackme = await tryHackMe();
    read.push("TryHackMe");
  } catch (e) {
    warn(`TryHackMe: ${e.message}`);
  }

  if (read.length) next.checked = today();
  const changed = JSON.stringify(next) !== JSON.stringify(saved);
  /* Windows line endings, like the rest of the repo's data files */
  if (changed) writeFileSync(STATS_FILE, `${head}${MARK}${JSON.stringify(next, null, 2).replace(/\n/g, "\r\n")};\r\n`);

  const y = next.youtube;
  console.log(
    `stats:sync — read: ${read.join(", ") || "nothing (kept the saved numbers)"} · ` +
      `YouTube ${y.subscribers} subscribers, ${y.views} views, ${y.videos} videos, ${next.playlists.length} playlists · ` +
      `TryHackMe rank ${next.tryhackme.rank}${changed ? "" : " · no change"}`,
  );
}

/* Run only when called directly (the parsers above are imported by tests) */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => warn(e.message));
}
