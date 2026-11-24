/*
 * ═══ lib/og.ts — a page's own share card, when it exists ═══
 *
 * npm run og:cases draws one 1200×630 card for each of /blog, /teaching and
 * /gallery into public/og/pages/<page>.jpg (scripts/og/generate-case-og.mjs).
 * pageShareImage("blog", …) returns that card, or the site-wide card
 * (public/og-image.jpg) when it has not been drawn yet — so a missing file
 * never publishes a dead image link.
 *
 * Server only (reads the disk at build time): import it from page.tsx files,
 * never from a component.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { OG_IMAGE, absoluteUrl } from "@/lib/site";

type SharePage = "blog" | "teaching" | "gallery" | "certificates" | "cv" | "videos" | "attack" | "writeups" | "tools" | "training" | "journey" | `tool-${string}`;

export type ShareImage = { url: string; width: number; height: number; type: string; alt: string };

/* Pages without a card of their own borrow the nearest one */
const BORROWED: Partial<Record<SharePage, SharePage>> = { certificates: "gallery", attack: "blog", writeups: "blog", tools: "cv", training: "teaching", journey: "gallery" };

export function pageShareImage(page: SharePage, alt: string): ShareImage {
  const own = `og/pages/${page}.jpg`;
  const fallback = page.startsWith("tool-") ? "tools" : (BORROWED[page] ?? page);
  const file = existsSync(join(process.cwd(), "public", own)) ? own : `og/pages/${fallback}.jpg`;
  if (!existsSync(join(process.cwd(), "public", file))) return OG_IMAGE;
  return { url: absoluteUrl(file), width: 1200, height: 630, type: "image/jpeg", alt };
}
