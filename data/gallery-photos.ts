/*
 * ═══ data/gallery-photos.ts — the PERSONAL PHOTOS of /gallery ═══
 *
 * Photos only: classes, events, races, the internship. The certificates have
 * their own page and their own data (data/certificates.ts).
 *
 * THE IMAGES live in their own folder, apart from the certificates:
 *     public/Assets/gallery/<slug>.webp          the photo
 *     public/Assets/gallery/<slug>-thumb.webp    640px grid picture (npm run thumbs)
 *
 * ADD A PHOTO
 *   1. Save it as public/Assets/gallery/<slug>.webp (lowercase-words-with-dashes).
 *   2. Add an entry below (order here = order on the page).
 *   3. npm run thumbs && npm run images:tag   (CI runs both on every deploy)
 *   `source` is for screenshots of official posts: who posted it and when —
 *   the post stays whole in the picture, the caption names it.
 *
 * `legacyIndex` is the number the image had in the old gallery
 * (image_display_thumb/N.webp), for old links. New photos leave it out.
 */

/* The filter buttons of the gallery (labels: data/gallery-copy.ts) */
export type PhotoCategory = "athletics" | "teaching" | "community" | "internship" | "university";

export type GalleryPhoto = {
  /** The file name (Assets/gallery/<slug>.webp) and the #anchor on the page */
  slug: string;
  legacyIndex?: number;
  title: string;
  /** What the photo shows and what happened — the full caption */
  description: string;
  category: PhotoCategory;
  /** The event or programme it belongs to */
  event: string;
  /** ISO date or month ("2025-11-19", "2026-08"), or a year — when known */
  date?: string;
  /** Where it was taken, when known */
  place?: string;
  /** For screenshots of official posts: who posted it and when */
  source?: string;
};

