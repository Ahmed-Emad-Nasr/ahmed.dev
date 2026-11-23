/*
 * What search engines read about the person: the stable JSON-LD @ids every
 * page points at, the profiles that prove the identity (sameAs) and the
 * keyword sets.
 *
 * ═══ lib/seo.ts ═══
 *   SAME_AS    → add a new public profile (e.g. a new platform) here.
 *   KEYWORDS   → <meta keywords> groups; pages pick the groups they need.
 *   NAME_SPELLINGS → other ways people write the name (also the Person
 *                alternateName in app/layout.tsx).
 *   NAME_ROLE_NAMES × NAME_ROLE_TERMS → "Ahmed Emad SOC", "Ahmed Emad Nasr GRC" …
 *                built automatically; add a role to NAME_ROLE_TERMS.
 *   Tools and frameworks come from data/skills.ts by themselves.
 *   OCCUPATION → the job description used in the person JSON-LD.
 *   PERSON_AUDIENCE / CHANNEL_AUDIENCE → the follower / subscriber / view
 *                counts as schema.org interactionStatistic (numbers: AUDIENCE
 *                in lib/shared.ts).
 *   withAudience → a description with the audience line added when it fits.
 *   youtubeThumb / youtubeWatch / youtubeEmbed → YouTube URL builders.
 */

import { SITE_BASE_URL } from "@/lib/site";
import { skillGroups } from "@/data/skills";
import {
  AUDIENCE, AUDIENCE_LINE, INSTAGRAM_URL, LINKEDIN_URL, MEDIUM_URL, TIKTOK_URL, X_URL, YOUTUBE_CHANNEL_URL,
} from "@/lib/shared";

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
  LINKEDIN_URL,
  "https://wuzzuf.net/me/ahmed-emad-nasr",
  "https://github.com/Ahmed-Emad-Nasr",
  YOUTUBE_CHANNEL_URL,
  MEDIUM_URL,
  X_URL,
  TIKTOK_URL,
  INSTAGRAM_URL,
  "https://tryhackme.com/p/Ahmed.Emad.Nasr",
  "https://profile.hackthebox.com/profile/01a13b5b-f63f-737f-9adc-91a78153a84f",
  "https://cyberdefenders.org/p/ahmed.em.nasr",
  "https://cybertalents.com/members/3omdaa",
] as const;

/*
 * Other spellings of the name — how people actually type it into Google
 * (Ahmad / Imad / Nassr, the handles, Arabic with and without hamza).
 */
export const NAME_SPELLINGS = [
  "Ahmed Emad Nasr",
  "Ahmed Emad",
  "Ahmed Nasr",
  "Ahmad Emad Nasr",
  "Ahmad Emad",
  "Ahmed Imad Nasr",
  "Ahmed Emad Nassr",
  "Ahmed Emad Naser",
  "Ahmed Emaad Nasr",
  "AhmedEmadNasr",
  "Ahmed-Emad-Nasr",
  "Ahmed_Emad_Nasr",
  "ahmed.emadnasr",
  "ahmed.em.nasr",
  "3omda",
  "3omdaa",
  "0x3omda",
  "أحمد عماد نصر",
  "احمد عماد نصر",
  "أحمد عماد",
  "احمد عماد",
] as const;

/* "<name> <role>": every way someone searches for him by what he does */
const NAME_ROLE_NAMES = ["Ahmed Emad Nasr", "Ahmed Emad", "Ahmed Nasr", "3omda", "0x3omda"] as const;
const NAME_ROLE_TERMS = [
  "SOC", "SOC Analyst", "SOC L1", "GRC", "GRC Analyst", "DFIR", "Digital Forensics",
  "Incident Response", "Incident Responder", "Malware Analysis", "Malware Analyst",
  "Threat Intelligence", "Threat Hunting", "Blue Team", "Detection Engineering",
  "Cybersecurity", "Cyber Security", "Information Security", "InfoSec",
  "Information Security Officer", "Security Analyst", "Security Engineer",
  "IAM", "Data Security", "Cloud Security", "AWS Security", "Wazuh", "SIEM",
  "ISO 27001", "MITRE ATT&CK", "CCNA", "eJPT", "Instructor", "Trainer",
  "Cybersecurity Instructor", "NTI", "AMIT", "Benha University", "Cairo", "Egypt",
  "YouTube", "LinkedIn", "GitHub", "TryHackMe", "CyberDefenders", "Hack The Box",
  "CV", "Resume", "Portfolio", "Blog", "Write-ups",
] as const;
const NAME_ROLE_AR = [
  "أمن سيبراني", "أمن المعلومات", "سايبر سيكيورتي", "SOC", "GRC", "DFIR", "مدرب",
  "كورسات", "يوتيوب", "لينكدإن",
] as const;

