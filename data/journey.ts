/*
 * ═══ data/journey.ts — everything on each /journey/<slug> page ═══
 *
 * /journey (app/journey/page.tsx) is the path, the training platforms, the
 * recommendations and the sport. Each item there has its own page,
 * /journey/<slug> (app/journey/[slug]/page.tsx), with every detail the site
 * holds about it. NOTHING HERE IS WRITTEN TWICE: the text comes from the
 * files the site already uses —
 *
 *   the step, the sport       data/about.ts (PATH, ATHLETICS)
 *   the platform              data/platforms.ts (+ the TryHackMe numbers)
 *   the recommendation        data/testimonials.ts (quoted word for word)
 *   the roles behind it       data/experience.ts (dates, every bullet, skills)
 *   the certificates          data/certificates.ts (each links to its page)
 *   the photos                data/gallery-photos.ts (with their captions)
 *   the write-ups             data/cases.ts (via lib/collections.ts)
 *
 * The only thing written here is WHICH of those belong together: the LINKS
 * tables below (an organisation's name as in data/experience.ts, a
 * certificate's slug, a pattern for photo slugs). A slug that no longer
 * exists is skipped with a warning at build time, never a broken link.
 *
 * TO ADD: a new step in PATH / sport in ATHLETICS / recommendation gets its
 * page by itself; give it a LINKS entry here to connect its roles,
 * certificates and photos.
 */

import { ATHLETICS, PATH } from "@/data/about";
import { RECOMMENDATIONS, LINKEDIN_RECOMMENDATIONS_URL, type Testimonial } from "@/data/testimonials";
import { STATIC_PLATFORMS, THM_SNAPSHOT, tryHackMePlatform, type Platform, type TryHackMeStats } from "@/data/platforms";
import { knowledgeEducationItems, type ExperienceItem } from "@/data/experience";
import { certificateBySlug, type Certificate } from "@/data/certificates";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/data/gallery-photos";
import { PLATFORM_PAGES, casesForPlatform } from "@/lib/collections";
import type { CaseEvidence } from "@/lib/shared";
import {
  JOURNEY_KINDS,
  PLATFORM_IDS,
  pathSlug,
  recommendationSlug,
  sportSlug,
  type JourneyKind,
} from "@/data/journey-index";

export type JourneyFact = { label: string; value: string; href?: string };
export type JourneyLink = { label: string; href: string; external?: boolean };

export type JourneyItem = {
  slug: string;
  kind: JourneyKind;
  /** The page's title (h1) */
  title: string;
  /** The line under it: the organisation, club or writer's role */
  subtitle: string;
  /** When, as shown ("2023", "2020 – now", "Mar 2026") */
  when: string;
  /** For search engines: a year or an ISO date */
  isoDate?: string;
  /** One or two sentences: the page's description and its share text */
  summary: string;
  /** The longer text, paragraph by paragraph */
  story: string[];
  /** The details card: one row per fact */
  facts: JourneyFact[];
  /** Chips with a heading (events, skills, disciplines) */
  chips?: { title: string; items: readonly string[] };
  /** The full recommendation, for a recommendation page */
  quote?: Testimonial;
  /** The headline numbers (a platform's stats) */
  stats?: { value: string; label: string }[];
  roles: ExperienceItem[];
  certificates: Certificate[];
  photos: GalleryPhoto[];
  /** The heading over the photos (what they are — not all are of the item itself) */
  photosTitle?: string;
  writeups?: { platform: string; count: number; latest: CaseEvidence[]; href?: string };
  links: JourneyLink[];
};

/* ─────────────────────────── What belongs together ─────────────────────────── */

type Links = {
  /** Organisations exactly as `subTag` in data/experience.ts */
  orgs?: string[];
  /** Certificate slugs (data/certificates.ts) */
  certs?: string[];
  /** Photo slugs (data/gallery-photos.ts) that match */
  photos?: RegExp;
};