const ROWAD = "Banque Misr — Rowad Information Security summer training";
const ROWAD_PLACE = "Banque Misr, Cairo";
const GDG = "GDG on Campus Benha BootCamp 24/25";
const NTI = "National Telecommunication Institute (NTI) training";

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  /* ─── University ─── */
  {
    slug: "graduation-project-insider-threat-detection-deception-technology",
    legacyIndex: 51,
    title: "Graduation project: Insider Threat Detection Using Deception Technology",
    description:
      "Ahmed after defending his graduation project at the Faculty of Computers & Artificial Intelligence, Benha University, holding the project certificate in front of the title slide \"Insider Threat Detection Using Deception Technology\". The project built an enterprise SOC lab that catches insiders with decoys: a deception layer in Wazuh, pfSense and Suricata monitoring, and a Python script that hashes files, checks them against threat intelligence and quarantines malware.",
    category: "university",
    event: "Graduation project discussion",
    date: "2026",
    place: "Faculty of Computers & AI, Benha University",
  },
  {
    slug: "faculty-of-computers-ai-benha-university",
    legacyIndex: 75,
    title: "At the Faculty of Computers & AI, Benha University",
    description:
      "Ahmed standing outside the Faculty of Computers & Artificial Intelligence, Benha University, where he studied Information Security & Digital Forensics and graduated with the grade Excellent in 2026.",
    category: "university",
    event: "Benha University campus",
    place: "Faculty of Computers & AI, Benha University, Benha",
  },

  /* ─── Athletics ─── */
  {
    slug: "bfcai-union-400m-first-place-benha-university-2025",
    legacyIndex: 59,
    title: "1st place, 400 m — Benha University championship (Nov 2025)",
    description:
      "Official post of the Student Union of the Faculty of Computers & AI, Benha University: for the third time in a row, first place. Ahmed, a fourth-year student, won the 400 m at Benha University level and also took third place in the 100 m — in his first appearance in that championship. Photo: Ahmed with his two medals.",
    category: "athletics",
    event: "Benha University athletics championship — 400 m & 100 m",
    date: "2025-11-19",
    place: "Benha University",
    source: "Official post — BFCAI Student Union (اتحاد طلاب كلية الحاسبات والذكاء الاصطناعي جامعة بنها), 19 November 2025",
  },
  {
    slug: "bfcai-union-100m-first-place-faculty-2025",
    legacyIndex: 62,
    title: "1st place, 100 m — faculty championship (Aug 2025)",
    description:
      "Official post of the Student Union of the Faculty of Computers & AI, Benha University, congratulating the faculty's champions in the 100 m: Ahmed, fourth year, first place, organised by the union's sports committee.",
    category: "athletics",
    event: "Faculty of Computers & AI athletics — 100 m",
    date: "2025-08-11",
    place: "Benha University",
    source: "Official post — BFCAI Student Union, 11 August 2025",
  },
  {
    slug: "bfcai-union-400m-800m-first-place-university-2025",
    legacyIndex: 63,
    title: "1st place, 400 m & 800 m — Benha University (Apr 2025)",
    description:
      "Official post of the Student Union of the Faculty of Computers & AI, Benha University: Ahmed, third year, won first place at university level in the athletics championship — 400 m and 800 m — as part of the university's sports activities. Photo: Ahmed at the track holding his certificate.",
    category: "athletics",
    event: "Benha University athletics championship — 400 m & 800 m",
    date: "2025-04-22",
    place: "Benha University",
    source: "Official post — BFCAI Student Union, 22 April 2025",
  },
  {
    slug: "faculty-official-page-sinai-liberation-marathon-2024",
    legacyIndex: 61,
    title: "1st place — Sinai Liberation Day marathon (Apr 2024)",
    description:
      "Official page of the Faculty of Computers & Artificial Intelligence, Benha University, congratulating Ahmed — then second year, Information Security — on first place in the marathon held for the Sinai Liberation Day celebrations. Photos: Ahmed with the certificate at the track and with his medal.",
    category: "athletics",
    event: "Sinai Liberation Day marathon",
    date: "2024-04-24",
    place: "Benha University",
    source: "Official page of the Faculty of Computers & AI, Benha University (الصفحة الرسمية لكلية الحاسبات والذكاء الاصطناعي جامعة بنها), 24 April 2024",
  },
  {
    slug: "coach-post-from-zero-to-hero-2021",
    legacyIndex: 60,
    title: "\"From zero to hero\" — his coach's post (Dec 2021)",
    description:
      "His swimming coach's post: Ahmed started swimming with him exactly a year earlier, aiming at the national championship of the sports-incentive (الحافز الرياضي) programme while in his final year of secondary school, with only four sessions a week. He went from 10th in the region and around 30th nationally in modern pentathlon (swimming and running) to first in the Cairo region in the biathlon within five months, and on that day third nationally in the sports-incentive championship among more than 100 athletes — while studying for Thanaweya Amma. Photos: Ahmed with his medals.",
    category: "athletics",
    event: "Modern pentathlon — sports-incentive national championship",
    date: "2021-12-18",
    source: "Post by his coach on Facebook, 18 December 2021",
  },
  {
    slug: "cairo-modern-pentathlon-zone-podium-first",
    legacyIndex: 66,
    title: "Winner's podium — Cairo Modern Pentathlon Zone",
    description:
      "Ahmed on the top step of the podium at a Cairo Modern Pentathlon Zone (منطقة القاهرة للخماسي الحديث) competition, with his medal.",
    category: "athletics",
    event: "Cairo Modern Pentathlon Zone competition",
    place: "Cairo",
  },
  {
    slug: "cairo-modern-pentathlon-zone-medal-ceremony",
    legacyIndex: 65,
    title: "Medal ceremony — Cairo Modern Pentathlon Zone",
    description:
      "The medal ceremony of a Cairo Modern Pentathlon Zone competition; Ahmed in the line of athletes waiting for their medals.",
    category: "athletics",
    event: "Cairo Modern Pentathlon Zone competition",
    place: "Cairo",
  },
  {
    slug: "modern-pentathlon-medals-selfie",
    legacyIndex: 69,
    title: "Modern pentathlon — medals with a teammate",
    description: "A selfie of Ahmed and a teammate, both wearing several medals, at a modern pentathlon meet in his Benha Club years (2016–2022).",
    category: "athletics",
    event: "Modern pentathlon — Benha Club",
  },
  {
    slug: "track-medals-with-coach",
    legacyIndex: 67,
    title: "Three medals at the track — with his coach",
    description: "Ahmed at the stadium track with three medals around his neck, beside his coach.",
    category: "athletics",
    event: "Athletics competition",
  },
  {
    slug: "night-race-two-medals",
    legacyIndex: 68,
    title: "Night race — two medals",
    description: "Ahmed on the track after an evening race, holding up his two medals among the other runners.",
    category: "athletics",
    event: "Athletics competition",
  },
  {
    slug: "race-bib-41770-with-coach",
    legacyIndex: 74,
    title: "Race day — bib 41770",
    description: "Ahmed in racing kit with bib 41770 beside his coach on a blue track in front of the stands — middle and long distance.",
    category: "athletics",
    event: "Athletics race",
  },
  {
    slug: "sprint-start-track-race-01",
    legacyIndex: 71,
    title: "Sprint start (1)",
    description: "Ahmed in a black singlet driving out of the start of a track race.",
    category: "athletics",
    event: "Track race",
  },
  {
    slug: "sprint-start-track-race-02",
    legacyIndex: 73,
    title: "Sprint start (2)",
    description: "The start of a track race: Ahmed low and driving off the line.",
    category: "athletics",
    event: "Track race",
  },
  {
    slug: "after-the-race-on-the-track",
    legacyIndex: 72,
    title: "After the race",
    description: "Ahmed walking the track with another runner after a race.",
    category: "athletics",
    event: "Track race",
  },

  /* ─── Teaching & community: GDG ─── */
  {
    slug: "gdg-bootcamp-best-technical-award",
    legacyIndex: 22,
    title: "GDG BootCamp 24/25 — Best Technical, 2nd week",
    description:
      "The stage screen at the GDG on Campus Benha BootCamp 24/25 closing announcing Ahmed as \"Best Technical — 2nd week\" (Gen 24/25 — \"For the last time\"). He was the bootcamp's Cyber Security Technical: 35+ training sessions, 10+ CTF challenges, ranked 1st among 250 instructors.",
    category: "community",
    event: GDG,
    date: "2025",
    place: "Benha University",
  },
  {
    slug: "gdg-instructor-post-cybersecurity-track-students",
    legacyIndex: 64,
    title: "\"It was an honour to be your instructor\" — GDG cybersecurity track",
    description:
      "Ahmed's own post of 6 February 2025: \"It was an honor for me to be your instructor through GDG On Campus – Benha University, and I hope that you have benefited from my experiences and that I have helped you in your beginnings in the cyber-security track\" — with photos of him and his students holding their certificates.",
    category: "teaching",
    event: `${GDG} — cybersecurity track`,
    date: "2025-02-06",
    place: "Benha University",
    source: "Post by Ahmed Emad Eldeen on Facebook, 6 February 2025",
  },
  {
    slug: "gdg-cybersecurity-track-students-certificates",
    legacyIndex: 54,
    title: "GDG cybersecurity track — students with their certificates",
    description:
      "Ahmed with students of his GDG on Campus Benha cybersecurity track, each holding the certificate they earned in the bootcamp.",
    category: "teaching",
    event: `${GDG} — cybersecurity track`,
    date: "2025-02",
    place: "Benha University",
  },
  {
    slug: "gdg-bootcamp-team-sponsors-wall",
    legacyIndex: 55,
    title: "GDG BootCamp team at the sponsors' wall",
    description:
      "The GDG on Campus Benha University bootcamp team in their Google Developer Groups hoodies in front of the sponsors' wall — 3C as strategic career partner, WUZZUF, and the catering sponsors.",
    category: "community",
    event: GDG,
    date: "2025",
    place: "Benha University",
  },
  {
    slug: "gdg-bootcamp-sponsors-wall-trio",
    legacyIndex: 56,
    title: "GDG BootCamp — at the sponsors' wall",
    description:
      "Ahmed with two members of the GDG on Campus Benha team in front of the bootcamp's \"Our Sponsor\" wall (3C, WUZZUF, catering sponsors).",
    category: "community",
    event: GDG,
    date: "2025",
    place: "Benha University",
  },
  {
    slug: "gdg-bootcamp-team-outdoors",
    legacyIndex: 57,
    title: "GDG on Campus Benha — the bootcamp team",
    description:
      "The whole GDG on Campus Benha University bootcamp team together outdoors at the university, in their GDG hoodies and badges.",
    category: "community",
    event: GDG,
    date: "2025",
    place: "Benha University",
  },
  {
    slug: "ghostech-event-software-academy-ieee-benha",
    legacyIndex: 70,
    title: "GhosTech — Software Academy × IEEE Benha",
    description:
      "Ahmed registering at the GhosTech event organised by Software Academy and the IEEE Benha University Student Branch.",
    category: "community",
    event: "GhosTech — Software Academy & IEEE Benha University Student Branch",
    place: "Benha University",
  },
  {
    slug: "tech-event-with-speaker",
    legacyIndex: 58,
    title: "At a tech event",
    description: "Ahmed with a guest at a technology event hall, beside the event's banner stands.",
    category: "community",
    event: "Technology event",
  },

  /* ─── Teaching: NTI ─── */
  {
    slug: "nti-training-creativa-certificate",
    legacyIndex: 50,
    title: "NTI training at Creativa — certificate in hand",
    description:
      "Ahmed holding a certificate outside the Creativa centre (مراكز إبداع مصر الرقمية — Egypt's Digital Creativity Centres) of the Ministry of Communications and Information Technology, during his National Telecommunication Institute (NTI) training.",
    category: "teaching",
    event: NTI,
    place: "Creativa — Egypt Digital Creativity Centre",
  },
  {
    slug: "nti-training-creativa-group-01",
    legacyIndex: 52,
    title: "NTI training at Creativa — the group (1)",
    description:
      "Group photo of Ahmed with the NTI cybersecurity training group in front of the Creativa centre of Egypt's Ministry of Communications and Information Technology.",
    category: "teaching",
    event: NTI,
    place: "Creativa — Egypt Digital Creativity Centre",
  },
  {
    slug: "nti-training-creativa-group-02",
    legacyIndex: 53,
    title: "NTI training at Creativa — the group (2)",
    description:
      "A second group photo of the NTI cybersecurity training group with Ahmed outside the Creativa centre, under the Creativa sign.",
    category: "teaching",
    event: NTI,
    place: "Creativa — Egypt Digital Creativity Centre",
  },

  /* ─── Banque Misr — Rowad internship ─── */
  {
    slug: "banque-misr-museum-rowad-internship",
    legacyIndex: 76,
    title: "At the Banque Misr Museum",
    description:
      "Ahmed in a suit at the Banque Misr Museum (متحف بنك مصر), beside the wall of the bank's history, during the Rowad summer training in Banque Misr's Information Security sector.",
    category: "internship",
    event: ROWAD,
    date: "2026-08",
    place: "Banque Misr Museum, Cairo",
  },
  ...[77, 78, 79, 80, 81, 83, 84, 85, 86, 87, 88].map((n, i) => ({
    slug: `banque-misr-rowad-internship-office-${String(i + 1).padStart(2, "0")}`,
    legacyIndex: n,
    title: `Banque Misr Rowad internship — with the team (${i + 1})`,
    description:
      "Ahmed with a member of the team at Banque Misr's offices during the Rowad summer training in the bank's Information Security sector — the weeks of GRC gap assessments against ISO/IEC 27001, PCI DSS, COBIT and SWIFT CSP, IAM and PAM reviews and the bank's SIEM and DFIR workflows.",
    category: "internship" as const,
    event: ROWAD,
    date: "2026-08",
    place: ROWAD_PLACE,
  })),
  {
    slug: "banque-misr-rowad-internship-office-selfie",
    legacyIndex: 82,
    title: "Banque Misr Rowad internship — with fellow interns",
    description:
      "A selfie Ahmed took with fellow interns at their desks in Banque Misr's offices during the Rowad Information Security summer training.",
    category: "internship",
    event: ROWAD,
    date: "2026-08",
    place: ROWAD_PLACE,
  },
  {
    slug: "banque-misr-rowad-closing-final-presentation",
    legacyIndex: 97,
    title: "Rowad closing day — the final presentation",
    description:
      "The closing day of Banque Misr's Rowad programme: the interns in suits present their work on the screen to the Information Security team.",
    category: "internship",
    event: `${ROWAD} — closing day`,
    date: "2026-08",
    place: ROWAD_PLACE,
  },
  {
    slug: "banque-misr-rowad-closing-cohort",
    legacyIndex: 98,
    title: "Rowad closing day — the cohort",
    description:
      "The Rowad cohort together on the closing day of Banque Misr's Information Security summer training, most of them in the programme's red ties.",
    category: "internship",
    event: `${ROWAD} — closing day`,
    date: "2026-08",
    place: ROWAD_PLACE,
  },
  ...[89, 90, 91, 92, 93, 94, 95, 96].map((n, i) => ({
    slug: `banque-misr-rowad-closing-day-${String(i + 1).padStart(2, "0")}`,
    legacyIndex: n,
    title: `Rowad closing day — with a fellow intern (${i + 1})`,
    description:
      "Ahmed in a grey suit with a fellow intern of the Rowad cohort on the closing day of Banque Misr's Information Security summer training, in the room where the final presentations were given.",
    category: "internship" as const,
    event: `${ROWAD} — closing day`,
    date: "2026-08",
    place: ROWAD_PLACE,
  })),
];

