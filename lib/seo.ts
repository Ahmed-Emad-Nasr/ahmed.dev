/*
 * What search engines read about the person: the stable JSON-LD @ids every
 * page points at, the profiles that prove the identity (sameAs) and the
 * keyword sets.
 *
 * ═══ lib/seo.ts ═══
 *   SAME_AS    → add a new public profile (e.g. a new platform) here.
 *   KEYWORDS   → <meta keywords> groups; pages pick the groups they need.
 *   OCCUPATION → the job description used in the person JSON-LD.
 *   youtubeThumb / youtubeWatch / youtubeEmbed → YouTube URL builders.
 */

import { SITE_BASE_URL } from "@/lib/site";
import { YOUTUBE_CHANNEL_URL } from "@/lib/shared";

export const SITE_URL = `${SITE_BASE_URL}/`;

export const PERSON_ID = `${SITE_URL}#person`;
export const WEBSITE_ID = `${SITE_URL}#website`;
export const CHANNEL_ID = `${SITE_URL}#youtube-channel`;

export const PERSON_NAME = "Ahmed Emad Nasr";
export const PERSON_IMAGE = `${SITE_BASE_URL}/Assets/art-gallery/Images/logo/3omda.webp`;

/** A reference to the one Person node — use this instead of a fresh `{ "@type": "Person" }` */
export const PERSON_REF = { "@id": PERSON_ID } as const;

/*
 * Every public profile that is the same person. Order: the strongest identity
 * signals first. Only profiles the site already links to publicly.
 */
export const SAME_AS = [
  "https://www.linkedin.com/in/ahmed-emad-nasr/",
  "https://github.com/Ahmed-Emad-Nasr",
  YOUTUBE_CHANNEL_URL,
  "https://x.com/0x3omda",
  "https://www.instagram.com/ahmed_emad_nasr/",
  "https://tryhackme.com/p/Ahmed.Emad.Nasr",
  "https://profile.hackthebox.com/profile/01a13b5b-f63f-737f-9adc-91a78153a84f",
  "https://cyberdefenders.org/p/ahmed.em.nasr",
  "https://cybertalents.com/members/3omdaa",
] as const;

/*
 * The site-wide keyword set. Grouped by intent so it stays readable and so a
 * page can pick the group that fits it.
 */
