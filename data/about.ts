/*
 * The "about the work" sections — taken from Sensei-Dev's layout, with
 * Ahmed's own data. Nothing here is a new claim: every line repeats what
 * the experience, cases, certifications or teaching sections already prove.
 *
 * ═══ data/about.ts → components/home/{ToolsSection,PathSection,AthleteSection}.tsx ═══
 *   TOOL_GROUPS → "Tools of the Trade." (#tools) — built from data/skills.ts,
 *                 so the CV skill list and this section never disagree
 *   PATH        → "The Path." — one line per year, from data/experience.ts
 *   ATHLETICS   → "Off the Clock." (#athlete) — the sports
 */

import { skillGroups } from "@/data/skills";

/* One Japanese label per skill group (data/skills.ts ids) */
const GROUP_JP: Record<string, string> = {
  grc: "統治",
  siem: "監視",
  ir: "対応",
  forensics: "鑑識",
  identity: "認証",
  data: "データ",
  vuln: "強化",
  cloud: "雲",
  intel: "脅威",
  network: "網",
  frameworks: "枠組",
  automation: "自動",
};

export const TOOL_GROUPS = skillGroups
  .filter((g) => g.id !== "soft")
  .map((g) => ({ id: g.id, title: g.label, japanese: GROUP_JP[g.id] ?? "技", items: g.items }));

export const PATH = [
  { year: "2022", title: "Started CS", detail: "Began B.Sc. Computer Science (Information Security & Digital Forensics) at Benha University." },
  { year: "2023", title: "Huawei & IEEE", detail: "Network & Cloud Security intern at Huawei; technical instructor and committee member at IEEE." },
  { year: "2024", title: "Teaching security", detail: "Cybersecurity instructor at GDG: 35+ sessions, 10+ CTF challenges, ranked 1st of 250 instructors." },
  { year: "2025", title: "Offense & response", detail: "Penetration Tester trainee at ITI and Incident Response Analyst intern at DEPI." },
  { year: "2026", title: "Graduated with distinction", detail: "Benha University, GPA 3.78 / 4.0 — ranked 8th of 900 in the department." },
  { year: "2026", title: "Banque Misr & instructor", detail: "Information Security intern at Banque Misr; part-time cybersecurity instructor at NTI and AMIT Learning." },
] as const;

/* "Off the Clock." (#athlete, components/home/AthleteSection.tsx): the
   sports, newest first. `years` is shown as written; `events` are the chips. */
export const ATHLETICS = [
  {
    id: "ahly",
    club: "Al Ahly SC",
    sport: "Athletics — middle & long distance",
    years: "6 years · contract renewed",
    current: true,
    japanese: "陸上",
    detail: "Running for Al Ahly, Egypt's most decorated club, for six years — and the contract was just renewed. Middle and long distance.",
    events: ["800 m", "1500 m", "5K", "10K (raced once)"],
  },
  {
    id: "pentathlon",
    club: "Benha Club",
    sport: "Modern pentathlon",
    years: "2016 – 2022",
    current: false,
    japanese: "五種",
    detail: "Six years of the five-sport Olympic event at Benha Club: swim, fence, ride, then shoot and run in one race.",
    events: ["Swimming", "Fencing", "Riding", "Laser shooting", "Running"],
  },
] as const;

