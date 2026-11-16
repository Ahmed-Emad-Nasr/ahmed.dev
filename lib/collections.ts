/*
 * ═══ lib/collections.ts — the case library seen from two other angles ═══
 *
 *   /attack/<T-id>          every case that shows one MITRE ATT&CK technique
 *   /writeups/<platform>    every write-up from one training platform
 *
 * Nothing here is typed by hand except the platform intros below: the lists
 * come from data/cases.ts and data/attack.ts, so a new case appears on its
 * technique and platform pages on the next build.
 *
 * TO ADD A PLATFORM PAGE: add an entry to PLATFORM_PAGES. `platform` must be
 * the exact `platform` text the cases use in data/cases.ts.
 */

import { caseEvidenceLibrary } from "@/data/cases";
import { ATTACK_TACTICS, buildCoverage, caseAttackMapping, parentTechnique, techniquesForCase } from "@/data/attack";
import { STATIC_PLATFORMS, TRYHACKME_USERNAME } from "@/data/platforms";
import type { CaseEvidence } from "@/lib/shared";

/* Newest first — the order every list on these pages uses */
const byDate = (a: CaseEvidence, b: CaseEvidence) => b.date.localeCompare(a.date);

/* ─────────────────────────── Platforms ─────────────────────────── */

type PlatformPage = {
  /** The URL part: /writeups/<slug> */
  slug: string;
  /** The `platform` value of the cases, exactly as in data/cases.ts */
  platform: string;
  /** The platform's full name, as people search for it */
  name: string;
  japanese: string;
  /** Two or three sentences: what the platform is and what these write-ups cover */
  intro: string;
  profileUrl?: string;
};

export const PLATFORM_PAGES: readonly PlatformPage[] = [
  {
    slug: "tryhackme",
    platform: "TryHackMe",
    name: "TryHackMe",
    japanese: "修練",
    intro:
      "TryHackMe is a hands-on training platform where every lesson is a room with a real machine to attack or defend. These are my write-ups of its rooms — mostly blue team: SOC Level 1 and 2 alert triage and reporting, digital forensics and threat intelligence, plus a few offensive CTFs — each one solved step by step, with the screenshots.",
    profileUrl: `https://tryhackme.com/p/${TRYHACKME_USERNAME}`,
  },
  {
    slug: "portswigger",
    platform: "PortSwigger",
    name: "PortSwigger Web Security Academy",
    japanese: "攻略",
    intro:
      "PortSwigger's Web Security Academy is the free web-hacking course from the makers of Burp Suite. These are my write-ups of its labs — access control and IDOR, OS command injection, file upload, SSRF, SQL injection, XSS, XXE, JWT, OAuth and authentication flaws — each one with the request that broke it and how to fix it.",
  },
  {
    slug: "letsdefend",
    platform: "LetsDefend",
    name: "LetsDefend",
    japanese: "防御",
    intro:
      "LetsDefend is a SOC simulator: real alerts land in a queue and the analyst has to close each one as a true or false positive. These are my investigations of its alerts — phishing, malware, web attacks and exploited CVEs — written up the way a SOC ticket would be.",
  },
];

export const platformPageBySlug = (slug: string) => PLATFORM_PAGES.find((p) => p.slug === slug);

export const casesForPlatform = (platform: string): CaseEvidence[] =>
  caseEvidenceLibrary.filter((c) => c.platform === platform).sort(byDate);

/** The profile link of a platform page: its own, else the one on the home page */
export const platformProfile = (page: PlatformPage): string | undefined =>
  page.profileUrl ?? STATIC_PLATFORMS.find((p) => p.name === page.name)?.url;

/* ─────────────────────────── ATT&CK ─────────────────────────── */

type TechniqueEntry = {
  id: string;
  name: string;
  tactic: (typeof ATTACK_TACTICS)[number];
  caseIds: string[];
};

/** Every technique the library covers, in matrix order (tactic, then most cases) */
export const ATTACK_TECHNIQUES: readonly TechniqueEntry[] = buildCoverage().flatMap((column) =>
  column.techniques.map(({ technique, caseIds }) => ({
    id: technique.id,
    name: technique.name,
    tactic: column.tactic,
    caseIds,
  })),
);

export const techniqueById = (id: string) => ATTACK_TECHNIQUES.find((t) => t.id === id);

export const casesForTechnique = (technique: TechniqueEntry): CaseEvidence[] =>
  caseEvidenceLibrary.filter((c) => technique.caseIds.includes(c.id)).sort(byDate);

/** The sub-techniques of a parent that the cases show, with their names */
export const subTechniquesSeen = (parentId: string) => {
  const seen = new Map<string, string>();
  for (const caseId of Object.keys(caseAttackMapping)) {
    for (const t of techniquesForCase(caseId)) {
      if (t.id.startsWith(`${parentId}.`)) seen.set(t.id, t.name);
    }
  }
  return [...seen].map(([id, name]) => ({ id, name })).sort((a, b) => a.id.localeCompare(b.id));
};

/** Techniques that show up in the same cases, most shared first */
export const relatedTechniques = (technique: TechniqueEntry, limit = 6) => {
  const counts = new Map<string, number>();
  for (const caseId of technique.caseIds) {
    for (const id of new Set((caseAttackMapping[caseId] ?? []).map(parentTechnique))) {
      if (id !== technique.id) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .flatMap(([id, shared]) => {
      const entry = techniqueById(id);
      return entry ? [{ ...entry, shared }] : [];
    });
};

/** The tools used across a set of cases, most used first */
export const toolsAcross = (cases: readonly CaseEvidence[], limit = 12) => {
  const counts = new Map<string, number>();
  for (const c of cases) for (const tool of c.tools) counts.set(tool, (counts.get(tool) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([tool]) => tool);
};

/** How many cases of each category, most first: "Web Security · 12" */
export const categoriesAcross = (cases: readonly CaseEvidence[]) => {
  const counts = new Map<string, number>();
  for (const c of cases) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

/** Techniques covered by a set of cases, most used first */
export const techniquesAcross = (cases: readonly CaseEvidence[], limit = 10) => {
  const counts = new Map<string, number>();
  for (const c of cases) {
    for (const id of new Set((caseAttackMapping[c.id] ?? []).map(parentTechnique))) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .flatMap(([id, count]) => {
      const entry = techniqueById(id);
      return entry ? [{ ...entry, count }] : [];
    });
};
