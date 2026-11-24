/*
 * ═══ data/status.ts — a note that shows only between two dates ═══
 *
 * National service: from `from` to `until` the contact section says replies
 * will be slow, and the footer says so in one line. The day after `until`
 * both disappear by themselves (the site rebuilds every day), and the usual
 * "I reply within a day or two" comes back.
 *
 * CHANGE THE DATES HERE ("YYYY-MM-DD", inclusive). To drop the note early,
 * set `until` to a date in the past.
 */

export const SERVICE = {
  from: "2026-11-24",
  until: "2027-11-30",
  /* The contact section (components/layout/ContactFooter.tsx) */
  contact:
    "I'm on national service until late 2027, so replies will be slow — e-mail still reaches me, and the site keeps itself up to date in the meantime.",
  /* The footer line (components/layout/FooterBar.tsx) */
  footer: "On national service until late 2027",
} as const;

/** Is the note on today? (Cairo date, the dates above inclusive) */
export const onService = (now: Date = new Date()): boolean => {
  /* YYYY-MM-DD in Cairo time, so the note flips at Cairo midnight */
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(now);
  return today >= SERVICE.from && today <= SERVICE.until;
};
