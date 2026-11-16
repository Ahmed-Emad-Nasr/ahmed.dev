/* ═══ lib/motion.ts — the site's animation feel, in one place ═══
   Used by FadeIn, SlashDivider and others. */
/* Cubic-bezier ease curve: a gentle start and a long, soft landing
   (ease-out cubic). Was [0.23, 1, 0.32, 1], which jumped off the line. */
export const MOTION_EASE = [0.22, 0.61, 0.36, 1] as const;
/* Default entrance length, in seconds */
export const MOTION_ENTER_DURATION = 0.75; // slow, calm (was 0.43)
/* Gap between elements that enter together, in seconds */
export const MOTION_STAGGER_STEP = 0.09; // one after another, unhurried (was 0.042)