/* ─── Helpers ─── */

const GALLERY_FOLDER = "Assets/gallery";

/** The photo: Assets/gallery/<slug>.webp (no leading slash — normalizePublicHref adds the base path) */
export const photoImagePath = (slug: string): string => `${GALLERY_FOLDER}/${slug}.webp`;
/** The 640px grid picture made by npm run thumbs */
export const photoThumbPath = (slug: string): string => `${GALLERY_FOLDER}/${slug}-thumb.webp`;

export const photoCategoryCount = (category: PhotoCategory): number =>
  GALLERY_PHOTOS.filter((p) => p.category === category).length;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2025-11-19" → "19 November 2025", "2026-08" → "August 2026", "2025" → "2025" */
export const formatPhotoDate = (date?: string): string | undefined => {
  if (!date) return undefined;
  const [y, m, d] = date.split("-").map(Number);
  if (!m) return String(y);
  return d ? `${d} ${MONTHS[m - 1]} ${y}` : `${MONTHS[m - 1]} ${y}`;
};

const CATEGORY_WORDS: Record<PhotoCategory, string[]> = {
  athletics: ["athletics", "running", "track and field", "athlete"],
  teaching: ["cybersecurity instructor", "teaching", "students"],
  community: ["tech community", "GDG", "events"],
  internship: ["Banque Misr", "Rowad", "information security internship"],
  university: ["Benha University", "Faculty of Computers and AI"],
};

/** The words for search engines and for the image file's own metadata */
export const photoKeywords = (p: GalleryPhoto): string[] => [
  ...new Set(["Ahmed Emad Nasr", "Ahmed Emad", p.event, ...(p.place ? [p.place] : []), ...CATEGORY_WORDS[p.category]]),
];