const PATH_LINKS: Record<string, Links> = {
  "2022-started-cs": {
    orgs: ["Benha University"],
    certs: ["bsc-computers-ai-benha-university-proof-of-graduation"],
    photos: /^faculty-of-computers-ai-benha-university$/,
  },
  "2023-huawei-ieee": {
    orgs: ["Huawei", "IEEE"],
    /* the Huawei role names these three courses; the attendance letter is the internship's */
    certs: [
      "huawei-hcia-datacom-learning-course-attendance",
      "huawei-hcia-datacom-v1-course",
      "huawei-hcia-cloud-computing-v5-course",
      "huawei-hccda-tech-essentials-course",
    ],
    photos: /^ghostech-event-software-academy-ieee-benha$/,
  },
  "2024-teaching-security": {
    orgs: ["Google Developer Groups (GDG)"],
    certs: ["gdg-on-campus-benha-bootcamp-cyber-security-technical"],
    photos: /^gdg-/,
  },
  "2025-offense-response": {
    orgs: ["Information Technology Institute (ITI)", "Digital Egypt Pioneers Initiative (DEPI)"],
    certs: [
      "ejpt-junior-penetration-tester-ine-security",
      "ejpt-junior-penetration-tester-badge",
      "iti-cyber-security-120-hours",
      "iti-universities-pentesting-bootcamp-2025",
      "depi-cyber-security-incident-response-analyst",
      "depi-information-security-analyst-infrastructure-security",
      "depi-forensics-investigator-infrastructure-security",
    ],
  },
  "2026-graduated-with-distinction": {
    orgs: ["Benha University"],
    certs: ["bsc-computers-ai-benha-university-proof-of-graduation"],
    photos: /^graduation-project-/,
  },
  "2026-banque-misr-instructor": {
    orgs: ["Banque Misr", "National Telecommunication Institute (NTI)", "AMIT Learning"],
    /* the internship's certificate; the educator certification and the RH124
       course he teaches (the AMIT role says so) */
    certs: [
      "banque-misr-rowad-information-security-summer-training",
      "ccep-certified-cybersecurity-educator-professional",
      "red-hat-system-administration-1-rh124",
    ],
    photos: /^(banque-misr-|nti-)/,
  },
};

const PLATFORM_LINKS: Record<string, Links> = {
  /* the DEPI role triaged its alerts on TryHackMe */
  tryhackme: {
    orgs: ["Digital Egypt Pioneers Initiative (DEPI)"],
    certs: ["tryhackme-soc-level-1-learning-path", "tryhackme-soc-level-2-learning-path", "tryhackme-jr-penetration-tester-learning-path"],
  },
  /* its labs were part of the ITI penetration-testing track */
  hackthebox: { orgs: ["Information Technology Institute (ITI)"] },
  cyberdefenders: {},
  cybertalents: {
    orgs: ["Information Technology Institute (ITI)"],
    certs: ["cybertalents-introduction-to-cybersecurity-bootcamp-cohort-10", "iti-universities-pentesting-bootcamp-2025"],
  },
};

const RECOMMENDATION_LINKS: Record<string, Links> = {
  /* he managed Ahmed in the GDG cybersecurity team */
  "abdelrahman-ahmed": {
    orgs: ["Google Developer Groups (GDG)"],
    certs: ["gdg-on-campus-benha-bootcamp-cyber-security-technical"],
    photos: /^gdg-/,
  },
  "ahmed-hamdto": {},
};

/* Running photos: the athletics ones that are not the pentathlon */
const isPentathlon = (p: GalleryPhoto) => /pentathlon/i.test(`${p.event} ${p.slug}`);
const SPORT_PHOTOS: Record<string, (p: GalleryPhoto) => boolean> = {
  ahly: (p) => p.category === "athletics" && !isPentathlon(p),
  pentathlon: (p) => p.category === "athletics" && isPentathlon(p),
};

/* ─────────────────────────── Reading the links ─────────────────────────── */

const warn = (what: string) => console.warn(`data/journey.ts — ${what} (skipped)`);

const rolesOf = (orgs: string[] = []): ExperienceItem[] =>
  knowledgeEducationItems
    .filter((e) => !e.hidden && orgs.includes(e.subTag))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

const certsOf = (slugs: string[] = []): Certificate[] =>
  slugs.flatMap((s) => {
    const c = certificateBySlug(s);
    if (!c) warn(`no certificate "${s}"`);
    return c ? [c] : [];
  });