export const KEYWORDS = {
  identity: [
    "Ahmed Emad Nasr",
    "Ahmed Emad",
    "Ahmed Nasr",
    "3omda",
    "0x3omda",
  ],
  roles: [
    "Information Security Officer",
    "Information Security Analyst",
    "Cybersecurity Analyst",
    "GRC Analyst",
    "SOC Analyst",
    "Incident Response Analyst",
    "DFIR Analyst",
    "Malware Analyst",
    "IAM Analyst",
    "Data Security Analyst",
    "Cybersecurity Instructor",
  ],
  grc: [
    "Governance Risk and Compliance",
    "ISO 27001",
    "PCI DSS",
    "NIST CSF",
    "COBIT",
    "SWIFT CSP",
    "risk assessment",
    "gap assessment",
    "security policies",
  ],
  operations: [
    "Security Operations Center",
    "SIEM",
    "Wazuh",
    "Splunk",
    "Suricata",
    "EDR",
    "threat hunting",
    "detection engineering",
    "MITRE ATT&CK",
  ],
  response: [
    "incident response",
    "digital forensics",
    "memory forensics",
    "malware analysis",
    "reverse engineering",
    "threat intelligence",
  ],
  identityData: [
    "Identity and Access Management",
    "Privileged Access Management",
    "Active Directory",
    "data security",
    "data loss prevention",
  ],
  place: [
    "cybersecurity Egypt",
    "information security Cairo",
    "cybersecurity Cairo",
    "SOC analyst Cairo",
    "cybersecurity Benha",
    "information security Benha",
    "SOC analyst Egypt",
    "GRC analyst Egypt",
  ],
  /* Per page: what someone types to find THAT page (app/blog, app/teaching, app/gallery) */
  blog: [
    "Ahmed Emad Nasr blog",
    "Ahmed Emad blog",
    "3omda blog",
    "cybersecurity blog",
    "security case studies",
    "incident response write-ups",
    "DFIR case studies",
    "SOC investigation reports",
    "malware analysis reports",
    "CyberDefenders write-ups",
    "TryHackMe write-ups",
    "PortSwigger Web Security Academy labs",
    "Wazuh detection rules",
    "MITRE ATT&CK mapping",
    "triage challenge",
    "SOC home lab",
  ],
  teaching: [
    "Ahmed Emad Nasr instructor",
    "Ahmed Emad Nasr teaching",
    "Ahmed Emad Nasr courses",
    "Ahmed Emad instructor",
    "cybersecurity instructor",
    "cybersecurity instructor Egypt",
    "SOC course",
    "SOC analyst course",
    "cybersecurity diploma",
    "SOC & Cybersecurity Diploma",
    "AMIT Learning cybersecurity",
    "NTI cybersecurity training",
    "Security+ course",
    "CCNA course",
    "cybersecurity training Cairo",
    "student feedback",
  ],
  /* The Arabic teaching page (/ar/teaching): what students in Egypt type */
  teachingAr: [
    "أحمد عماد نصر",
    "أحمد عماد نصر مدرب",
    "مدرب أمن سيبراني",
    "مدرب أمن معلومات",
    "مدرب سايبر سيكيورتي",
    "كورس أمن سيبراني",
    "كورس سايبر سيكيورتي",
    "دبلومة SOC",
    "دبلومة الأمن السيبراني",
    "كورس SOC بالعربي",
    "تدريب أمن المعلومات في مصر",
    "كورس Security+ بالعربي",
    "كورس CCNA بالعربي",
    "AMIT أمن سيبراني",
    "المعهد القومي للاتصالات أمن سيبراني",
  ],
  /* The Arabic gallery (/ar/gallery) */
  galleryAr: [
    "شهادات أحمد عماد نصر",
    "أحمد عماد نصر",
    "شهادات أمن سيبراني",
    "شهادات أمن المعلومات",
    "eJPT",
    "CCNA",
    "مدرب أمن سيبراني",
  ],
  /* The Arabic training page (/ar/training): what companies in Egypt type */
  trainingAr: [
    "تدريب أمن سيبراني للشركات",
    "تدريب سايبر سيكيوريتي للشركات",
    "تدريب SOC للشركات",
    "تدريب أمن المعلومات للموظفين",
    "كورس أمن سيبراني للشركات",
    "تدريب أمن سيبراني في القاهرة",
    "تدريب أمن سيبراني في بنها",
    "مدرب أمن سيبراني للشركات",
    "دبلومة SOC",
  ],
  /* The CV page (/cv) */
  cv: [
    "Ahmed Emad Nasr CV",
    "Ahmed Emad Nasr resume",
    "Ahmed Emad Nasr résumé",
    "Ahmed Emad Nasr information security officer",
    "Ahmed Emad Nasr SOC analyst",
    "information security officer CV Egypt",
    "SOC analyst CV",
    "cybersecurity instructor CV",
  ],
  /* The videos page (/videos) */
  videos: [
    "Ahmed Emad Nasr YouTube",
    "Ahmed Emad Nasr videos",
    "0x3omda YouTube",
    "cybersecurity videos",
    "cybersecurity basics explained",
    "SOC analyst tutorials",
    "Wazuh tutorial",
    "blue team videos",
  ],
  /* The ATT&CK pages (/attack, /attack/<T-id>) */
  attack: [
    "MITRE ATT&CK",
    "ATT&CK techniques",
    "ATT&CK mapping",
    "detection write-ups",
    "SOC investigations",
    "threat detection examples",
    "Ahmed Emad Nasr ATT&CK",
  ],
  /* The platform write-up pages (/writeups/<platform>) */
  writeups: [
    "write-ups",
    "walkthrough",
    "lab solutions",
    "Ahmed Emad Nasr write-ups",
    "0x3omda write-ups",
  ],
  /* The tool pages (/projects/<tool>) */
  tools: [
    "Ahmed Emad Nasr tools",
    "open-source security tools",
    "Python security tool",
    "GitHub Ahmed-Emad-Nasr",
  ],
  /* The training page (/training) */
  training: [
    "cybersecurity training for companies",
    "corporate cybersecurity training",
    "SOC training for teams",
    "SOC analyst training Egypt",
    "cybersecurity training Egypt",
    "cybersecurity trainer Egypt",
    "SOC & Cybersecurity Diploma",
    "Ahmed Emad Nasr training",
    "Ahmed Emad Nasr instructor",
  ],
  gallery: [
    "Ahmed Emad Nasr certificates",
    "Ahmed Emad Nasr certifications",
    "Ahmed Emad Nasr gallery",
    "cybersecurity certifications",
    "CCNA certified",
    "eJPT certified",
    "security credentials",
  ],
} as const;

/** The site-wide list: the person-level groups, deduplicated (the page
    groups — blog, teaching, gallery — are used by their own page) */
export const SITE_KEYWORDS: string[] = [
  ...new Set([
    ...KEYWORDS.identity, ...KEYWORDS.roles, ...KEYWORDS.grc, ...KEYWORDS.operations,
    ...KEYWORDS.response, ...KEYWORDS.identityData, ...KEYWORDS.place,
  ]),
];

/** A page's keyword list: the name variants first, then the page's own terms */
export const pageKeywords = (...groups: (readonly string[])[]): string[] =>
  [...new Set([...KEYWORDS.identity, ...groups.flat()])];

/** BreadcrumbList JSON-LD: Home › … (pairs of name + absolute URL) */
export const breadcrumbs = (trail: readonly (readonly [string, string])[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })),
});

/** O*NET-SOC code for "Information Security Analysts" — the standard occupation id */
export const OCCUPATION = {
  "@type": "Occupation",
  name: "Information Security Officer",
  alternateName: ["Information Security Analyst", "Cybersecurity Analyst"],
  occupationalCategory: {
    "@type": "CategoryCode",
    codeValue: "15-1212.00",
    name: "Information Security Analysts",
    inCodeSet: { "@type": "CategoryCodeSet", name: "O*NET-SOC", url: "https://www.onetonline.org/" },
  },
  occupationLocation: { "@type": "Country", name: "Egypt" },
} as const;

/** YouTube thumbnail URL — hqdefault always exists, maxres does not */
export const youtubeThumb = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
export const youtubeWatch = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
export const youtubeEmbed = (videoId: string) => `https://www.youtube-nocookie.com/embed/${videoId}`;
/* The player address for search engines (VideoObject embedUrl, sitemap
   player_loc): the standard YouTube one, which Google matches to the video.
   The pages themselves embed youtube-nocookie (youtubeEmbed). */
export const youtubePlayer = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;

/* JSON for a <script type="application/ld+json">, escaped so a "</script>"
   inside a description (some cases quote XSS payloads) cannot close the tag */
export const jsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
