/*
 * data/languages.ts — spoken languages: code + level as shown on the home
 * page (the hero's "Languages" row and the contact section).
 *
 * A file of its own: the contact section runs in the browser on every page,
 * and importing it from data/skills.ts or data/portfolio-data.ts would send
 * those whole files with it. data/skills.ts re-exports it.
 */

export const languages = [
  { code: "AR", name: "Arabic", short: "Native" },
  { code: "EN", name: "English", short: "Professional" },
] as const;
