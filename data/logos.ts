/*
 * Logos for the organisations, platforms and tools named on the site.
 *
 * ═══ data/logos.ts — drawn by components/ui/OrgLogo.tsx ═══
 * A name gets its logo in this order:
 *   1. LOGO_FILES  — an image file you added yourself (see below);
 *   2. BRAND_ICONS — a one-colour brand mark, drawn in the theme colour
 *      (paths from the Simple Icons project, CC0 — simpleicons.org);
 *   3. otherwise a monogram of its initials, in the same box.
 *
 * HOW TO ADD A COMPANY LOGO (AMIT, NTI, Banque Misr, ITI, DEPI …):
 *   1. Save the logo in public/Assets/logos/ — a square-ish .webp, .png or
 *      .svg, around 200×200, transparent background if possible.
 *   2. Add one line to LOGO_FILES: the name EXACTLY as it is written in
 *      data/experience.ts (subTag), data/teaching.ts (org) or
 *      data/certifications.ts (issuer) → the file path.
 *   That is all: every card showing that name picks the file up.
 *
 * HOW TO ADD A BRAND MARK: add key: "Title" to BRAND_ICONS, the drawing
 * (the single <path d="…"> of a 24×24 SVG) under the same key in
 * data/logo-paths.ts, and a line to BRAND_MATCH.
 */

/** Image files you added: "Name as written in the data" → path under public/ */
export const LOGO_FILES: Record<string, string> = {
  // "AMIT Learning": "Assets/logos/amit.webp",
  // "National Telecommunication Institute (NTI)": "Assets/logos/nti.webp",
  // "Banque Misr": "Assets/logos/banque-misr.webp",
};

/** One-colour brand marks: key → the brand's name. The drawings (one
    24×24 path each) are in data/logo-paths.ts and reach the page through
    one cached file, /icons.svg (app/icons.svg/route.ts). */
const BRAND_ICONS: Record<string, string> = {
  huawei: "Huawei",
  ieee: "IEEE",
  google: "Google",
  tryhackme: "TryHackMe",
  hackthebox: "Hack The Box",
  cyberdefenders: "CyberDefenders",
  cisco: "Cisco",
  redhat: "Red Hat",
  udemy: "Udemy",
  github: "GitHub",
  python: "Python",
  kalilinux: "Kali Linux",
  wireshark: "Wireshark",
  virustotal: "VirusTotal",
  pfsense: "pfSense",
  portswigger: "PortSwigger",
  youtube: "YouTube",
};

/** Which names use which mark — first match wins (tested on the lower-cased name) */
const BRAND_MATCH: readonly (readonly [RegExp, keyof typeof BRAND_ICONS])[] = [
  [/huawei/, "huawei"],
  [/\bieee\b/, "ieee"],
  [/google|\bgdg\b/, "google"],
  [/tryhackme/, "tryhackme"],
  [/hack ?the ?box/, "hackthebox"],
  [/cyberdefenders/, "cyberdefenders"],
  [/cisco/, "cisco"],
  [/red ?hat/, "redhat"],
  [/udemy/, "udemy"],
  [/portswigger/, "portswigger"],
  [/github/, "github"],
  [/youtube/, "youtube"],
  [/^python$/, "python"],
  [/kali/, "kalilinux"],
  [/wireshark/, "wireshark"],
  [/virustotal/, "virustotal"],
  [/pfsense/, "pfsense"],
];

/* "National Telecommunication Institute (NTI)" → NTI · "Banque Misr" → BM ·
   "CyberTalents" → CT · "AMIT Learning" → AMIT · "iSchool" → IS */
export function monogramOf(name: string): string {
  const acronym = name.match(/\(([A-Za-z]{2,5})\)/)?.[1];
  if (acronym) return acronym.toUpperCase();
  const first = name.trim().split(/\s+/)[0] ?? "";
  if (/^[A-Z]{2,5}$/.test(first)) return first;
  const capitals = name.replace(/[^A-Za-z ]/g, "").split(/\s+/).flatMap((w) => w.match(/[A-Z]/g) ?? [w[0]?.toUpperCase() ?? ""]).join("");
  return (capitals.length >= 2 ? capitals : name.slice(0, 2).toUpperCase()).slice(0, 3);
}

/** The brand mark of a name: its key in the sprite (icons.svg#logo-<key>) and its title */
export function brandIconOf(name: string) {
  const lower = name.toLowerCase();
  const hit = BRAND_MATCH.find(([pattern]) => pattern.test(lower));
  return hit ? { key: hit[1], title: BRAND_ICONS[hit[1]] } : undefined;
}
