/*
 * ═══ data/journey-index.ts — the pages of /journey, names only ═══
 *
 * Every item of /journey (app/journey/page.tsx) has its own page,
 * /journey/<slug>. This small file is the list of those pages — slug, kind
 * and title — built from the same data as the page, so a new step in
 * PATH, a new sport or a new recommendation gets its page and its search
 * entry by itself. The full details of each page are in data/journey.ts
 * (that file is large: it reads the experience, certificates, photos and
 * case library; the search box only needs the names, hence this file).
 *
 * The four kinds, in the order of the page:
 *   path            "The Path."          one page per step   data/about.ts (PATH)
 *   platform        "Proving Grounds."   one per platform    PLATFORM_IDS below / data/platforms.ts
 *   recommendation  "In Their Words."    one per writer      data/testimonials.ts (RECOMMENDATIONS)
 *   sport           "Off the Clock."     one per sport       data/about.ts (ATHLETICS)
 */

import { ATHLETICS, PATH } from "@/data/about";
import { RECOMMENDATIONS } from "@/data/testimonials";

export type JourneyKind = "path" | "platform" | "recommendation" | "sport";

/** What each kind is called on the page, its section's #anchor and kanji */
export const JOURNEY_KINDS: Record<JourneyKind, { label: string; anchor: string; japanese: string; noun: string }> = {
  path: { label: "The Path", anchor: "path", japanese: "道程", noun: "Milestone" },
  platform: { label: "Proving Grounds", anchor: "platforms", japanese: "修練", noun: "Training platform" },
  recommendation: { label: "In Their Words", anchor: "testimonials", japanese: "推薦", noun: "Recommendation" },
  sport: { label: "Off the Clock", anchor: "athlete", japanese: "競技", noun: "Sport" },
};

/** "Huawei & IEEE" → "huawei-ieee" */
const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

/* The page of each step / sport / writer — its address never needs typing */
export const pathSlug = (m: (typeof PATH)[number]) => slugify(`${m.year} ${m.title}`);
export const sportSlug = (a: (typeof ATHLETICS)[number]) => slugify(`${a.club} ${a.sport.split("—")[0]}`);
export const recommendationSlug = (author: string) => slugify(author);

/* The platforms, by their id in data/platforms.ts (that file reads the whole
   case library, too much for the search box). data/journey.ts checks at
   every build that this list and data/platforms.ts agree. */
export const PLATFORM_IDS = [
  { id: "tryhackme", name: "TryHackMe" },
  { id: "hackthebox", name: "Hack The Box" },
  { id: "cyberdefenders", name: "CyberDefenders" },
  { id: "cybertalents", name: "CyberTalents" },
] as const;

type JourneyEntry = { slug: string; kind: JourneyKind; title: string };

export const JOURNEY_INDEX: readonly JourneyEntry[] = [
  ...PATH.map((m) => ({ slug: pathSlug(m), kind: "path" as const, title: `${m.year} — ${m.title}` })),
  ...PLATFORM_IDS.map((p) => ({ slug: p.id, kind: "platform" as const, title: p.name })),
  ...RECOMMENDATIONS.map((t) => ({ slug: recommendationSlug(t.author), kind: "recommendation" as const, title: `${t.author} — recommendation` })),
  ...ATHLETICS.map((a) => ({ slug: sportSlug(a), kind: "sport" as const, title: `${a.club} — ${a.sport}` })),
];

export const journeyPath = (slug: string): string => `/journey/${slug}`;