const photosOf = (match?: RegExp | ((p: GalleryPhoto) => boolean)): GalleryPhoto[] =>
  !match ? [] : GALLERY_PHOTOS.filter((p) => (match instanceof RegExp ? match.test(p.slug) : match(p)));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-03-26" → "Mar 2026" */
const monthYear = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
/** "2023-07-01" → "Jul 2023" ; none → "Present" */
export const roleMonth = (iso?: string) => (iso ? monthYear(iso) : "Present");

const list = (xs: string[]) => (xs.length < 3 ? xs.join(" and ") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

/* ─────────────────────────── The pages ─────────────────────────── */

function pathItems(): JourneyItem[] {
  return PATH.map((m, idx) => {
    const slug = pathSlug(m);
    const links = PATH_LINKS[slug] ?? {};
    const roles = rolesOf(links.orgs);
    const certificates = certsOf(links.certs);
    const photos = photosOf(links.photos);
    /* in the order the step names them (Banque Misr, then the institutes) */
    const orgs = (links.orgs ?? []).filter((o) => roles.some((r) => r.subTag === o));
    return {
      slug,
      kind: "path",
      title: m.title,
      subtitle: orgs.length ? list(orgs) : `Step ${idx + 1} of ${PATH.length}`,
      when: m.year,
      isoDate: m.year,
      summary: m.detail,
      story: [m.detail],
      facts: [
        { label: "Year", value: m.year },
        { label: "Step", value: `${idx + 1} of ${PATH.length}${idx === PATH.length - 1 ? " — the latest" : ""}` },
        ...(orgs.length ? [{ label: orgs.length > 1 ? "Organisations" : "Organisation", value: orgs.join(" · ") }] : []),
        ...roles.map((r) => ({ label: "Role", value: `${r.tag} — ${roleMonth(r.startDate)} to ${roleMonth(r.endDate)}` })),
        ...(certificates.length ? [{ label: "Certificates", value: String(certificates.length) }] : []),
        ...(photos.length ? [{ label: "Photos", value: String(photos.length) }] : []),
      ],
      chips: roles.length ? { title: "Skills used", items: [...new Set(roles.flatMap((r) => r.skills))] } : undefined,
      roles,
      certificates,
      photos,
      links: [
        ...roles.filter((r) => r.subTagHyperlink).map((r) => ({ label: r.subTag, href: r.subTagHyperlink, external: true })),
        { label: "The experience section", href: "/#experience" },
      ].filter((l, i, all) => all.findIndex((x) => x.href === l.href) === i),
    };
  });
}

function platformItem(p: Platform): JourneyItem {
  const links = PLATFORM_LINKS[p.id] ?? {};
  const page = PLATFORM_PAGES.find((x) => x.platform === p.name);
  const cases = casesForPlatform(p.name);
  const roles = rolesOf(links.orgs);
  const certificates = certsOf(links.certs);
  return {
    slug: p.id,
    kind: "platform",
    title: p.name,
    subtitle: `Public profile — ${p.handle}`,
    when: cases.length ? `${cases.length} write-ups here` : "Public profile",
    summary: p.focus,
    story: [p.focus, ...(page ? [page.intro] : [])],
    facts: [
      { label: "Platform", value: p.name },
      { label: "Username", value: p.handle },
      { label: "Profile", value: p.url.replace(/^https?:\/\//, ""), href: p.url },
      /* the platform's numbers; its "write-ups here" count links to them */
      ...p.stats.map((s) => ({ label: s.label, value: s.value, href: /write-ups/i.test(s.label) && page ? `/writeups/${page.slug}` : undefined })),
      ...(cases.length && !p.stats.some((s) => /write-ups/i.test(s.label))
        ? [{ label: "Write-ups here", value: String(cases.length), href: page ? `/writeups/${page.slug}` : undefined }]
        : []),
      ...(certificates.length ? [{ label: "Certificates", value: String(certificates.length) }] : []),
    ],
    stats: p.stats.length ? p.stats : undefined,
    roles,
    certificates,
    photos: [],
    writeups: cases.length ? { platform: p.name, count: cases.length, latest: cases.slice(0, 6), href: page ? `/writeups/${page.slug}` : undefined } : undefined,
    links: [
      { label: `${p.name} profile`, href: p.url, external: true },
      ...(page ? [{ label: `Every ${p.name} write-up`, href: `/writeups/${page.slug}` }] : []),
    ],
  };
}

function recommendationItems(): JourneyItem[] {
  return RECOMMENDATIONS.map((t) => {
    const slug = recommendationSlug(t.author);
    const links = RECOMMENDATION_LINKS[slug] ?? {};
    const roles = rolesOf(links.orgs);
    const [role, relation] = t.source.split(" — ");
    return {
      photosTitle: roles.length ? `Photos from ${roles.map((r) => r.subTag.replace(/\s*\(.*\)$/, "")).join(" and ")}` : undefined,
      slug,
      kind: "recommendation",
      title: t.author,
      subtitle: role!,
      when: t.date ? monthYear(t.date) : "LinkedIn",
      isoDate: t.date,
      summary: `${t.author} (${role}) recommends Ahmed Emad Nasr on LinkedIn: “${t.quote.split("\n")[0]}”`,
      story: [],
      quote: t,
      facts: [
        { label: "Written by", value: t.author },
        { label: "Their role", value: role! },
        ...(relation ? [{ label: "How they know him", value: relation[0]!.toUpperCase() + relation.slice(1) }] : []),
        ...(t.date ? [{ label: "Written", value: monthYear(t.date) }] : []),
        { label: "Where", value: "LinkedIn — the original", href: LINKEDIN_RECOMMENDATIONS_URL },
        { label: "Quoted", value: "Word for word, as written" },
      ],
      roles,
      certificates: certsOf(links.certs),
      photos: photosOf(links.photos),
      links: [{ label: "Read it on LinkedIn", href: LINKEDIN_RECOMMENDATIONS_URL, external: true }],
    };
  });
}

function sportItems(): JourneyItem[] {
  return ATHLETICS.map((a) => {
    const photos = photosOf(SPORT_PHOTOS[a.id]);
    return {
      slug: sportSlug(a),
      kind: "sport",
      title: a.club,
      subtitle: a.sport,
      when: a.years,
      summary: a.detail,
      story: [a.detail],
      facts: [
        { label: "Club", value: a.club },
        { label: "Sport", value: a.sport },
        { label: "Years", value: a.years },
        { label: "Status", value: a.current ? "Current club" : "Past" },
        { label: a.current ? "Events" : "Disciplines", value: a.events.join(" · ") },
        ...(photos.length ? [{ label: "Photos", value: String(photos.length) }] : []),
      ],
      chips: { title: a.current ? "Events" : "The five disciplines", items: a.events },
      roles: [],
      certificates: [],
      photos,
      /* the races in the gallery: each caption names its own event and club */
      photosTitle: a.current ? "On the track — races and medals" : "Pentathlon competitions",
      links: [{ label: "Every athletics photo", href: "/gallery" }],
    };
  });
}

/* data/journey-index.ts lists the platforms without reading data/platforms.ts — check they agree */
const platformList = (thm: TryHackMeStats) => [tryHackMePlatform(thm), ...STATIC_PLATFORMS];
{
  const here = platformList({ ...THM_SNAPSHOT, live: false }).map((p) => p.id).join(",");
  const index = PLATFORM_IDS.map((p) => p.id).join(",");
  if (here !== index) console.warn(`data/journey-index.ts PLATFORM_IDS (${index}) ≠ data/platforms.ts (${here}) — update PLATFORM_IDS`);
}

/** Every /journey page, in the order of the page. `thm` = today's TryHackMe numbers. */
export function journeyItems(thm: TryHackMeStats = { ...THM_SNAPSHOT, live: false }): JourneyItem[] {
  return [...pathItems(), ...platformList(thm).map(platformItem), ...recommendationItems(), ...sportItems()];
}

export const journeyItem = (slug: string, thm?: TryHackMeStats) => journeyItems(thm).find((i) => i.slug === slug);

export const kindOf = (item: JourneyItem) => JOURNEY_KINDS[item.kind];
