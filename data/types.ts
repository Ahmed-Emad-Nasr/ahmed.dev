/*
 * ═══ data/types.ts — the SHAPES of the site's data ═══
 * TypeScript types only (no content). They make the editor warn you when a
 * data entry is missing a field or has a typo. If you add a new field to
 * entries in data/portfolio-data.ts, add it to the matching type here too.
 *   ContactInfo / HeroInfo / Profile → PROFILE (data/profile.ts)
 *   Experience                       → one card of the Experience section
 *   WorkType / WorkItem              → one project card (#work)
 *   ArtGalleryItem / Contribution    → gallery images, contribution cards
 *   Stat                             → one StatsBar tile
 *   Language                         → one spoken language
 *   PortfolioData                    → the whole PORTFOLIO_DATA object
 */

interface ContactInfo {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  location: string;
  whatsapp: string;
  youtube: string;
  instagram: string;
  x: string;
  /** "" until a PGP key is published (see data/profile.ts) */
  pgpFingerprint: string;
}

interface HeroSpec {
  label: string;
  value: string;
}

interface HeroInfo {
  tagline: string;
  /** The "Technical Specifications" strip in the hero */
  specs: HeroSpec[];
  cvUrl: string;
}

export interface Profile {
  name: string;
  title: string;
  japaneseTitle: string;
  availability: string;
  /** The areas on the hero's "Focus" row */
  focus: string[];
  /** Roles shown in the hero's animated ticker */
  roles: string[];
  contact: ContactInfo;
  hero: HeroInfo;
}

export interface Experience {
  company: string;
  link: string;
  role: string;
  japaneseRole?: string;
  kind?: "work" | "volunteer" | "education";
  location: string;
  period: string;
  description: string;
  details: string[];
  isEducation?: boolean;
  /** A certificate from the gallery that proves the role */
  proof?: { label: string; href: string };
  /** Case-library filter with the work done in this role */
  cases?: { label: string; params: Record<string, string> };
}

export type WorkType = "lab" | "tool" | "research" | "platform";

interface WorkLink {
  github?: string;
  live?: string;
  playStore?: string;
  appStore?: string;
  docs?: string;
  caseStudy?: string;
  demo?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  type: WorkType;
  tagline: string;
  problem: string;
  role: string;
  stack: string[];
  platform: string;
  status: "live" | "private-demo" | "open-source";
  year: string;
  links: WorkLink;
  metrics: string[];
  featured?: boolean;
}

interface ArtGalleryItem {
  src: string;
  thumb: string;
  title: string;
  description: string;
  category: string;
  keywords: readonly string[];
  creator: string;
}

interface Contribution {
  name: string;
  org: string;
  description: string;
  link: string;
}

export interface Stat {
  target: number;
  suffix: string;
  label: string;
  japanese: string;
  /** Where the number is proven: a section anchor or an external page */
  href?: string;
}

export interface Language {
  code: string;
  name: string;
  level: string;
}

export interface PortfolioData {
  profile: Profile;
  experience: Experience[];
  work: WorkItem[];
  contributions: Contribution[];
  languages: Language[];
  artGallery: ArtGalleryItem[];
}