/* Every tool and framework he lists (data/skills.ts — soft skills left out) */
const SKILL_TERMS = skillGroups.filter((g) => g.id !== "soft").flatMap((g) => g.items);

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
    "Ahmed Emad Nasr Wuzzuf",
    "أحمد عماد نصر",
    "احمد عماد نصر",
  ],
  /* Other spellings + "<name> <role>" ("Ahmed Emad SOC", "ahmed emad nasr grc" …) */
  spellings: NAME_SPELLINGS,
  nameRoles: [
    ...NAME_ROLE_NAMES.flatMap((n) => NAME_ROLE_TERMS.map((r) => `${n} ${r}`)),
    ...["أحمد عماد نصر", "احمد عماد", "احمد عماد نصر"].flatMap((n) => NAME_ROLE_AR.map((r) => `${n} ${r}`)),
  ],
  /* Every tool / framework from data/skills.ts, and the same with "Ahmed Emad" in front */
  skills: [...SKILL_TERMS, ...SKILL_TERMS.map((t) => `Ahmed Emad ${t}`)],
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
    "Information Security Engineer",
    "Security Analyst",
    "SOC L1 Analyst",
    "Blue Team Analyst",
    "Threat Intelligence Analyst",
    "Threat Hunter",
    "Detection Engineer",
    "Incident Responder",
    "Digital Forensics Analyst",
    "Compliance Analyst",
    "Risk Analyst",
    "Cybersecurity Trainer",
    "Cyber Security Specialist",
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
    "GRC",
    "GDPR",
    "security auditing",
    "compliance",
    "cyber risk management",
    "information security management system",
    "ISMS",
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
    "SOC",
    "SOC L1",
    "blue team",
    "alert triage",
    "log analysis",
    "Sigma rules",
    "YARA rules",
  ],
  response: [
    "incident response",
    "digital forensics",
    "memory forensics",
    "malware analysis",
    "reverse engineering",
    "threat intelligence",
    "DFIR",
    "cyber threat intelligence",
    "IOC analysis",
    "ransomware analysis",
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
    "SOC analyst Cairo Egypt",
    "DFIR Egypt",
    "malware analyst Egypt",
    "information security officer Egypt",
    "cybersecurity instructor Cairo",
    "أمن سيبراني مصر",
    "أمن المعلومات القاهرة",
    "محلل SOC مصر",
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
    "Ahmed Emad CV",
    "Ahmed Emad resume",
    "Ahmed Emad SOC CV",
    "Ahmed Emad GRC CV",
    "GRC analyst CV Egypt",
    "DFIR analyst CV",
  ],
  /* The audience: what people type to find the profiles themselves */
  audience: [
    "Ahmed Emad Nasr LinkedIn",
    "Ahmed Emad Nasr YouTube channel",
    "Ahmed Emad Nasr Medium",
    "Ahmed Emad Nasr TikTok",
    "Ahmed Emad Nasr X",
    "Ahmed_Emad_Nasr",
    "cybersecurity LinkedIn Egypt",
    "cybersecurity YouTube channel Arabic",
    "cybersecurity content creator Egypt",
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
  /* The athlete (#athlete on the home page, data/about.ts → ATHLETICS) */
  athlete: [
    "Ahmed Emad Nasr athlete",
    "Ahmed Emad Nasr Al Ahly",
    "Al Ahly SC athletics",
    "Al Ahly runner",
    "800m 1500m runner Egypt",
    "modern pentathlon Benha",
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
    ...KEYWORDS.spellings, ...KEYWORDS.nameRoles, ...KEYWORDS.skills,
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

/* ─── The audience as structured data ───────────────────────────────────────
   schema.org InteractionCounter: FollowAction on the person = people who
   follow him (Google's ProfilePage reads this), SubscribeAction / WatchAction
   on the channel = subscribers / views. The numbers: AUDIENCE (lib/shared.ts). */

const LINKEDIN_SERVICE = { "@type": "WebSite", name: "LinkedIn", url: "https://www.linkedin.com/" } as const;
const YOUTUBE_SERVICE = { "@type": "WebSite", name: "YouTube", url: "https://www.youtube.com/" } as const;

const counter = (action: string, count: number, service: object) => ({
  "@type": "InteractionCounter",
  interactionType: `https://schema.org/${action}`,
  userInteractionCount: count,
  interactionService: service,
});

/** On the Person node: LinkedIn followers + YouTube subscribers */
export const PERSON_AUDIENCE = [
  counter("FollowAction", AUDIENCE.linkedinFollowers, LINKEDIN_SERVICE),
  counter("SubscribeAction", AUDIENCE.youtubeSubscribers, YOUTUBE_SERVICE),
];

/** On the YouTube channel node: subscribers + total views */
export const CHANNEL_AUDIENCE = [
  counter("SubscribeAction", AUDIENCE.youtubeSubscribers, YOUTUBE_SERVICE),
  counter("WatchAction", AUDIENCE.youtubeViews, YOUTUBE_SERVICE),
];

/**
 * A description with " · 14K+ LinkedIn followers · 600+ YouTube subscribers"
 * added — only when the result still fits `max` characters (search results
 * cut ~155-160, share cards ~200), so a long description is never cut short.
 */
export const withAudience = (text: string, max = 160, line: string = AUDIENCE_LINE): string => {
  const base = text.trim().replace(/[.\s]+$/, "");
  const joined = `${base}. ${line}.`;
  return joined.length <= max ? joined : text;
};
